// ============================================
// ADMIN MODULE — Dashboard Stats + Reports
// ============================================
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Module } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/auth.module'
import { AdminGuard } from '../../common/guards/admin.guard'

// ---- SERVICE ----
@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getDashboard() {
    const today = new Date().toISOString().split('T')[0]
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

    // Revenue queries
    const [totalRevenue] = await this.dataSource.query(`
      SELECT COALESCE(SUM(p.amount), 0) as total
      FROM payments p WHERE p.status = 'captured'
    `)

    const [revenueToday] = await this.dataSource.query(`
      SELECT COALESCE(SUM(p.amount), 0) as total
      FROM payments p WHERE p.status = 'captured'
      AND p.created_at::date = $1
    `, [today])

    // Booking counts
    const [bookingsToday] = await this.dataSource.query(`
      SELECT COUNT(*) as count FROM bookings
      WHERE created_at::date = $1 AND status != 'cancelled'
    `, [today])

    const [checkInsToday] = await this.dataSource.query(`
      SELECT COUNT(*) as count FROM bookings
      WHERE check_in = $1 AND status IN ('confirmed','checked_in')
    `, [today])

    const [checkOutsToday] = await this.dataSource.query(`
      SELECT COUNT(*) as count FROM bookings
      WHERE check_out = $1 AND status IN ('confirmed','checked_in','checked_out')
    `, [today])

    // Occupancy
    const [occupied] = await this.dataSource.query(`
      SELECT COUNT(DISTINCT room_id) as count FROM bookings
      WHERE status IN ('confirmed','checked_in')
      AND check_in <= $1 AND check_out > $1
    `, [today])
    const totalRooms  = 48
    const occupancyRate = Math.round((Number(occupied.count) / totalRooms) * 100)

    // Total guests
    const [totalGuests] = await this.dataSource.query(`SELECT COUNT(*) as count FROM users WHERE role = 'guest'`)

    // New leads today
    const [newLeads] = await this.dataSource.query(`
      SELECT COUNT(*) as count FROM leads WHERE created_at::date = $1
    `, [today])

    // Monthly revenue (last 12 months)
    const monthlyRevenue = await this.dataSource.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', p.created_at), 'Mon') as month,
        COALESCE(SUM(p.amount), 0) as revenue,
        COUNT(b.id) as bookings
      FROM generate_series(
        NOW() - INTERVAL '11 months',
        NOW(),
        INTERVAL '1 month'
      ) gs(month_start)
      LEFT JOIN payments p ON
        DATE_TRUNC('month', p.created_at) = DATE_TRUNC('month', gs.month_start)
        AND p.status = 'captured'
      LEFT JOIN bookings b ON
        DATE_TRUNC('month', b.created_at) = DATE_TRUNC('month', gs.month_start)
      GROUP BY DATE_TRUNC('month', gs.month_start), TO_CHAR(DATE_TRUNC('month', p.created_at),'Mon')
      ORDER BY DATE_TRUNC('month', gs.month_start)
    `)

    return {
      totalRevenue:   Number(totalRevenue.total),
      revenueToday:   Number(revenueToday.total),
      bookingsToday:  Number(bookingsToday.count),
      occupancyRate,
      checkInsToday:  Number(checkInsToday.count),
      checkOutsToday: Number(checkOutsToday.count),
      totalGuests:    Number(totalGuests.count),
      newLeads:       Number(newLeads.count),
      monthlyRevenue: monthlyRevenue.map((r: any) => ({
        month:    r.month,
        revenue:  Number(r.revenue),
        bookings: Number(r.bookings),
      })),
    }
  }

  async getRevenue(period: 'daily' | 'monthly' | 'yearly' = 'monthly') {
    const groupBy = {
      daily:   `DATE_TRUNC('day', p.created_at)`,
      monthly: `DATE_TRUNC('month', p.created_at)`,
      yearly:  `DATE_TRUNC('year', p.created_at)`,
    }[period]

    const format = {
      daily:   `'DD Mon'`,
      monthly: `'Mon YYYY'`,
      yearly:  `'YYYY'`,
    }[period]

    return this.dataSource.query(`
      SELECT
        TO_CHAR(${groupBy}, ${format}) as period,
        COALESCE(SUM(amount), 0) as revenue,
        COUNT(*) as transactions
      FROM payments
      WHERE status = 'captured'
      GROUP BY ${groupBy}
      ORDER BY ${groupBy} DESC
      LIMIT 24
    `)
  }

  async getOccupancy() {
    const rooms = await this.dataSource.query(`
      SELECT
        r.room_name,
        r.room_type,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(p.amount), 0) as revenue
      FROM rooms r
      LEFT JOIN bookings b ON b.room_id = r.id AND b.status != 'cancelled'
      LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'captured'
      GROUP BY r.id, r.room_name, r.room_type
      ORDER BY revenue DESC
    `)
    return rooms
  }
}

// ---- CONTROLLER ----
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  dashboard() { return this.service.getDashboard() }

  @Get('revenue')
  revenue(@Query('period') period: 'daily' | 'monthly' | 'yearly' = 'monthly') {
    return this.service.getRevenue(period)
  }

  @Get('occupancy')
  occupancy() { return this.service.getOccupancy() }
}

// ---- MODULE ----
@Module({
  controllers: [AdminController],
  providers:   [AdminService],
  exports:     [AdminService],
})
export class AdminModule {}
