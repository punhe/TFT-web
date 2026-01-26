# SQL Learning App

A web application for practicing SQL queries safely. Built with Next.js, Supabase, and TypeScript.

## Features

### SQL Editor
- Write and execute SQL queries in a modern code editor
- Keyboard shortcut: `Ctrl/Cmd + Enter` to run queries
- Syntax highlighting with dark theme
- Real-time query results with execution time
- Error messages with helpful context

### Saved Queries
- Save queries with title, description, and tags
- Organize queries into folders
- Mark queries as favorites
- Search and filter your saved queries
- Quick load saved queries into editor

### Query History
- Automatic logging of all query runs
- Track success/error status
- View execution time and row counts
- Reload historical queries with one click

### SQL Templates
- Built-in templates for learning SQL
- Categories: Basics, Filtering, Aggregation, Joins, Advanced
- Each template includes explanation and example

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd TFT-web
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It is only used server-side in API routes.

### 3. Run Database Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase-sql-learning-migration.sql`
4. Paste and run in the SQL Editor

This will create:
- `saved_queries` table for storing user queries
- `query_runs` table for query history
- Sample data tables for practice (`sample_products`, `sample_customers`, `sample_orders`, `sample_order_items`)
- Row Level Security policies
- The `execute_safe_query` database function

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Database Schema

#### saved_queries
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Owner (references auth.users) |
| title | TEXT | Query title (required) |
| description | TEXT | Optional description |
| sql | TEXT | The SQL query |
| tags | TEXT[] | Array of tags |
| is_favorite | BOOLEAN | Favorite flag |
| folder | TEXT | Optional folder name |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Auto-updated timestamp |

#### query_runs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User who ran the query |
| saved_query_id | UUID | Optional link to saved query |
| sql | TEXT | The executed SQL |
| status | TEXT | 'success' or 'error' |
| error_message | TEXT | Error details if failed |
| row_count | INTEGER | Number of rows returned |
| runtime_ms | INTEGER | Execution time |
| created_at | TIMESTAMPTZ | When the query was run |

### Sample Data Tables

The app includes sample data for practice:

- **sample_products** (15 products across Electronics, Furniture, Kitchen, Office Supplies)
- **sample_customers** (10 customers from various countries)
- **sample_orders** (13 orders with different statuses)
- **sample_order_items** (22 order line items)

### Row Level Security (RLS)

All user data is protected by RLS policies:
- Users can only access their own `saved_queries`
- Users can only access their own `query_runs`
- Sample data tables are read-only for all authenticated users

### API Routes

#### POST /api/run-query
Executes a SQL query safely.

**Request:**
```json
{
  "sql": "SELECT * FROM sample_products LIMIT 10"
}
```

**Headers:**
```
Authorization: Bearer <user-access-token>
Content-Type: application/json
```

**Success Response:**
```json
{
  "ok": true,
  "columns": ["id", "name", "category", "price", "stock_quantity", "created_at"],
  "rows": [...],
  "rowCount": 10,
  "runtimeMs": 45,
  "appliedLimit": 1000
}
```

**Error Response:**
```json
{
  "ok": false,
  "error": {
    "message": "Only SELECT queries are allowed",
    "code": "VALIDATION_ERROR"
  }
}
```

## Security Design

### Query Validation (Defense in Depth)

The app implements multiple layers of security to prevent dangerous SQL operations:

#### Layer 1: Client-Side Validation (lib/sql-validator.ts)
- Validates queries before sending to the API
- Checks for forbidden keywords
- Rejects multiple statements
- Ensures queries start with SELECT/WITH/EXPLAIN

#### Layer 2: API Route Validation (app/api/run-query/route.ts)
- Re-validates all queries server-side
- Verifies JWT authentication
- Applies row limit (max 1000 rows)
- Handles timeout errors

#### Layer 3: Database Function (execute_safe_query)
- Runs with `SECURITY DEFINER` but with restricted search_path
- Enforces 10-second statement timeout
- Additional keyword validation at database level
- Only returns JSON result, preventing schema exposure

### Allowlist Approach

Only the following query types are allowed:
- `SELECT` statements
- `WITH` (CTE) followed by SELECT
- `EXPLAIN SELECT` and `EXPLAIN ANALYZE SELECT`

### Denylist (Blocked Keywords)

The following operations are explicitly blocked:
- Data Modification: `INSERT`, `UPDATE`, `DELETE`, `UPSERT`, `MERGE`
- DDL: `DROP`, `ALTER`, `TRUNCATE`, `CREATE`
- Administration: `GRANT`, `REVOKE`, `COPY`, `VACUUM`, `ANALYZE`
- Execution: `CALL`, `DO`, `EXECUTE`, `PREPARE`
- Dangerous Functions: `pg_sleep`, `pg_terminate_backend`, `dblink`, etc.

### Row Limit Enforcement

- Default limit: 1000 rows
- If no LIMIT specified: automatically adds `LIMIT 1000`
- If LIMIT > 1000: clamped to 1000

### Query Timeout

- Server-side timeout: 10 seconds
- Prevents long-running queries from consuming resources
- Returns user-friendly timeout error

### Service Role Key Protection

- The `SUPABASE_SERVICE_ROLE_KEY` is **only** used in server-side API routes
- Never exposed to client-side code
- Not included in client bundles

## Authentication

The app uses Supabase Auth with the existing implementation:
- Email/password authentication
- Session management via cookies
- Middleware-based route protection
- Automatic token refresh

### Protected Routes

- `/sql-editor` - Main SQL editor (requires auth)
- All other routes except `/login`, `/register`, `/forgot-password`

### Auth Flow

1. User visits any protected route
2. Middleware checks for auth cookie
3. If missing, redirects to `/login`
4. After successful login, redirects to `/sql-editor`

## Development

### Project Structure

```
TFT-web/
├── app/
│   ├── (auth)/           # Auth pages (login, register, etc.)
│   ├── api/
│   │   └── run-query/    # SQL execution API
│   ├── sql-editor/       # Main SQL editor page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home (redirects)
├── components/
│   └── Header.tsx        # Navigation header
├── contexts/
│   └── AuthContext.tsx   # Auth state management
├── lib/
│   ├── sql-validator.ts  # Query validation
│   ├── sql-templates.ts  # Built-in templates
│   ├── supabase.ts       # Supabase clients
│   └── supabase-browser.ts
├── supabase-sql-learning-migration.sql  # Database setup
└── README.md
```

### Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Testing Queries

#### Safe Queries (Should Work)
```sql
-- Simple select
SELECT 1

-- With CTE
WITH t AS (SELECT 1) SELECT * FROM t

-- Explain
EXPLAIN SELECT * FROM sample_products
```

#### Blocked Queries (Should Be Rejected)
```sql
-- Multiple statements
SELECT 1; SELECT 2

-- Data modification
INSERT INTO sample_products VALUES (...)
UPDATE sample_products SET price = 0
DELETE FROM sample_products

-- DDL
DROP TABLE sample_products
CREATE TABLE evil (...)

-- Dangerous functions
SELECT pg_sleep(100)
```

## Acceptance Criteria

### Auth Invariants
- [x] Login works exactly as before
- [x] Logout works exactly as before
- [x] Unauthed users are redirected exactly as before

### Query Safety
- [x] `SELECT 1` runs successfully
- [x] `WITH t AS (SELECT 1) SELECT * FROM t` runs successfully
- [x] Multi-statement queries are rejected
- [x] Write operations (INSERT, UPDATE, DELETE, etc.) are rejected
- [x] DDL operations (DROP, CREATE, ALTER, etc.) are rejected
- [x] Dangerous functions (pg_sleep, etc.) are rejected
- [x] Queries without LIMIT are capped to 1000 rows
- [x] Queries timeout safely after 10 seconds

### Saved Queries
- [x] Can create saved queries
- [x] Can edit saved queries
- [x] Can delete saved queries
- [x] Search and filter work
- [x] RLS prevents cross-user access

### Run History
- [x] Every run creates a query_runs record
- [x] Status and error messages are captured
- [x] RLS prevents cross-user access

## License

MIT License
