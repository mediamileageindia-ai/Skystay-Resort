// ============================================
// PAYMENTS MODULE — Razorpay Integration
// ============================================
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { Controller, Post, Body, Param, UseGuards, Request, Get, Res } from '@nestjs/common'
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IsString } from 'class-validator'
import * as crypto from 'crypto'
import Razorpay from 'razorpay'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BookingsService } from '../bookings/bookings.module'
import { BookingsModule } from '../bookings/bookings.module'
import { NotificationsModule } from '../notifications/notifications.module'

// ---- ENTITY ----
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  bookingId: string

  @Column({ default: 'razorpay' })
  gateway: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ default: 'pending' })
  status: 'pending' | 'captured' | 'failed' | 'refunded'

  @Column({ nullable: true })
  razorpayOrderId: string

  @Column({ nullable: true })
  razorpayPaymentId: string

  @Column({ nullable: true })
  transactionId: string

  @CreateDateColumn()
  createdAt: Date
}

// ---- DTOs ----
class VerifyPaymentDto {
  @IsString() razorpayOrderId: string
  @IsString() razorpayPaymentId: string
  @IsString() razorpaySignature: string
  @IsString() bookingId: string
}

class RefundDto {
  amount?: number
  reason?: string
}

// ---- SERVICE ----
@Injectable()
export class PaymentsService {
  private razorpay: Razorpay

  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    private readonly config: ConfigService,
    private readonly bookingsService: BookingsService,
  ) {
    this.razorpay = new Razorpay({
      key_id:     config.get('RAZORPAY_KEY_ID'),
      key_secret: config.get('RAZORPAY_KEY_SECRET'),
    })
  }

  async createOrder(bookingId: string, userId: string) {
    const booking = await this.bookingsService.findById(bookingId)

    // Calculate amount to pay
    const amount = booking.paymentMode === 'advance'
      ? Number(booking.advanceAmount)
      : Number(booking.totalAmount)

    // Create Razorpay order (amount in paise)
    const order = await this.razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency: 'INR',
      receipt:  booking.bookingNumber,
      notes: {
        bookingId,
        bookingNumber: booking.bookingNumber,
      },
    })

    // Save pending payment record
    const payment = this.repo.create({
      bookingId,
      gateway:          'razorpay',
      amount,
      razorpayOrderId:  order.id,
      status:           'pending',
    })
    await this.repo.save(payment)

    return {
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    this.config.get('RAZORPAY_KEY_ID'),
    }
  }

  async verifyPayment(dto: VerifyPaymentDto): Promise<{ success: boolean; bookingNumber: string }> {
    // Verify Razorpay signature
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET')
    const body = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expected !== dto.razorpaySignature) {
      throw new BadRequestException('Payment verification failed — invalid signature')
    }

    // Update payment record
    const payment = await this.repo.findOne({ where: { razorpayOrderId: dto.razorpayOrderId } })
    if (!payment) throw new BadRequestException('Payment record not found')

    payment.status            = 'captured'
    payment.razorpayPaymentId = dto.razorpayPaymentId
    payment.transactionId     = dto.razorpayPaymentId
    await this.repo.save(payment)

    // Confirm booking
    const booking = await this.bookingsService.confirm(dto.bookingId)

    // Send notifications (async — don't await)
    // notificationsService.sendBookingConfirmation(booking)

    return { success: true, bookingNumber: booking.bookingNumber }
  }

  async refund(paymentId: string, amount?: number) {
    const payment = await this.repo.findOne({ where: { id: paymentId } })
    if (!payment || payment.status !== 'captured') {
      throw new BadRequestException('Cannot refund this payment')
    }

    const refundAmount = amount
      ? Math.round(amount * 100)
      : Math.round(Number(payment.amount) * 100)

    await this.razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: refundAmount,
    })

    payment.status = 'refunded'
    await this.repo.save(payment)
    return { success: true, refundAmount: refundAmount / 100 }
  }

  async getInvoice(bookingId: string) {
    // In production: generate PDF using pdfkit or similar
    // Return invoice data for now
    const booking = await this.bookingsService.findById(bookingId)
    const payment = await this.repo.findOne({ where: { bookingId } })
    return { booking, payment }
  }
}

// ---- CONTROLLER ----
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body('bookingId') bookingId: string, @Request() req) {
    return this.service.createOrder(bookingId, req.user.id)
  }

  @Post('verify')
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.service.verifyPayment(dto)
  }

  @Get('invoice/:bookingId')
  getInvoice(@Param('bookingId') bookingId: string) {
    return this.service.getInvoice(bookingId)
  }

  @Post('refund/:paymentId')
  refund(@Param('paymentId') paymentId: string, @Body() dto: RefundDto) {
    return this.service.refund(paymentId, dto.amount)
  }
}

// ---- MODULE ----
@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    BookingsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
