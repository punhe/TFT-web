'use client';

import { useState } from 'react';
import {
    Card,
    CardBody,
    Button,
    Tabs,
    Tab,
    Chip,
    Divider,
    Code,
} from '@heroui/react';
import { m } from 'framer-motion';
import {
    FiCopy,
    FiCheckCircle,
    FiDatabase,
    FiExternalLink,
    FiCode,
    FiArrowRight,
} from 'react-icons/fi';

const MIGRATION_SQL = `-- SQL Learning App - Database Migration
-- Copy this entire content and run in Supabase SQL Editor

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

CREATE INDEX IF NOT EXISTS idx_query_runs_user_id ON query_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_query_runs_created_at ON query_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_runs_saved_query_id ON query_runs(saved_query_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_runs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
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
-- TRIGGER: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_saved_queries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS saved_queries_updated_at_trigger ON saved_queries;

CREATE TRIGGER saved_queries_updated_at_trigger
  BEFORE UPDATE ON saved_queries
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_queries_updated_at();

-- ============================================
-- SAMPLE DATA TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS sample_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sample_customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(50),
  country VARCHAR(50) DEFAULT 'USA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sample_orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES sample_customers(id),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS sample_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES sample_orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES sample_products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- Enable RLS on sample tables
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

TRUNCATE sample_order_items, sample_orders, sample_customers, sample_products RESTART IDENTITY CASCADE;

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

INSERT INTO sample_order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 1299.99), (1, 2, 1, 29.99), (1, 14, 2, 8.99),
  (2, 5, 1, 399.99), (2, 3, 1, 49.99),
  (3, 7, 1, 299.99),
  (4, 3, 1, 149.99), (4, 2, 1, 29.99),
  (5, 1, 1, 1299.99), (5, 10, 1, 249.99),
  (6, 9, 1, 79.99),
  (7, 8, 1, 499.99), (7, 5, 1, 399.99),
  (8, 10, 1, 249.99),
  (9, 8, 1, 499.99), (9, 6, 1, 39.99),
  (10, 11, 1, 89.99), (10, 6, 1, 39.99),
  (11, 5, 1, 399.99),
  (12, 7, 1, 299.99), (12, 5, 1, 399.99),
  (13, 3, 1, 149.99);

-- ============================================
-- SAFE QUERY EXECUTION FUNCTION
-- ============================================

DROP FUNCTION IF EXISTS execute_safe_query(text);

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
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  query_upper := UPPER(TRIM(query_text));
  
  IF NOT (query_upper LIKE 'SELECT%' OR query_upper LIKE 'WITH%' OR query_upper LIKE 'EXPLAIN%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  IF query_upper ~ '\\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|COPY|VACUUM)\\b' THEN
    RAISE EXCEPTION 'Forbidden operation detected';
  END IF;
  
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

REVOKE ALL ON FUNCTION execute_safe_query(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_safe_query(text) TO authenticated;

SELECT 'Migration completed successfully!' AS status;`;

export default function SetupPage() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(MIGRATION_SQL);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1] || 'your-project';
    const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <m.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white mb-4">
                            <FiDatabase size={32} />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                            Database Setup
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Set up your database to use the SQL Learning App
                        </p>
                    </div>

                    {/* Steps */}
                    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl mb-6">
                        <CardBody className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCode className="text-primary" />
                                Setup Instructions
                            </h2>

                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Copy the SQL</h3>
                                        <p className="text-gray-600 text-sm">
                                            Click the button below to copy the migration SQL to your clipboard
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Open Supabase SQL Editor</h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            Go to your Supabase project's SQL Editor
                                        </p>
                                        <Button
                                            as="a"
                                            href={sqlEditorUrl}
                                            target="_blank"
                                            variant="flat"
                                            color="primary"
                                            size="sm"
                                            endContent={<FiExternalLink />}
                                        >
                                            Open SQL Editor
                                        </Button>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Paste and Run</h3>
                                        <p className="text-gray-600 text-sm">
                                            Paste the SQL into the editor and click "Run" to execute
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold">
                                        ✓
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Done!</h3>
                                        <p className="text-gray-600 text-sm">
                                            You can now use the SQL Learning App
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Copy Button */}
                    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl mb-6">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Migration SQL</h2>
                                <Button
                                    color={copied ? "success" : "primary"}
                                    startContent={copied ? <FiCheckCircle /> : <FiCopy />}
                                    onPress={copyToClipboard}
                                    className={copied ? "bg-success" : "bg-gradient-to-r from-primary to-secondary"}
                                >
                                    {copied ? 'Copied!' : 'Copy SQL'}
                                </Button>
                            </div>

                            <div className="relative">
                                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl overflow-auto max-h-96 text-xs font-mono">
                                    {MIGRATION_SQL}
                                </pre>
                            </div>
                        </CardBody>
                    </Card>

                    {/* What's included */}
                    <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl">
                        <CardBody className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <h3 className="font-semibold text-blue-900 mb-2">📊 Tables</h3>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• saved_queries - Store your queries</li>
                                        <li>• query_runs - Query history</li>
                                        <li>• sample_products - Practice data</li>
                                        <li>• sample_customers - Practice data</li>
                                        <li>• sample_orders - Practice data</li>
                                        <li>• sample_order_items - Practice data</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                    <h3 className="font-semibold text-purple-900 mb-2">🔒 Security</h3>
                                    <ul className="text-sm text-purple-700 space-y-1">
                                        <li>• Row Level Security enabled</li>
                                        <li>• User-specific query isolation</li>
                                        <li>• Read-only access to sample data</li>
                                        <li>• Safe query execution function</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                    <h3 className="font-semibold text-green-900 mb-2">📦 Sample Data</h3>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• 15 products</li>
                                        <li>• 10 customers</li>
                                        <li>• 13 orders</li>
                                        <li>• 22 order items</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                                    <h3 className="font-semibold text-orange-900 mb-2">⚡ Functions</h3>
                                    <ul className="text-sm text-orange-700 space-y-1">
                                        <li>• execute_safe_query()</li>
                                        <li>• Auto-update timestamps</li>
                                        <li>• 10s query timeout</li>
                                    </ul>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <Button
                            as="a"
                            href="/sql-editor"
                            color="primary"
                            size="lg"
                            endContent={<FiArrowRight />}
                            className="bg-gradient-to-r from-primary to-secondary font-semibold"
                        >
                            Go to SQL Editor
                        </Button>
                    </div>
                </m.div>
            </div>
        </div>
    );
}
