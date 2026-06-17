# Sky Stay Resorts — Full Stack Web Application

**Logo:** Navy Blue (#1b2b6b) + Gold (#c9a84c) · "Memories Recreated"

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| State | Zustand + React Query |
| Forms | React Hook Form + Zod validation |
| Animation | Framer Motion |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL (Amazon RDS in production) |
| Cache | Redis (OTP, sessions, availability) |
| Queue | Bull (notification jobs) |
| Storage | AWS S3 (images, invoices) |
| Payment | Razorpay (UPI, Cards, NetBanking) |
| Email | Amazon SES |
| WhatsApp | WhatsApp Business Platform API |
| SMS | MSG91 |
| Frontend Deploy | Vercel |
| Backend Deploy | AWS EC2 |

---

## Quick Start

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. PostgreSQL Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE skystay;"

# Run schema
psql -U postgres -d skystay -f src/database/schema.sql
```

### 3. Environment Variables

```bash
# Backend
cp .env.example .env
# Fill in: DB credentials, Razorpay keys, AWS keys, WhatsApp token
```

```bash
# Frontend — create .env.local
VITE_API_URL=http://localhost:4000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 4. Redis (for queues)

```bash
# Mac
brew install redis && brew services start redis

# Ubuntu
sudo apt install redis-server && sudo systemctl start redis
```

### 5. Run Development Servers

```bash
# Terminal 1 — Backend (port 4000)
cd backend && npm run start:dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

---

## Project Structure

```
skystay/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/         # Navbar, Footer
│       │   ├── booking/        # Booking flow components
│       │   ├── rooms/          # Room cards, detail
│       │   ├── admin/          # Admin layout, sidebar
│       │   └── portal/         # Customer portal layout
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── RoomsPage.tsx
│       │   ├── booking/        # BookingPage, Success, Failure
│       │   ├── auth/           # Login, Register, ForgotPassword
│       │   ├── portal/         # Bookings, Profile, Invoices
│       │   └── admin/          # Dashboard, Bookings, CRM...
│       ├── services/
│       │   └── api.ts          # All API calls (axios)
│       ├── store/
│       │   └── index.ts        # Zustand stores (auth + booking)
│       └── types/
│           └── index.ts        # All TypeScript types
│
└── backend/
    └── src/
        ├── modules/
        │   ├── auth/           # JWT auth, login, register, OTP
        │   ├── users/          # User CRUD, profile
        │   ├── rooms/          # Room management, availability
        │   ├── bookings/       # Booking engine
        │   ├── payments/       # Razorpay integration
        │   ├── offers/         # Coupons, discount validation
        │   ├── crm/            # Lead capture, visitor tracking
        │   ├── notifications/  # Email/WhatsApp/SMS + cron jobs
        │   ├── admin/          # Dashboard stats, reports
        │   └── reviews/        # Guest reviews
        ├── common/
        │   ├── guards/         # JwtAuthGuard, AdminGuard
        │   └── filters/        # Exception filters
        ├── database/
        │   └── schema.sql      # Full PostgreSQL schema + seed data
        └── main.ts
```

---

## API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
PATCH  /api/auth/me
```

### Rooms
```
GET    /api/rooms
GET    /api/rooms/:slug
GET    /api/rooms/availability?checkIn=&checkOut=&guests=
POST   /api/rooms                   [Admin]
PATCH  /api/rooms/:id               [Admin]
DELETE /api/rooms/:id               [Admin]
POST   /api/rooms/:id/images        [Admin]
```

### Bookings
```
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/:id
PATCH  /api/bookings/:id/cancel
GET    /api/bookings                [Admin]
PATCH  /api/bookings/:id/confirm    [Admin]
```

### Payments
```
POST   /api/payments/create-order
POST   /api/payments/verify
GET    /api/payments/invoice/:bookingId
POST   /api/payments/refund/:paymentId  [Admin]
```

### Offers
```
GET    /api/offers
POST   /api/offers/validate
POST   /api/offers                  [Admin]
PATCH  /api/offers/:id              [Admin]
```

### CRM
```
POST   /api/crm/track
POST   /api/crm/lead
GET    /api/crm/leads               [Admin]
PATCH  /api/crm/leads/:id           [Admin]
POST   /api/crm/leads/:id/whatsapp  [Admin]
```

### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/revenue?period=monthly
GET    /api/admin/occupancy
```

---

## Marketing Automation — CRM Scenarios

| Trigger | Delay | Channel | Template |
|---------|-------|---------|----------|
| Visited, no booking | 1 hour | WhatsApp + Email | Abandoned visit |
| Viewed room, no booking | 24 hours | WhatsApp | Room availability reminder |
| Every Friday | 9 AM cron | WhatsApp + Email | Weekend getaway offer |
| Pongal / Diwali / Christmas / New Year | Scheduled | All channels | Festival campaign |
| Booking tomorrow | Night before | WhatsApp + SMS | Check-in reminder |
| After checkout | 2 hours | Email | Review request |

---

## Payment Flow

```
Guest → Select Room → Enter Dates
  ↓
Create Booking (status: pending)
  ↓
POST /api/payments/create-order → Razorpay Order ID
  ↓
Razorpay Checkout (UPI / GPay / PhonePe / Card / NetBanking)
  ↓
POST /api/payments/verify → Signature validation
  ↓
Booking confirmed → Email + WhatsApp sent → Customer Portal updated
```

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
# Set env: VITE_API_URL, VITE_RAZORPAY_KEY_ID
```

### Backend (AWS EC2)
```bash
# Install Node, PM2, Nginx
npm run build
pm2 start dist/main.js --name skystay-api

# Nginx reverse proxy → port 4000
# SSL via Let's Encrypt (certbot)
```

### Database (Amazon RDS PostgreSQL)
- Instance: db.t3.medium (upgrade as needed)
- Multi-AZ: Yes (production)
- Automated backups: 7 days retention

### S3 Bucket Policy (images)
- Public read for room images
- Private for invoices (signed URLs)

---

## Phase 2 Roadmap

- [ ] Loyalty points system
- [ ] Referral program
- [ ] AI chatbot (booking assistant)
- [ ] AI lead qualification
- [ ] Mobile app (React Native)
- [ ] Google Analytics 4 integration
- [ ] Webhook for OTA sync (MakeMyTrip, Booking.com)
