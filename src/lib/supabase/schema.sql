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

-- 3. Ürünler Tablosu - Güncellendi (V4 Maliyet Takibi için)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  cost_price NUMERIC(10, 2) DEFAULT 0, -- FIFO/LIFO için maliyet alanı
  stock INTEGER DEFAULT 0 NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  marketplace_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Envanter Günlükleri (V4 Detaylandırılmış)
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'manual', -- 'sale', 'adjustment', 'purchase', 'return'
  reason TEXT, -- 'Satis', 'Sayim Farki', 'Alis Faturasi'
  platform TEXT DEFAULT 'ÇantaPlus',
  meta_data JSONB DEFAULT '{}'::jsonb, -- Tedarikçi veya Sipariş ID gibi ekstra veriler
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Müşteriler (CRM)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  tax_id TEXT, -- TCKN/VKN
  tax_office TEXT,
  tags TEXT[], -- 'VIP', 'Iade Eden' vb.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Tedarikçiler
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  balance NUMERIC(10, 2) DEFAULT 0, -- Mevcut borç/alacak bakiyesi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Tedarikçi Hareketleri (Borç/Alacak)
CREATE TABLE IF NOT EXISTS supplier_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL, -- 'payment' (ödeme yaptık), 'purchase' (mal aldık/borçlandık)
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Sistem Logları (Try-Catch çıktıları için)
CREATE TABLE IF NOT EXISTS sys_logs (
-- ... (rest of the file)
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT DEFAULT 'error', -- 'info', 'warn', 'error'
  module TEXT, -- 'e-Logo', 'Trendyol', 'Sync'
  message TEXT NOT NULL,
  stack_trace TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. RLS Politikaları (Admin Sıkılaştırması)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sys_logs ENABLE ROW LEVEL SECURITY;

-- Politikaları admin rolü kontrolüyle tanımla
-- Not: profiles tablosundaki role 'admin' olanlar her şeyi yapabilir.
DO $$ 
BEGIN
  -- Products
  DROP POLICY IF EXISTS "Admins manage products" ON products;
  CREATE POLICY "Admins manage products" ON products FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

  -- Customers
  DROP POLICY IF EXISTS "Admins manage customers" ON customers;
  CREATE POLICY "Admins manage customers" ON customers FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

  -- Suppliers
  DROP POLICY IF EXISTS "Admins manage suppliers" ON suppliers;
  CREATE POLICY "Admins manage suppliers" ON suppliers FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

  -- Sys Logs
  DROP POLICY IF EXISTS "Admins view logs" ON sys_logs;
  CREATE POLICY "Admins view logs" ON sys_logs FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
END $$;
