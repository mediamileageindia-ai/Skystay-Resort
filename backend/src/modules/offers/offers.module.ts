// ============================================
// OFFERS MODULE — Coupons + Discount Validation
// ============================================
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, BadRequestException } from '@nestjs/common'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsDateString, Min, Max } from 'class-validator'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtAuthGuard } from '../auth/auth.module'
import { AdminGuard } from '../../common/guards/admin.guard'

// ---- ENTITY ----
@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() title: string
  @Column({ nullable: true }) tag: string
  @Column({ type: 'text', nullable: true }) description: string
  @Column() discountType: 'percentage' | 'fixed'
  @Column({ type: 'decimal', precision: 10, scale: 2 }) discountValue: number
  @Column({ unique: true, nullable: true }) couponCode: string
  @Column({ default: 1 }) minNights: number
  @Column({ type: 'timestamp', nullable: true }) validFrom: Date
  @Column({ type: 'timestamp', nullable: true }) validTo: Date
  @Column({ nullable: true }) maxUses: number
  @Column({ default: 0 }) usedCount: number
  @Column({ default: true }) isActive: boolean
  @CreateDateColumn() createdAt: Date
}

// ---- DTOs ----
export class CreateOfferDto {
  @IsString() title: string
  @IsOptional() @IsString() tag?: string
  @IsOptional() @IsString() description?: string
  @IsEnum(['percentage', 'fixed']) discountType: 'percentage' | 'fixed'
  @IsNumber() @Min(0) discountValue: number
  @IsOptional() @IsString() couponCode?: string
  @IsOptional() @IsNumber() @Min(1) minNights?: number
  @IsOptional() @IsDateString() validFrom?: string
  @IsOptional() @IsDateString() validTo?: string
  @IsOptional() @IsNumber() maxUses?: number
}

export class ValidateCouponDto {
  @IsString() code: string
  @IsString() roomId: string
  @IsString() checkIn: string
  @IsString() checkOut: string
}

// ---- SERVICE ----
@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private readonly repo: Repository<Offer>,
  ) {}

  async findAll(): Promise<Offer[]> {
    const now = new Date()
    return this.repo.createQueryBuilder('o')
      .where('o.isActive = true')
      .andWhere('(o.validTo IS NULL OR o.validTo > :now)', { now })
      .orderBy('o.createdAt', 'DESC')
      .getMany()
  }

  async findById(id: string): Promise<Offer> {
    const offer = await this.repo.findOne({ where: { id } })
    if (!offer) throw new NotFoundException('Offer not found')
    return offer
  }

  async validateCoupon(dto: ValidateCouponDto): Promise<{ discountAmount: number; offer: Offer }> {
    const offer = await this.repo.findOne({
      where: { couponCode: dto.code.toUpperCase(), isActive: true }
    })

    if (!offer) throw new BadRequestException('Invalid coupon code')

    const now = new Date()
    if (offer.validFrom && new Date(offer.validFrom) > now)
      throw new BadRequestException('Coupon is not yet active')
    if (offer.validTo && new Date(offer.validTo) < now)
      throw new BadRequestException('Coupon has expired')
    if (offer.maxUses && offer.usedCount >= offer.maxUses)
      throw new BadRequestException('Coupon usage limit reached')

    // Calculate discount amount (simplified — room price lookup would go here)
    const pricePerNight = 4999 // would fetch from RoomsService
    const nights = Math.round(
      (new Date(dto.checkOut).getTime() - new Date(dto.checkIn).getTime()) / 86400000
    )
    if (nights < offer.minNights)
      throw new BadRequestException(`Minimum ${offer.minNights} night(s) required for this coupon`)

    const base = pricePerNight * nights
    const discountAmount = offer.discountType === 'percentage'
      ? Math.round(base * (Number(offer.discountValue) / 100))
      : Number(offer.discountValue)

    return { discountAmount, offer }
  }

  async markUsed(couponCode: string) {
    await this.repo.increment({ couponCode }, 'usedCount', 1)
  }

  async create(dto: CreateOfferDto): Promise<Offer> {
    if (dto.couponCode) dto.couponCode = dto.couponCode.toUpperCase()
    const offer = this.repo.create(dto)
    return this.repo.save(offer)
  }

  async update(id: string, dto: Partial<CreateOfferDto & { isActive: boolean }>): Promise<Offer> {
    const offer = await this.findById(id)
    if (dto.couponCode) dto.couponCode = dto.couponCode.toUpperCase()
    Object.assign(offer, dto)
    return this.repo.save(offer)
  }

  async delete(id: string): Promise<void> {
    const offer = await this.findById(id)
    await this.repo.remove(offer)
  }
}

// ---- CONTROLLER ----
@Controller('offers')
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Get()
  findAll() { return this.service.findAll() }

  @Post('validate')
  validate(@Body() dto: ValidateCouponDto) {
    return this.service.validateCoupon(dto)
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateOfferDto) { return this.service.create(dto) }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: Partial<CreateOfferDto>) { return this.service.update(id, dto) }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id') id: string) { return this.service.delete(id) }
}

// ---- MODULE ----
@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  controllers: [OffersController],
  providers:   [OffersService],
  exports:     [OffersService],
})
export class OffersModule {}
