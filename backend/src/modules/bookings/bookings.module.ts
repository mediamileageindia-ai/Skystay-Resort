// ============================================
// BOOKINGS MODULE — Entity + Service + Controller
// ============================================
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne
} from 'typeorm'
import {
  Controller, Get, Post, Patch, Body, Param,
  UseGuards, Request, Query
} from '@nestjs/common'
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

// ---- ENTITY ----
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  bookingNumber: string

  @Column()
  userId: string

  @Column()
  roomId: string

  @Column({ type: 'date' })
  checkIn: string

  @Column({ type: 'date' })
  checkOut: string

  @Column()
  guests: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  advanceAmount: number

  @Column({ default: 'full' })
  paymentMode: 'full' | 'advance'

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

  @Column({ nullable: true })
  specialRequests: string

  @Column({ nullable: true })
  couponCode: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number

  // Guest snapshot (in case user changes profile later)
  @Column({ type: 'jsonb', nullable: true })
  guestSnapshot: {
    name: string
    email: string
    phone: string
    city?: string
  }

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

// ---- DTOs ----
class GuestInfoDto {
  @IsString() name: string
  @IsString() email: string
  @IsString() phone: string
  @IsOptional() @IsString() city?: string
}

export class CreateBookingDto {
  @IsString() roomId: string
  @IsDateString() checkIn: string
  @IsDateString() checkOut: string
  @IsNumber() guests: number
  @IsEnum(['full', 'advance']) paymentMode: 'full' | 'advance'
  @IsOptional() @IsString() couponCode?: string
  @IsOptional() @IsString() specialRequests?: string
  @IsObject() guestInfo: GuestInfoDto
}

// ---- SERVICE ----
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    private readonly dataSource: DataSource,
  ) {}

  private generateBookingNumber(): string {
    const year = new Date().getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    return `SKY-${year}-${rand}`
  }

  private calcNights(checkIn: string, checkOut: string): number {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(1, Math.round(diff / 86400000))
  }

  async create(dto: CreateBookingDto, userId: string): Promise<Booking> {
    // Validate dates
    if (new Date(dto.checkOut) <= new Date(dto.checkIn)) {
      throw new BadRequestException('Check-out must be after check-in')
    }

    // Check room availability
    const conflict = await this.repo.createQueryBuilder('b')
      .where('b.roomId = :roomId', { roomId: dto.roomId })
      .andWhere('b.status NOT IN (:...statuses)', { statuses: ['cancelled'] })
      .andWhere('b.checkIn < :checkOut', { checkOut: dto.checkOut })
      .andWhere('b.checkOut > :checkIn', { checkIn: dto.checkIn })
      .getOne()

    if (conflict) {
      throw new BadRequestException('Room is not available for selected dates')
    }

    // Get room price (would query RoomsService in real app)
    const pricePerNight = 4999 // placeholder — inject RoomsService
    const nights = this.calcNights(dto.checkIn, dto.checkOut)
    const base = pricePerNight * nights
    const discount = 0 // coupon logic here
    const tax = Math.round((base - discount) * 0.12)
    const total = base - discount + tax
    const advance = Math.round(total * 0.3)

    const booking = this.repo.create({
      bookingNumber:  this.generateBookingNumber(),
      userId,
      roomId:         dto.roomId,
      checkIn:        dto.checkIn,
      checkOut:       dto.checkOut,
      guests:         dto.guests,
      totalAmount:    total,
      advanceAmount:  advance,
      paymentMode:    dto.paymentMode,
      specialRequests: dto.specialRequests,
      couponCode:     dto.couponCode,
      discount,
      guestSnapshot:  dto.guestInfo,
      status:         'pending',
    })

    return this.repo.save(booking)
  }

  async findMyBookings(userId: string): Promise<Booking[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.repo.findOne({ where: { id } })
    if (!booking) throw new NotFoundException('Booking not found')
    return booking
  }

  async confirm(id: string): Promise<Booking> {
    const booking = await this.findById(id)
    booking.status = 'confirmed'
    return this.repo.save(booking)
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findById(id)
    if (booking.userId !== userId) throw new BadRequestException('Not your booking')
    if (booking.status === 'checked_in') throw new BadRequestException('Cannot cancel — already checked in')
    booking.status = 'cancelled'
    return this.repo.save(booking)
  }

  async findAll(filters: { status?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, status } = filters
    const qb = this.repo.createQueryBuilder('b').orderBy('b.createdAt', 'DESC')
    if (status) qb.where('b.status = :status', { status })
    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount()
    return { data, meta: { total, page, limit } }
  }

  async getOccupancyRate(): Promise<number> {
    const totalRooms = 48 // from config/DB
    const today = new Date().toISOString().split('T')[0]
    const occupied = await this.repo.createQueryBuilder('b')
      .where('b.status IN (:...s)', { s: ['confirmed', 'checked_in'] })
      .andWhere('b.checkIn <= :today', { today })
      .andWhere('b.checkOut > :today', { today })
      .getCount()
    return Math.round((occupied / totalRooms) * 100)
  }
}

// ---- CONTROLLER ----
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req) {
    return this.service.create(dto, req.user.id)
  }

  @Get('my')
  myBookings(@Request() req) {
    return this.service.findMyBookings(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id)
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.service.cancel(id, req.user.id)
  }

  // Admin routes
  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query() query: { status?: string; page?: number; limit?: number }) {
    return this.service.findAll(query)
  }

  @Patch(':id/confirm')
  @UseGuards(AdminGuard)
  confirm(@Param('id') id: string) {
    return this.service.confirm(id)
  }
}

// ---- MODULE ----
@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
