-- SQL Learning App - Database Migration
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Saved Queries table
CREATE TABLE IF NOT EXISTS saved_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NULL,
  sql TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  folder TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Query Runs table (history)
CREATE TABLE IF NOT EXISTS query_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_query_id UUID NULL REFERENCES saved_queries(id) ON DELETE SET NULL,
  sql TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  error_message TEXT NULL,
  row_count INTEGER NULL,
  runtime_ms INTEGER NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_saved_queries_user_id ON saved_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_queries_folder ON saved_queries(folder);
CREATE INDEX IF NOT EXISTS idx_saved_queries_is_favorite ON saved_queries(is_favorite);
CREATE INDEX IF NOT EXISTS idx_saved_queries_updated_at ON saved_queries(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_queries_title ON saved_queries USING gin(to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_query_runs_user_id ON query_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_query_runs_created_at ON query_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_runs_saved_query_id ON query_runs(saved_query_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_runs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running migration)
DROP POLICY IF EXISTS "Users can view own saved queries" ON saved_queries;
DROP POLICY IF EXISTS "Users can insert own saved queries" ON saved_queries;
DROP POLICY IF EXISTS "Users can update own saved queries" ON saved_queries;
DROP POLICY IF EXISTS "Users can delete own saved queries" ON saved_queries;

DROP POLICY IF EXISTS "Users can view own query runs" ON query_runs;
DROP POLICY IF EXISTS "Users can insert own query runs" ON query_runs;
DROP POLICY IF EXISTS "Users can update own query runs" ON query_runs;
DROP POLICY IF EXISTS "Users can delete own query runs" ON query_runs;

-- Saved Queries policies
CREATE POLICY "Users can view own saved queries" ON saved_queries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own saved queries" ON saved_queries
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own saved queries" ON saved_queries
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own saved queries" ON saved_queries
  FOR DELETE USING (user_id = auth.uid());

-- Query Runs policies
CREATE POLICY "Users can view own query runs" ON query_runs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own query runs" ON query_runs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own query runs" ON query_runs
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own query runs" ON query_runs
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- TRIGGER: Auto-update updated_at for saved_queries
-- ============================================

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_saved_queries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS saved_queries_updated_at_trigger ON saved_queries;

-- Create trigger
CREATE TRIGGER saved_queries_updated_at_trigger
  BEFORE UPDATE ON saved_queries
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_queries_updated_at();

-- ============================================
-- SAMPLE DATA TABLES FOR SQL LEARNING
-- These are public tables that users can practice queries on
-- ============================================

-- Products table for practice
CREATE TABLE IF NOT EXISTS sample_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table for practice
CREATE TABLE IF NOT EXISTS sample_customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(50),
  country VARCHAR(50) DEFAULT 'USA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table for practice
CREATE TABLE IF NOT EXISTS sample_orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES sample_customers(id),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- Order Items table for practice
CREATE TABLE IF NOT EXISTS sample_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES sample_orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES sample_products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- Enable RLS on sample tables (allow all authenticated users to read)
ALTER TABLE sample_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_order_items ENABLE ROW LEVEL SECURITY;

-- Policies for sample tables (read-only for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view sample_products" ON sample_products;
CREATE POLICY "Authenticated users can view sample_products" ON sample_products
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can view sample_customers" ON sample_customers;
CREATE POLICY "Authenticated users can view sample_customers" ON sample_customers
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can view sample_orders" ON sample_orders;
CREATE POLICY "Authenticated users can view sample_orders" ON sample_orders
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can view sample_order_items" ON sample_order_items;
CREATE POLICY "Authenticated users can view sample_order_items" ON sample_order_items
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Clear existing sample data
TRUNCATE sample_order_items, sample_orders, sample_customers, sample_products RESTART IDENTITY CASCADE;

-- Insert sample products
INSERT INTO sample_products (name, category, price, stock_quantity) VALUES
  ('Laptop Pro 15', 'Electronics', 1299.99, 50),
  ('Wireless Mouse', 'Electronics', 29.99, 200),
  ('Mechanical Keyboard', 'Electronics', 149.99, 75),
  ('USB-C Hub', 'Electronics', 49.99, 150),
  ('Monitor 27"', 'Electronics', 399.99, 30),
  ('Desk Lamp LED', 'Home Office', 39.99, 100),
  ('Ergonomic Chair', 'Furniture', 299.99, 25),
  ('Standing Desk', 'Furniture', 499.99, 15),
  ('Webcam HD', 'Electronics', 79.99, 60),
  ('Noise Canceling Headphones', 'Electronics', 249.99, 40),
  ('Coffee Maker', 'Kitchen', 89.99, 45),
  ('Water Bottle Insulated', 'Kitchen', 24.99, 200),
  ('Notebook Set', 'Office Supplies', 12.99, 500),
  ('Pen Pack Premium', 'Office Supplies', 8.99, 300),
  ('Desk Organizer', 'Office Supplies', 19.99, 80);

-- Insert sample customers
INSERT INTO sample_customers (first_name, last_name, email, city, country) VALUES
  ('John', 'Doe', 'john.doe@email.com', 'New York', 'USA'),
  ('Jane', 'Smith', 'jane.smith@email.com', 'Los Angeles', 'USA'),
  ('Bob', 'Johnson', 'bob.johnson@email.com', 'Chicago', 'USA'),
  ('Alice', 'Williams', 'alice.williams@email.com', 'Houston', 'USA'),
  ('Charlie', 'Brown', 'charlie.brown@email.com', 'Phoenix', 'USA'),
  ('Diana', 'Miller', 'diana.miller@email.com', 'London', 'UK'),
  ('Edward', 'Davis', 'edward.davis@email.com', 'Toronto', 'Canada'),
  ('Fiona', 'Garcia', 'fiona.garcia@email.com', 'Sydney', 'Australia'),
  ('George', 'Martinez', 'george.martinez@email.com', 'Berlin', 'Germany'),
  ('Hannah', 'Robinson', 'hannah.robinson@email.com', 'Paris', 'France');

-- Insert sample orders
INSERT INTO sample_orders (customer_id, order_date, total_amount, status) VALUES
  (1, NOW() - INTERVAL '30 days', 1349.98, 'delivered'),
  (2, NOW() - INTERVAL '25 days', 449.98, 'delivered'),
  (3, NOW() - INTERVAL '20 days', 299.99, 'shipped'),
  (4, NOW() - INTERVAL '15 days', 179.98, 'shipped'),
  (5, NOW() - INTERVAL '10 days', 1549.97, 'processing'),
  (1, NOW() - INTERVAL '7 days', 79.98, 'processing'),
  (6, NOW() - INTERVAL '5 days', 899.98, 'pending'),
  (7, NOW() - INTERVAL '3 days', 249.99, 'pending'),
  (8, NOW() - INTERVAL '2 days', 549.98, 'pending'),
  (9, NOW() - INTERVAL '1 day', 129.98, 'pending'),
  (10, NOW(), 399.99, 'pending'),
  (2, NOW() - INTERVAL '45 days', 699.98, 'delivered'),
  (3, NOW() - INTERVAL '40 days', 149.99, 'cancelled');

-- Insert sample order items
INSERT INTO sample_order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 1299.99),
  (1, 2, 1, 29.99),
  (1, 14, 2, 8.99),
  (2, 5, 1, 399.99),
  (2, 3, 1, 49.99),
  (3, 7, 1, 299.99),
  (4, 3, 1, 149.99),
  (4, 2, 1, 29.99),
  (5, 1, 1, 1299.99),
  (5, 10, 1, 249.99),
  (6, 9, 1, 79.99),
  (7, 8, 1, 499.99),
  (7, 5, 1, 399.99),
  (8, 10, 1, 249.99),
  (9, 8, 1, 499.99),
  (9, 6, 1, 39.99),
  (10, 11, 1, 89.99),
  (10, 6, 1, 39.99),
  (11, 5, 1, 399.99),
  (12, 7, 1, 299.99),
  (12, 5, 1, 399.99),
  (13, 3, 1, 149.99);

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify tables were created
SELECT 'Tables created successfully!' AS status;

-- ============================================
-- SAFE QUERY EXECUTION FUNCTION
-- This function executes SELECT queries safely
-- Only accessible by authenticated users
-- ============================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS execute_safe_query(text);

-- Create the safe query execution function
CREATE OR REPLACE FUNCTION execute_safe_query(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET statement_timeout = '10s'
SET search_path = public
AS $$
DECLARE
  result JSONB;
  query_upper TEXT;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Normalize query for validation
  query_upper := UPPER(TRIM(query_text));
  
  -- Basic validation - must start with SELECT or WITH
  IF NOT (query_upper LIKE 'SELECT%' OR query_upper LIKE 'WITH%' OR query_upper LIKE 'EXPLAIN%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  -- Check for dangerous keywords (additional server-side validation)
  IF query_upper ~ '\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|COPY|VACUUM)\b' THEN
    RAISE EXCEPTION 'Forbidden operation detected';
  END IF;
  
  -- Execute the query and return results as JSON array
  EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || query_text || ') t'
  INTO result;
  
  RETURN result;
  
EXCEPTION
  WHEN query_canceled THEN
    RAISE EXCEPTION 'Query timed out';
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users only
REVOKE ALL ON FUNCTION execute_safe_query(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_safe_query(text) TO authenticated;

-- Add comment
COMMENT ON FUNCTION execute_safe_query IS 'Safely executes SELECT queries for SQL learning app. Only allows read operations with timeout protection.';
