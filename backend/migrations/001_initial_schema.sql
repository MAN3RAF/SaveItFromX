-- ============================================
-- SaveItFromX PostgreSQL / Supabase Schema
-- ============================================

-- 1. Admin Accounts
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Secure Server Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id VARCHAR(128) PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'current',
  site_name VARCHAR(255) NOT NULL DEFAULT 'SaveItFromX',
  hero_heading VARCHAR(255) NOT NULL DEFAULT 'Twitter Video Downloader (X Downloader)',
  hero_description TEXT NOT NULL DEFAULT 'Download X (Twitter) videos and MP3 audio in Full HD 1080p, 720p, and 320kbps. Free, fast, and works seamlessly across all devices.',
  announcement_text TEXT DEFAULT '',
  announcement_enabled BOOLEAN DEFAULT FALSE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  downloads_enabled BOOLEAN DEFAULT TRUE,
  footer_text TEXT NOT NULL DEFAULT '© 2018–2026 SaveItFromX. All rights reserved.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ad Slots Configuration
CREATE TABLE IF NOT EXISTS ad_slots (
  position VARCHAR(64) PRIMARY KEY,
  enabled BOOLEAN DEFAULT FALSE,
  provider VARCHAR(50) DEFAULT 'direct',
  client_id VARCHAR(255),
  slot_id VARCHAR(255),
  responsive BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Anonymous Download Events (Zero PII, no raw post URLs)
CREATE TABLE IF NOT EXISTS download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format VARCHAR(10) NOT NULL,
  quality VARCHAR(50) NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  duration_ms INT NOT NULL DEFAULT 0,
  device_category VARCHAR(50) NOT NULL DEFAULT 'desktop',
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  error_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Settings if not exist
INSERT INTO site_settings (id, site_name, hero_heading, hero_description, footer_text)
VALUES (
  'current',
  'SaveItFromX',
  'Twitter Video Downloader (X Downloader)',
  'Download X (Twitter) videos and MP3 audio in Full HD 1080p, 720p, and 320kbps. Free, fast, and works seamlessly across all devices.',
  '© 2018–2026 SaveItFromX. All rights reserved.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Default Ad Positions
INSERT INTO ad_slots (position, enabled, provider, responsive)
VALUES 
  ('homepage_top', FALSE, 'direct', TRUE),
  ('below_downloader', FALSE, 'direct', TRUE),
  ('download_result', FALSE, 'direct', TRUE),
  ('footer', FALSE, 'direct', TRUE)
ON CONFLICT (position) DO NOTHING;
