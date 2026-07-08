CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(220) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'CAP',
  summary TEXT,
  price INTEGER NOT NULL,
  sale_price INTEGER,
  badge VARCHAR(40),
  color_name VARCHAR(80),
  tone VARCHAR(40),
  accent VARCHAR(40),
  image_url TEXT,
  detail_title VARCHAR(220),
  detail_description TEXT,
  detail_images TEXT[],
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
  display_order INTEGER NOT NULL DEFAULT 0,
  material VARCHAR(120),
  care TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(220) NOT NULL,
  image_type VARCHAR(40) NOT NULL DEFAULT 'detail',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_options (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_name VARCHAR(80),
  size_name VARCHAR(80) NOT NULL DEFAULT 'FREE',
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  extra_price INTEGER NOT NULL DEFAULT 0,
  option_name VARCHAR(120) NOT NULL DEFAULT 'Default / FREE',
  stock INTEGER NOT NULL DEFAULT 0,
  additional_price INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY,
  customer_email VARCHAR(180),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_option_id BIGINT NOT NULL REFERENCES product_options(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(80) NOT NULL UNIQUE,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  receiver_phone VARCHAR(60),
  shipping_address TEXT,
  total_price INTEGER NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_name VARCHAR(220) NOT NULL,
  option_name VARCHAR(120) NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);
