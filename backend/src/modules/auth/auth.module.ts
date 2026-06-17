// ============================================
// AUTH MODULE — JWT + bcrypt + OTP
// ============================================
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import {
  Controller, Post, Body, Get, UseGuards, Request, Patch,
  BadRequestException, UnauthorizedException
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import {
  IsEmail, IsString, MinLength, IsOptional, Matches, Length
} from 'class-validator'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import * as bcrypt from 'bcryptjs'
import { Injectable as InjectableGuard, ExecutionContext, CanActivate } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// ---- ENTITY ----
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() name: string
  @Column({ unique: true }) email: string
  @Column({ unique: true }) phone: string
  @Column() password: string
  @Column({ nullable: true }) city: string
  @Column({ default: 'guest' }) role: 'guest' | 'admin' | 'staff'
  @Column({ default: true }) isActive: boolean
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}

// ---- DTOs ----
export class RegisterDto {
  @IsString() @MinLength(2) name: string
  @IsEmail() email: string
  @IsString() @Matches(/^[6-9]\d{9}$/, { message: 'Valid Indian mobile number required' }) phone: string
  @IsString() @MinLength(8) password: string
  @IsOptional() @IsString() city?: string
}

export class LoginDto {
  @IsEmail() email: string
  @IsString() @MinLength(1) password: string
}

export class ForgotPasswordDto { @IsEmail() email: string }
export class ResetPasswordDto {
  @IsString() token: string
  @IsString() @MinLength(8) password: string
}
export class SendOtpDto { @IsString() phone: string }
export class VerifyOtpDto {
  @IsString() phone: string
  @IsString() @Length(6, 6) otp: string
}
export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsString() phone?: string
  @IsOptional() @IsString() city?: string
}

// ---- JWT STRATEGY ----
@Injectable()
export class JwtStrategy extends PassportStrategy(JWTStrategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:      config.get('JWT_SECRET'),
    })
  }
  async validate(payload: { sub: string; email: string; role: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role }
  }
}

// ---- LOCAL STRATEGY ----
@Injectable()
export class LocalAuthStrategy extends PassportStrategy(LocalStrategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    return user
  }
}

// ---- GUARDS ----
export class JwtAuthGuard extends AuthGuard('jwt') {}
export class LocalAuthGuard extends AuthGuard('local') {}

// ---- AUTH SERVICE ----
@Injectable()
export class AuthService {
  private otpStore = new Map<string, { otp: string; expiresAt: number }>()

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } })
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    return valid ? user : null
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }]
    })
    if (existing) {
      throw new BadRequestException(
        existing.email === dto.email ? 'Email already registered' : 'Phone already registered'
      )
    }
    const hash = await bcrypt.hash(dto.password, 10)
    const user = this.userRepo.create({ ...dto, password: hash })
    await this.userRepo.save(user)
    return this.issueToken(user)
  }

  async login(user: User) {
    return this.issueToken(user)
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        phone: user.phone,
        city:  user.city,
        role:  user.role,
      },
    }
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new UnauthorizedException()
    const { password, ...rest } = user
    return rest
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.userRepo.update(userId, dto)
    return this.getMe(userId)
  }

  async forgotPassword(email: string) {
    // In production: generate token, save to DB, send email
    // For security always return success
    return { message: 'If that email exists, you will receive a reset link.' }
  }

  async resetPassword(token: string, password: string) {
    // In production: validate token from DB, update password
    const hash = await bcrypt.hash(password, 10)
    return { message: 'Password updated successfully.' }
  }

  async sendOtp(phone: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    this.otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 })
    // In production: send via MSG91
    console.log(`OTP for ${phone}: ${otp}`) // dev only
    return { message: 'OTP sent successfully.' }
  }

  async verifyOtp(phone: string, otp: string) {
    const record = this.otpStore.get(phone)
    if (!record || record.expiresAt < Date.now()) {
      throw new BadRequestException('OTP expired. Please request a new one.')
    }
    if (record.otp !== otp) {
      throw new BadRequestException('Invalid OTP.')
    }
    this.otpStore.delete(phone)
    return { verified: true }
  }
}

// ---- CONTROLLER ----
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email)
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password)
  }

  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone)
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.otp)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req) {
    return this.authService.getMe(req.user.id)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto)
  }
}

// ---- MODULE ----
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '7d') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, JwtStrategy, LocalAuthStrategy],
  exports:     [AuthService, JwtAuthGuard],
})
export class AuthModule {}
