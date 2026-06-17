-- ============================================
-- SKY STAY RESORTS — PostgreSQL Schema
-- Run: psql -U postgres -d skystay -f schema.sql
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  phone       VARCHAR(20) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  city        VARCHAR(100),
  role        VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest', 'admin', 'staff')),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- ============================================
-- ROOMS
-- ============================================
CREATE TABLE rooms (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_name     VARCHAR(150) NOT NULL,
  slug          VARCHAR(150) UNIQUE NOT NULL,
  room_type     VARCHAR(50) NOT NULL CHECK (room_type IN ('deluxe','suite','villa','cottage','penthouse','romance')),
  price         DECIMAL(10,2) NOT NULL,
  max_guests    INTEGER NOT NULL DEFAULT 2,
  description   TEXT,
  amenities     JSONB DEFAULT '[]',
  status        VARCHAR(30) DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance')),
  sort_order    INTEGER DEFAULT 0,
  is_featured   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE room_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    VARCHAR(200),
  is_primary  BOOLEAN DEFAULT FALSE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_room_images_room ON room_images(room_id);

-- ============================================
-- OFFERS & COUPONS
-- ============================================
CREATE TABLE offers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(150) NOT NULL,
  tag             VARCHAR(50),
  description     TEXT,
  discount_type   VARCHAR(20) CHECK (discount_type IN ('percentage','fixed')),
  discount_value  DECIMAL(10,2) NOT NULL,
  coupon_code     VARCHAR(50) UNIQUE,
  min_nights      INTEGER DEFAULT 1,
  valid_from      TIMESTAMP,
  valid_to        TIMESTAMP,
  max_uses        INTEGER,
  used_count      INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number   VARCHAR(30) UNIQUE NOT NULL,
  user_id          UUID REFERENCES users(id),
  room_id          UUID NOT NULL REFERENCES rooms(id),
  check_in         DATE NOT NULL,
  check_out        DATE NOT NULL,
  guests           INTEGER NOT NULL DEFAULT 2,
  total_amount     DECIMAL(10,2) NOT NULL,
  advance_amount   DECIMAL(10,2),
  payment_mode     VARCHAR(20) DEFAULT 'full' CHECK (payment_mode IN ('full','advance')),
  status           VARCHAR(30) DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','checked_in','checked_out','cancelled')),
  special_requests TEXT,
  coupon_code      VARCHAR(50),
  discount         DECIMAL(10,2) DEFAULT 0,
  guest_snapshot   JSONB,            -- name, email, phone at time of booking
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),

  -- No overlapping bookings for same room
  CONSTRAINT no_overlap EXCLUDE USING gist (
    room_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  ) WHERE (status NOT IN ('cancelled'))
);
CREATE INDEX idx_bookings_user    ON bookings(user_id);
CREATE INDEX idx_bookings_room    ON bookings(room_id);
CREATE INDEX idx_bookings_status  ON bookings(status);
CREATE INDEX idx_bookings_dates   ON bookings(check_in, check_out);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id            UUID NOT NULL REFERENCES bookings(id),
  gateway               VARCHAR(30) DEFAULT 'razorpay',
  amount                DECIMAL(10,2) NOT NULL,
  status                VARCHAR(30) DEFAULT 'pending'
                        CHECK (status IN ('pending','captured','failed','refunded')),
  razorpay_order_id     VARCHAR(100),
  razorpay_payment_id   VARCHAR(100),
  transaction_id        VARCHAR(100),
  created_at            TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_payments_booking ON payments(booking_id);

-- ============================================
-- CRM — LEADS
-- ============================================
CREATE TABLE leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100),
  phone       VARCHAR(20),
  email       VARCHAR(150),
  source      VARCHAR(50) CHECK (source IN ('website','whatsapp','google_ads','facebook','instagram','direct')),
  status      VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new','warm','hot','converted','lost')),
  interest    VARCHAR(100),  -- which room they viewed
  budget      VARCHAR(50),
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_phone  ON leads(phone);

-- CRM visitor tracking
CREATE TABLE visitor_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID REFERENCES leads(id),
  user_id     UUID REFERENCES users(id),
  session_id  VARCHAR(100),
  event_type  VARCHAR(50),   -- page_view, room_view, booking_started, etc.
  page        VARCHAR(200),
  meta        JSONB,
  created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_events_lead    ON visitor_events(lead_id);
CREATE INDEX idx_events_session ON visitor_events(session_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id),
  type        VARCHAR(50) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  channel     VARCHAR(20),  -- email, whatsapp, sms, push
  recipient   VARCHAR(200),
  sent_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user   ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE NOT is_read;

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id),
  room_id     UUID REFERENCES rooms(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO rooms (room_name, slug, room_type, price, max_guests, description, amenities, is_featured) VALUES
('Deluxe Garden Room',    'deluxe-garden-room',    'deluxe',    4999,  2, 'Wake up to lush garden views in our spacious deluxe rooms with premium amenities.',         '["Free WiFi","AC","Smart TV","Minibar","Safe","Hot water","Garden view balcony"]', TRUE),
('Premium Valley Suite',  'premium-valley-suite',  'suite',     7999,  2, 'Panoramic valley views from your private balcony with separate living area and jacuzzi.', '["Free WiFi","AC","Jacuzzi","Lounge area","Smart TV","Minibar","Valley view"]',  TRUE),
('Luxury Pool Villa',     'luxury-pool-villa',     'villa',     15999, 4, 'Your own private plunge pool, outdoor dining cabana, and butler service.',                 '["Private pool","Butler service","Outdoor dining","Free WiFi","AC","Kitchen"]',  TRUE),
('Forest Retreat Cottage','forest-retreat-cottage','cottage',   6499,  2, 'Rustic luxury nestled in the forest with wood-finished interiors and bonfire pit.',         '["Free WiFi","AC","Outdoor shower","Bonfire pit","Forest view","Hammock"]',      FALSE),
('Horizon Penthouse',     'horizon-penthouse',     'penthouse', 22999, 6, 'Rooftop penthouse with 360° views, private terrace, personal chef service on request.',    '["360° views","Private terrace","Chef service","Free WiFi","AC","6 guests"]',   FALSE),
('Romance Suite',         'romance-suite',         'romance',   9999,  2, 'Designed for couples — floral decor, rose bath, private terrace and complimentary champagne.','["Rose bath","Champagne","Private terrace","Couple spa","Free WiFi","AC"]',    TRUE);

-- Default admin user (password: Admin@123 — change immediately)
INSERT INTO users (name, email, phone, password, role) VALUES
('Resort Admin', 'admin@skystayresorts.com', '9999999999',
 '$2b$10$rK3Q7Mh0WIjKOV6n6eSMTe5fIEUy4G6pjmPXZ0lS1VvHl8cE7FWGy', -- Admin@123
 'admin');

-- Sample offers
INSERT INTO offers (title, tag, description, discount_type, discount_value, coupon_code, valid_from, valid_to) VALUES
('Weekend Getaway',  'WEEKEND',    'Stay 2 nights, save big. Includes breakfast for 2.',         'percentage', 20, 'WEEKEND20', NOW(), NOW() + INTERVAL '3 months'),
('Early Bird 30',    'EARLY BIRD', 'Book 30 days ahead and unlock our best rates.',              'percentage', 30, 'EARLY30',   NOW(), NOW() + INTERVAL '6 months'),
('Honeymoon Special','HONEYMOON',  'Candle-lit dinner, rose bath, couple spa and champagne.',    'fixed',       2000, 'HONEY2000', NOW(), NOW() + INTERVAL '12 months'),
('Pongal Festival',  'PONGAL',     'Traditional feast, cultural performances and bonfire night.','percentage', 15, 'PONGAL25',  NOW(), NOW() + INTERVAL '1 month');
