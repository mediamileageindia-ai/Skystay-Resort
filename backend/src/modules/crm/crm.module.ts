// ============================================
// CRM MODULE — Lead Capture + Visitor Tracking + Pipeline
// ============================================
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, Ip
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtAuthGuard } from '../auth/auth.module'
import { AdminGuard } from '../../common/guards/admin.guard'

// ---- ENTITIES ----
@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ nullable: true }) name: string
  @Column({ nullable: true }) phone: string
  @Column({ nullable: true }) email: string
  @Column({ nullable: true }) source: string
  @Column({ default: 'new' }) status: 'new' | 'warm' | 'hot' | 'converted' | 'lost'
  @Column({ nullable: true }) interest: string   // which room they viewed
  @Column({ nullable: true }) budget: string
  @Column({ type: 'text', nullable: true }) notes: string
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}

@Entity('visitor_events')
export class VisitorEvent {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ nullable: true }) leadId: string
  @Column({ nullable: true }) userId: string
  @Column({ nullable: true }) sessionId: string
  @Column() eventType: string
  @Column({ nullable: true }) page: string
  @Column({ type: 'jsonb', nullable: true }) meta: Record<string, any>
  @CreateDateColumn() createdAt: Date
}

// ---- DTOs ----
export class TrackVisitDto {
  @IsString() page: string
  @IsOptional() @IsString() roomSlug?: string
  @IsOptional() timeSpent?: number
  @IsOptional() @IsString() sessionId?: string
}

export class CaptureLeadDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsString() phone?: string
  @IsOptional() @IsString() email?: string
  @IsString() source: string
  @IsOptional() @IsString() interest?: string
  @IsOptional() @IsString() budget?: string
}

export class UpdateLeadDto {
  @IsOptional() @IsEnum(['new','warm','hot','converted','lost']) status?: string
  @IsOptional() @IsString() notes?: string
  @IsOptional() @IsString() budget?: string
}

// ---- SERVICE ----
@Injectable()
export class CRMService {
  constructor(
    @InjectRepository(Lead)         private leadRepo:  Repository<Lead>,
    @InjectRepository(VisitorEvent) private evtRepo:   Repository<VisitorEvent>,
  ) {}

  // Track page visit — auto-create or update lead
  async trackVisit(dto: TrackVisitDto, ip?: string, userId?: string) {
    // Save visit event
    await this.evtRepo.save(this.evtRepo.create({
      sessionId: dto.sessionId,
      userId,
      eventType: 'page_view',
      page:      dto.page,
      meta:      { roomSlug: dto.roomSlug, timeSpent: dto.timeSpent, ip },
    }))

    // If room page viewed, upgrade lead temperature
    if (dto.roomSlug && userId) {
      // check if lead exists for this user
      // would trigger abandonment automation via NotificationsService queue
    }

    return { tracked: true }
  }

  // Capture lead from contact form or chat widget
  async captureLead(dto: CaptureLeadDto): Promise<Lead> {
    // Check if phone/email already exists
    const existing = await this.leadRepo.findOne({
      where: [
        ...(dto.phone ? [{ phone: dto.phone }] : []),
        ...(dto.email ? [{ email: dto.email }] : []),
      ]
    })

    if (existing) {
      // Update existing lead — upgrade status if needed
      if (existing.status === 'new' && dto.interest) {
        existing.status   = 'warm'
        existing.interest = dto.interest
        return this.leadRepo.save(existing)
      }
      return existing
    }

    const lead = this.leadRepo.create({
      ...dto,
      status: 'new',
    })
    return this.leadRepo.save(lead)
  }

  // Admin: get all leads with filters
  async getLeads(filters: { status?: string; source?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 50, status, source } = filters
    const qb = this.leadRepo.createQueryBuilder('l')
      .orderBy('l.createdAt', 'DESC')

    if (status) qb.andWhere('l.status = :status', { status })
    if (source) qb.andWhere('l.source = :source', { source })

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount()
    return { data, meta: { total, page, limit } }
  }

  // Admin: update lead status / notes
  async updateLead(id: string, dto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.leadRepo.findOne({ where: { id } })
    if (!lead) throw new Error('Lead not found')
    Object.assign(lead, dto)
    return this.leadRepo.save(lead)
  }

  // Admin: trigger WhatsApp to a lead
  async triggerWhatsApp(leadId: string, templateId: string) {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } })
    if (!lead?.phone) throw new Error('Lead has no phone number')

    // In production: send via NotificationsService
    return { sent: true, to: lead.phone, template: templateId }
  }

  // Analytics: lead sources breakdown
  async getLeadSources() {
    const result = await this.leadRepo
      .createQueryBuilder('l')
      .select('l.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('l.source')
      .getRawMany()
    return result
  }

  // Convert lead to booking (marks as converted)
  async convertLead(leadId: string, bookingId: string) {
    await this.leadRepo.update(leadId, { status: 'converted' })
    await this.evtRepo.save(this.evtRepo.create({
      leadId,
      eventType: 'converted',
      meta: { bookingId },
    }))
    return { converted: true }
  }
}

// ---- CONTROLLER ----
@Controller('crm')
export class CRMController {
  constructor(private readonly service: CRMService) {}

  // Public: track visit
  @Post('track')
  track(@Body() dto: TrackVisitDto, @Ip() ip: string, @Request() req: any) {
    return this.service.trackVisit(dto, ip, req.user?.id)
  }

  // Public: capture lead (contact form, chat widget)
  @Post('lead')
  captureLead(@Body() dto: CaptureLeadDto) {
    return this.service.captureLead(dto)
  }

  // Admin routes
  @Get('leads')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getLeads(
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('page')   page?:   number,
  ) {
    return this.service.getLeads({ status, source, page })
  }

  @Patch('leads/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateLead(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.service.updateLead(id, dto)
  }

  @Post('leads/:id/whatsapp')
  @UseGuards(JwtAuthGuard, AdminGuard)
  sendWhatsApp(@Param('id') id: string, @Body('templateId') templateId: string) {
    return this.service.triggerWhatsApp(id, templateId)
  }

  @Get('sources')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getSources() {
    return this.service.getLeadSources()
  }
}

// ---- MODULE ----
@Module({
  imports: [TypeOrmModule.forFeature([Lead, VisitorEvent])],
  controllers: [CRMController],
  providers:   [CRMService],
  exports:     [CRMService],
})
export class CRMModule {}
