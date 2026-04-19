-- Profiles Table (RBAC)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'staff', -- admin, staff
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products Table
CREATE TABLE products (
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

-- Stock Logs Table (V2 Corporate)
CREATE TABLE stock_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT, -- 'sale', 'manual_update', 'marketplace_sync'
  platform TEXT DEFAULT 'ÇantaPlus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID, -- References auth.users or a custom customers table
  total_price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  platform TEXT NOT NULL DEFAULT 'ÇantaPlus', -- ÇantaPlus, Trendyol, Hepsiburada, etc.
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  commission_rate NUMERIC(5, 2) DEFAULT 0, -- Pazaryeri komisyon oranı (%)
  shipping_cost NUMERIC(10, 2) DEFAULT 0, -- Bu kalem için kargo maliyeti
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Marketplace Mappings (V2)
CREATE TABLE marketplace_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- Trendyol, Hepsiburada, N11, Ciceksepeti
  external_sku TEXT NOT NULL,
  external_product_id TEXT,
  sync_status TEXT DEFAULT 'active', -- active, paused, error
  last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(platform, external_sku)
);

-- AI Price Logs & Suggestions (V2)
CREATE TABLE ai_price_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  old_price NUMERIC(10, 2) NOT NULL,
  new_price NUMERIC(10, 2) NOT NULL,
  reason TEXT, -- 'Competitor price drop', 'Stock surplus', etc.
  suggested_by_ai BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Finance Summaries (V2)
CREATE TABLE ai_finance_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_date DATE DEFAULT CURRENT_DATE UNIQUE,
  total_revenue NUMERIC(15, 2) NOT NULL,
  total_commission NUMERIC(15, 2) NOT NULL,
  total_shipping NUMERIC(15, 2) NOT NULL,
  net_profit NUMERIC(15, 2) NOT NULL,
  ai_summary TEXT, -- LLM tarafından üretilen metin özeti
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Integrations Table
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_name TEXT NOT NULL UNIQUE,
  api_key TEXT,
  api_secret TEXT,
  merchant_id TEXT, -- Trendyol/Hepsiburada özel
  seller_id TEXT,
  is_active BOOLEAN DEFAULT false,
  api_status TEXT DEFAULT 'idle', -- idle, testing, active, error
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Realtime Setup
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table stock_logs;
alter publication supabase_realtime add table integrations;
alter publication supabase_realtime add table ai_price_logs;
