// ============================================
// NOTIFICATIONS MODULE
// Email (Amazon SES) + WhatsApp (Business API) + SMS (MSG91)
// ============================================
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { Controller, Get, Patch, Param, Post, Body, UseGuards, Request } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { InjectQueue, Process, Processor, BullModule } from '@nestjs/bull'
import { Job, Queue } from 'bull'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cron, CronExpression, ScheduleModule } from '@nestjs/schedule'
import * as nodemailer from 'nodemailer'
import axios from 'axios'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

// ---- ENTITY ----
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  userId: string

  @Column()
  type: string

  @Column()
  title: string

  @Column({ type: 'text' })
  message: string

  @Column({ default: false })
  isRead: boolean

  @Column({ nullable: true })
  channel: string // email | whatsapp | sms | push

  @Column({ nullable: true })
  recipient: string // email or phone

  @CreateDateColumn()
  sentAt: Date
}

// ---- EMAIL TEMPLATES ----
const emailTemplates = {
  bookingConfirmed: (data: { name: string; bookingNumber: string; room: string; checkIn: string; checkOut: string; amount: number }) => ({
    subject: `Booking Confirmed — ${data.bookingNumber} | Sky Stay Resorts`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#1b2b6b;padding:32px;text-align:center;">
          <h1 style="color:#c9a84c;margin:0;font-size:24px;">Sky Stay Resorts</h1>
          <p style="color:#fff;font-size:12px;letter-spacing:3px;margin-top:4px;">MEMORIES RECREATED</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1b2b6b;font-size:20px;">Booking Confirmed ✓</h2>
          <p style="color:#555;">Dear ${data.name},</p>
          <p style="color:#555;">Your reservation at Sky Stay Resorts is confirmed. We look forward to welcoming you!</p>
          <div style="background:#faf6ee;border:1px solid #e2d5bb;border-radius:4px;padding:20px;margin:24px 0;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="color:#888;padding:6px 0;">Booking Number</td><td style="font-weight:bold;color:#1b2b6b;">${data.bookingNumber}</td></tr>
              <tr><td style="color:#888;padding:6px 0;">Room</td><td style="color:#1b2b6b;">${data.room}</td></tr>
              <tr><td style="color:#888;padding:6px 0;">Check-in</td><td style="color:#1b2b6b;">${data.checkIn}</td></tr>
              <tr><td style="color:#888;padding:6px 0;">Check-out</td><td style="color:#1b2b6b;">${data.checkOut}</td></tr>
              <tr><td style="color:#888;padding:6px 0;">Amount</td><td style="color:#c9a84c;font-weight:bold;">₹${data.amount.toLocaleString('en-IN')}</td></tr>
            </table>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="${process.env.FRONTEND_URL}/portal/bookings" style="background:#c9a84c;color:#1b2b6b;padding:12px 32px;text-decoration:none;font-weight:bold;border-radius:2px;font-size:13px;letter-spacing:2px;">VIEW MY BOOKING</a>
          </div>
          <p style="color:#888;font-size:13px;margin-top:32px;">For assistance: +91 98765 43210 | hello@skystayresorts.com</p>
        </div>
        <div style="background:#1b2b6b;padding:20px;text-align:center;">
          <p style="color:#b8a880;font-size:12px;margin:0;">© Sky Stay Resorts · Tamil Nadu</p>
        </div>
      </div>
    `,
  }),

  abandonedVisit: (data: { name: string }) => ({
    subject: 'You were almost there! — Sky Stay Resorts',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1b2b6b;padding:32px;text-align:center;">
          <h1 style="color:#c9a84c;margin:0;">Sky Stay Resorts</h1>
        </div>
        <div style="padding:32px;">
          <p>Hi ${data.name},</p>
          <p>Thanks for visiting Sky Stay Resorts! We noticed you were browsing our rooms.</p>
          <p>Need help choosing the perfect room for your stay? Our team is here to assist!</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${process.env.FRONTEND_URL}/rooms" style="background:#c9a84c;color:#1b2b6b;padding:12px 32px;text-decoration:none;font-weight:bold;border-radius:2px;">EXPLORE ROOMS</a>
          </div>
          <p style="color:#888;font-size:13px;">WhatsApp us: +91 98765 43210</p>
        </div>
      </div>
    `,
  }),
}

// ---- WHATSAPP TEMPLATES ----
const whatsappTemplates = {
  bookingConfirmed: (data: { name: string; bookingNumber: string; room: string; checkIn: string }) =>
    `✅ *Booking Confirmed!*\n\nDear ${data.name},\n\nYour stay at *Sky Stay Resorts* is confirmed.\n\n📋 *${data.bookingNumber}*\n🛏 ${data.room}\n📅 Check-in: ${data.checkIn}\n\nFor assistance: +91 98765 43210`,

  abandonedVisit: (name: string) =>
    `Hi ${name} 👋\n\nThanks for visiting *Sky Stay Resorts*!\n\nNeed help choosing a room? We're here to assist.\n\nWhatsApp: +91 98765 43210\nWebsite: skystayresorts.com`,

  weekendReminder: (name: string) =>
    `🌄 *Weekend Getaway?*\n\nHi ${name}!\n\nEscape the city this weekend at Sky Stay Resorts.\n\nBook now & save 20%!\n👉 skystayresorts.com`,
}

// ---- NOTIFICATION SERVICE ----
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)
  private emailTransporter: nodemailer.Transporter

  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    private readonly config: ConfigService,
    @InjectQueue('notifications')
    private readonly queue: Queue,
  ) {
    // Amazon SES transporter
    this.emailTransporter = nodemailer.createTransport({
      host:   'email-smtp.ap-south-1.amazonaws.com',
      port:   587,
      secure: false,
      auth: {
        user: config.get('AWS_SES_USER'),
        pass: config.get('AWS_SES_PASS'),
      },
    })
  }

  // ---- EMAIL ----
  async sendEmail(to: string, subject: string, html: string, userId?: string) {
    try {
      await this.emailTransporter.sendMail({
        from:    '"Sky Stay Resorts" <noreply@skystayresorts.com>',
        to,
        subject,
        html,
      })

      await this.repo.save(this.repo.create({
        userId, type: 'email', title: subject,
        message: 'Email sent', channel: 'email', recipient: to,
      }))

      this.logger.log(`Email sent to ${to}`)
    } catch (err) {
      this.logger.error(`Email failed to ${to}:`, err)
    }
  }

  // ---- WHATSAPP ----
  async sendWhatsApp(to: string, message: string, userId?: string) {
    try {
      const phone = to.replace(/\D/g, '')
      await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.get('WHATSAPP_PHONE_ID')}/messages`,
        {
          messaging_product: 'whatsapp',
          to: `91${phone}`,
          type: 'text',
          text: { body: message },
        },
        { headers: { Authorization: `Bearer ${this.config.get('WHATSAPP_TOKEN')}` } }
      )

      await this.repo.save(this.repo.create({
        userId, type: 'whatsapp', title: 'WhatsApp message',
        message, channel: 'whatsapp', recipient: to,
      }))

      this.logger.log(`WhatsApp sent to ${to}`)
    } catch (err) {
      this.logger.error(`WhatsApp failed to ${to}:`, err)
    }
  }

  // ---- SMS (MSG91) ----
  async sendSMS(to: string, message: string) {
    try {
      await axios.get('https://api.msg91.com/api/sendhttp.php', {
        params: {
          authkey:  this.config.get('MSG91_AUTH_KEY'),
          mobiles:  `91${to.replace(/\D/g, '')}`,
          message,
          sender:   'SKYSTAY',
          route:    4,
          country:  91,
        },
      })
      this.logger.log(`SMS sent to ${to}`)
    } catch (err) {
      this.logger.error(`SMS failed to ${to}:`, err)
    }
  }

  // ---- HIGH-LEVEL TRIGGERS ----
  async sendBookingConfirmation(booking: any) {
    const { guestSnapshot: g, bookingNumber, roomId, checkIn, checkOut, totalAmount } = booking
    const roomName = 'Deluxe Garden Room' // lookup from rooms

    const emailTpl = emailTemplates.bookingConfirmed({
      name: g.name, bookingNumber, room: roomName,
      checkIn, checkOut, amount: Number(totalAmount),
    })

    // Queue all notifications
    await this.queue.add('email', { to: g.email, ...emailTpl, userId: booking.userId })
    await this.queue.add('whatsapp', {
      to: g.phone,
      message: whatsappTemplates.bookingConfirmed({ name: g.name, bookingNumber, room: roomName, checkIn }),
    })

    // Save in-app notification
    await this.repo.save(this.repo.create({
      userId: booking.userId,
      type:   'booking_confirmed',
      title:  `Booking Confirmed — ${bookingNumber}`,
      message: `Your ${roomName} is booked from ${checkIn} to ${checkOut}`,
    }))
  }

  async triggerAbandonedVisit(lead: { name?: string; email?: string; phone?: string }) {
    const name = lead.name || 'Valued Guest'
    if (lead.email) {
      const tpl = emailTemplates.abandonedVisit({ name })
      await this.sendEmail(lead.email, tpl.subject, tpl.html)
    }
    if (lead.phone) {
      await this.sendWhatsApp(lead.phone, whatsappTemplates.abandonedVisit(name))
    }
  }

  // ---- CRON JOBS ----
  @Cron('0 9 * * 5') // Every Friday at 9 AM
  async weekendReminderCron() {
    this.logger.log('Sending weekend reminders...')
    // Get all guests who haven't booked in 30 days
    // await this.queue.add('campaign', { type: 'weekend_reminder' })
  }

  @Cron('0 10 * * *') // Daily at 10 AM
  async checkinReminderCron() {
    // Send reminder to guests checking in tomorrow
    this.logger.log('Sending check-in reminders...')
  }

  // ---- USER PORTAL ----
  async getMyNotifications(userId: string) {
    return this.repo.find({ where: { userId }, order: { sentAt: 'DESC' }, take: 20 })
  }

  async markAsRead(id: string) {
    await this.repo.update(id, { isRead: true })
  }

  async markAllRead(userId: string) {
    await this.repo.update({ userId }, { isRead: true })
  }
}

// ---- QUEUE PROCESSOR ----
@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name)

  constructor(private readonly service: NotificationsService) {}

  @Process('email')
  async handleEmail(job: Job) {
    await this.service.sendEmail(job.data.to, job.data.subject, job.data.html, job.data.userId)
  }

  @Process('whatsapp')
  async handleWhatsApp(job: Job) {
    await this.service.sendWhatsApp(job.data.to, job.data.message, job.data.userId)
  }
}

// ---- CONTROLLER ----
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('my')
  myNotifications(@Request() req) {
    return this.service.getMyNotifications(req.user.id)
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.service.markAsRead(id)
  }

  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.service.markAllRead(req.user.id)
  }
}

// ---- MODULE ----
@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.registerQueue({ name: 'notifications' }),
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
