-- 1. Profiles Tablosu (RBAC) - Yoksa Oluştur
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'staff', -- admin, staff
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Kategoriler Tablosu - Yoksa Oluştur
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Ürünler Tablosu - Yoksa Oluştur
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  marketplace_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Stok Kayıtları Tablosu (V2 Corporate) - Yoksa Oluştur
CREATE TABLE IF NOT EXISTS stock_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT, -- 'sale', 'manual_update', 'marketplace_sync'
  platform TEXT DEFAULT 'ÇantaPlus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Siparişler Tablosu - Güncellendi (V3 e-Logo Entegrasyonu için)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID,
  customer_full_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  tax_id TEXT, -- TCKN veya VKN
  tax_office TEXT,
  total_price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
  platform TEXT NOT NULL DEFAULT 'ÇantaPlus',
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Sipariş Kalemleri Tablosu - Yoksa Oluştur
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  commission_rate NUMERIC(5, 2) DEFAULT 0,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Pazaryeri Eşleşmeleri - Yoksa Oluştur
CREATE TABLE IF NOT EXISTS marketplace_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_sku TEXT NOT NULL,
  external_product_id TEXT,
  sync_status TEXT DEFAULT 'active',
  last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(platform, external_sku)
);

-- 8. Entegrasyonlar Tablosu ve Sütun Kontrolü
CREATE TABLE IF NOT EXISTS integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_name TEXT NOT NULL UNIQUE,
  api_key TEXT,
  api_secret TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- integrations tablosuna eksik sütunları güvenli şekilde ekle
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='integrations' AND column_name='merchant_id') THEN
    ALTER TABLE integrations ADD COLUMN merchant_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='integrations' AND column_name='seller_id') THEN
    ALTER TABLE integrations ADD COLUMN seller_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='integrations' AND column_name='api_status') THEN
    ALTER TABLE integrations ADD COLUMN api_status TEXT DEFAULT 'idle';
  END IF;
END $$;

-- 9. Faturalar Tablosu (Omni-Nexus V3)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  invoice_no TEXT, -- Logo'dan dönen fatura numarası (Örn: GIB2026000000123)
  uuid UUID, -- Logo'daki ETTN numarası
  status TEXT DEFAULT 'draft', -- draft, signed, sent, error
  external_id TEXT, -- Logo'daki dahili ID
  pdf_url TEXT,
  xml_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. RLS Politikaları (Güvenlik)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Ürünler için tam erişim
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY "Authenticated users can manage products" ON products 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Stok logları için tam erişim
DROP POLICY IF EXISTS "Authenticated users can manage stock logs" ON stock_logs;
CREATE POLICY "Authenticated users can manage stock logs" ON stock_logs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kategoriler için tam erişim
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
CREATE POLICY "Authenticated users can manage categories" ON categories 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Siparişler için tam erişim
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON orders;
CREATE POLICY "Authenticated users can manage orders" ON orders 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Faturalar için tam erişim (V3)
DROP POLICY IF EXISTS "Authenticated users can manage invoices" ON invoices;
CREATE POLICY "Authenticated users can manage invoices" ON invoices 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
