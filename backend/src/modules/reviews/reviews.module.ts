// ============================================
// REVIEWS MODULE
// ============================================
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, BadRequestException } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtAuthGuard } from '../auth/auth.module'
import { AdminGuard } from '../../common/guards/admin.guard'

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() userId: string
  @Column({ nullable: true }) roomId: string
  @Column({ type: 'int' }) rating: number
  @Column({ type: 'text', nullable: true }) comment: string
  @Column({ default: false }) isApproved: boolean
  @CreateDateColumn() createdAt: Date
}

export class CreateReviewDto {
  @IsOptional() @IsString() roomId?: string
  @IsNumber() @Min(1) @Max(5) rating: number
  @IsOptional() @IsString() comment?: string
}

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private readonly repo: Repository<Review>) {}

  async findAll(roomId?: string) {
    const qb = this.repo.createQueryBuilder('r')
      .where('r.isApproved = true')
      .orderBy('r.createdAt', 'DESC')
    if (roomId) qb.andWhere('r.roomId = :roomId', { roomId })
    return qb.getMany()
  }

  async create(dto: CreateReviewDto, userId: string): Promise<Review> {
    const review = this.repo.create({ ...dto, userId, isApproved: false })
    return this.repo.save(review)
  }

  async approve(id: string): Promise<Review> {
    const r = await this.repo.findOne({ where: { id } })
    if (!r) throw new BadRequestException('Review not found')
    r.isApproved = true
    return this.repo.save(r)
  }

  async getStats() {
    const result = await this.repo.createQueryBuilder('r')
      .select('AVG(r.rating)', 'avgRating')
      .addSelect('COUNT(*)',   'total')
      .where('r.isApproved = true')
      .getRawOne()
    return result
  }
}

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get()
  findAll(@Query('roomId') roomId?: string) { return this.service.findAll(roomId) }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateReviewDto, @Request() req: any) {
    return this.service.create(dto, req.user.id)
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  approve(@Param('id') id: string) { return this.service.approve(id) }
}

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

// ============================================
// USERS MODULE
// ============================================
import { Controller as UsersController2, Get as UsersGet, UseGuards as UsersGuards2, Param as UsersParam } from '@nestjs/common'
import { Injectable as UsersInjectable } from '@nestjs/common'
import { InjectRepository as UsersInjectRepo } from '@nestjs/typeorm'
import { Repository as UsersRepo } from 'typeorm'
import { Module as UsersModule2 } from '@nestjs/common'
import { TypeOrmModule as UsersTypeORM } from '@nestjs/typeorm'
import { User } from '../auth/auth.module'
import { JwtAuthGuard as UsersJwtGuard } from '../auth/auth.module'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.repo.findAndCount({
      where: { role: 'guest' },
      select: ['id','name','email','phone','city','createdAt'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, meta: { total, page, limit } }
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id }, select: ['id','name','email','phone','city','createdAt'] })
  }
}

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  findAll(@Query('page') page?: number) { return this.service.findAll(page) }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id) }
}

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// ============================================
// ADMIN GUARD
// ============================================
import { Injectable as GuardInjectable, ExecutionContext, CanActivate, ForbiddenException } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user    = request.user

    if (!user) throw new ForbiddenException('Authentication required')
    if (user.role !== 'admin' && user.role !== 'staff') {
      throw new ForbiddenException('Admin access required')
    }
    return true
  }
}
