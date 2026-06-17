// ============================================
// ROOMS MODULE — Entity + Service + Controller
// ============================================
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm'
import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, UseInterceptors, UploadedFiles
} from '@nestjs/common'
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import {
  IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, Min
} from 'class-validator'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/auth.module'
import { AdminGuard } from '../../common/guards/admin.guard'

// ---- ENTITIES ----
@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() roomName: string
  @Column({ unique: true }) slug: string
  @Column() roomType: string
  @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number
  @Column({ default: 2 }) maxGuests: number
  @Column({ type: 'text', nullable: true }) description: string
  @Column({ type: 'jsonb', default: [] }) amenities: string[]
  @Column({ default: 'available' }) status: 'available' | 'occupied' | 'maintenance'
  @Column({ default: 0 }) sortOrder: number
  @Column({ default: false }) isFeatured: boolean
  @OneToMany(() => RoomImage, img => img.room, { eager: true }) images: RoomImage[]
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}

@Entity('room_images')
export class RoomImage {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() roomId: string
  @Column({ type: 'text' }) url: string
  @Column({ nullable: true }) altText: string
  @Column({ default: false }) isPrimary: boolean
  @Column({ default: 0 }) sortOrder: number
  @CreateDateColumn() createdAt: Date
}

// ---- DTOs ----
export class CreateRoomDto {
  @IsString() roomName: string
  @IsString() slug: string
  @IsEnum(['deluxe','suite','villa','cottage','penthouse','romance']) roomType: string
  @IsNumber() @Min(1) price: number
  @IsNumber() @Min(1) maxGuests: number
  @IsOptional() @IsString() description?: string
  @IsOptional() @IsArray() amenities?: string[]
  @IsOptional() @IsBoolean() isFeatured?: boolean
}

export class UpdateRoomDto {
  @IsOptional() @IsString() roomName?: string
  @IsOptional() @IsNumber() @Min(1) price?: number
  @IsOptional() @IsEnum(['available','occupied','maintenance']) status?: string
  @IsOptional() @IsString() description?: string
  @IsOptional() @IsArray() amenities?: string[]
  @IsOptional() @IsBoolean() isFeatured?: boolean
}

// ---- SERVICE ----
@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)      private roomRepo: Repository<Room>,
    @InjectRepository(RoomImage) private imgRepo:  Repository<RoomImage>,
    private readonly config: ConfigService,
  ) {}

  async findAll(filters?: { type?: string; status?: string }) {
    const qb = this.roomRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.images', 'img')
      .orderBy('r.sortOrder', 'ASC')

    if (filters?.type)   qb.andWhere('r.roomType = :type',     { type:   filters.type })
    if (filters?.status) qb.andWhere('r.status = :status',     { status: filters.status })

    return qb.getMany()
  }

  async findBySlug(slug: string): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { slug },
      relations: ['images'],
    })
    if (!room) throw new NotFoundException(`Room "${slug}" not found`)
    return room
  }

  async checkAvailability(params: {
    checkIn:   string
    checkOut:  string
    guests:    number
    roomType?: string
  }) {
    const allRooms = await this.findAll({ type: params.roomType })

    // Dynamically import to avoid circular dep
    const { DataSource } = await import('typeorm')

    const results = await Promise.all(
      allRooms.map(async room => {
        if (room.maxGuests < params.guests) return { ...room, isAvailable: false }

        // Check overlapping confirmed bookings
        const count = await this.roomRepo.manager
          .createQueryBuilder()
          .select('b.id')
          .from('bookings', 'b')
          .where('b.room_id = :roomId', { roomId: room.id })
          .andWhere("b.status NOT IN ('cancelled')")
          .andWhere('b.check_in < :checkOut', { checkOut: params.checkOut })
          .andWhere('b.check_out > :checkIn',  { checkIn:  params.checkIn })
          .getCount()

        const nights = Math.round(
          (new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / 86400000
        )
        const base  = Number(room.price) * nights
        const tax   = Math.round(base * 0.12)
        const total = base + tax

        return {
          room,
          isAvailable:  count === 0,
          totalNights:  nights,
          baseAmount:   base,
          taxAmount:    tax,
          totalAmount:  total,
        }
      })
    )

    return results.filter(r => r.isAvailable)
  }

  async create(dto: CreateRoomDto): Promise<Room> {
    const existing = await this.roomRepo.findOne({ where: { slug: dto.slug } })
    if (existing) throw new BadRequestException('A room with this slug already exists')
    const room = this.roomRepo.create(dto)
    return this.roomRepo.save(room)
  }

  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomRepo.findOne({ where: { id } })
    if (!room) throw new NotFoundException('Room not found')
    Object.assign(room, dto)
    return this.roomRepo.save(room)
  }

  async delete(id: string): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { id } })
    if (!room) throw new NotFoundException('Room not found')
    await this.roomRepo.remove(room)
  }

  async uploadImages(roomId: string, files: Express.Multer.File[]): Promise<RoomImage[]> {
    const room = await this.roomRepo.findOne({ where: { id: roomId } })
    if (!room) throw new NotFoundException('Room not found')

    // In production: upload to S3, get URLs
    const images = files.map((file, i) =>
      this.imgRepo.create({
        roomId,
        url:       `/uploads/${file.filename}`, // S3 URL in prod
        isPrimary: i === 0 && room.images?.length === 0,
        sortOrder: (room.images?.length || 0) + i,
      })
    )

    return this.imgRepo.save(images)
  }
}

// ---- CONTROLLER ----
@Controller('rooms')
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @Get()
  findAll(
    @Query('type')   type?:   string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll({ type, status })
  }

  @Get('availability')
  checkAvailability(
    @Query('checkIn')   checkIn:   string,
    @Query('checkOut')  checkOut:  string,
    @Query('guests')    guests:    number,
    @Query('roomType')  roomType?: string,
  ) {
    return this.service.checkAvailability({ checkIn, checkOut, guests: Number(guests), roomType })
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug)
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateRoomDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, AdminGuard)
  uploadImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.service.uploadImages(id, files)
  }
}

// ---- MODULE ----
@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomImage])],
  controllers: [RoomsController],
  providers:   [RoomsService],
  exports:     [RoomsService],
})
export class RoomsModule {}
