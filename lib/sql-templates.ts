/**
 * SQL Templates for Beginners
 * Pre-built SQL query templates to help users learn SQL
 */

export interface SqlTemplate {
    id: string;
    title: string;
    description: string;
    category: 'basics' | 'filtering' | 'aggregation' | 'joins' | 'advanced';
    sql: string;
    explanation: string;
}

export const SQL_TEMPLATES: SqlTemplate[] = [
    // Basics
    {
        id: 'select-all',
        title: 'Select All Columns',
        description: 'Retrieve all columns from a table',
        category: 'basics',
        sql: `SELECT *
FROM sample_products
LIMIT 10;`,
        explanation: 'The asterisk (*) selects all columns from the table. LIMIT restricts the number of rows returned.'
    },
    {
        id: 'select-specific',
        title: 'Select Specific Columns',
        description: 'Retrieve only certain columns',
        category: 'basics',
        sql: `SELECT name, price, category
FROM sample_products
ORDER BY price DESC;`,
        explanation: 'List specific column names to retrieve only the data you need. ORDER BY sorts results (DESC = descending).'
    },
    {
        id: 'count-rows',
        title: 'Count Rows',
        description: 'Count the number of records in a table',
        category: 'basics',
        sql: `SELECT COUNT(*) as total_products
FROM sample_products;`,
        explanation: 'COUNT(*) returns the total number of rows. Use AS to give the result a meaningful name (alias).'
    },

    // Filtering
    {
        id: 'where-equals',
        title: 'Filter with WHERE',
        description: 'Filter records based on a condition',
        category: 'filtering',
        sql: `SELECT *
FROM sample_products
WHERE category = 'Electronics';`,
        explanation: 'WHERE filters rows that match the specified condition. Text values must be in single quotes.'
    },
    {
        id: 'where-comparison',
        title: 'Comparison Operators',
        description: 'Use >, <, >=, <= to compare values',
        category: 'filtering',
        sql: `SELECT name, price
FROM sample_products
WHERE price >= 100
ORDER BY price;`,
        explanation: 'Use comparison operators to filter numeric values. Common operators: =, !=, >, <, >=, <='
    },
    {
        id: 'where-and-or',
        title: 'Multiple Conditions (AND/OR)',
        description: 'Combine multiple filter conditions',
        category: 'filtering',
        sql: `SELECT name, category, price
FROM sample_products
WHERE category = 'Electronics'
  AND price < 200;`,
        explanation: 'AND requires all conditions to be true. OR requires at least one condition to be true.'
    },
    {
        id: 'where-like',
        title: 'Pattern Matching (LIKE)',
        description: 'Search for patterns in text',
        category: 'filtering',
        sql: `SELECT *
FROM sample_products
WHERE name LIKE '%Desk%';`,
        explanation: 'LIKE searches for patterns. % matches any sequence of characters. _ matches a single character.'
    },
    {
        id: 'where-in',
        title: 'Filter with IN',
        description: 'Match against a list of values',
        category: 'filtering',
        sql: `SELECT *
FROM sample_customers
WHERE country IN ('USA', 'UK', 'Canada');`,
        explanation: 'IN checks if a value matches any item in a list. More readable than multiple OR conditions.'
    },

    // Aggregation
    {
        id: 'aggregate-functions',
        title: 'Aggregate Functions',
        description: 'Use SUM, AVG, MIN, MAX',
        category: 'aggregation',
        sql: `SELECT 
  COUNT(*) as total_products,
  ROUND(AVG(price)::numeric, 2) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price,
  SUM(stock_quantity) as total_stock
FROM sample_products;`,
        explanation: 'Aggregate functions calculate values across multiple rows. ROUND formats decimal numbers.'
    },
    {
        id: 'group-by',
        title: 'Group By',
        description: 'Group rows and calculate per-group statistics',
        category: 'aggregation',
        sql: `SELECT 
  category,
  COUNT(*) as product_count,
  ROUND(AVG(price)::numeric, 2) as avg_price
FROM sample_products
GROUP BY category
ORDER BY product_count DESC;`,
        explanation: 'GROUP BY groups rows with the same value. Aggregate functions then calculate per-group results.'
    },
    {
        id: 'having',
        title: 'Filter Groups (HAVING)',
        description: 'Filter groups after aggregation',
        category: 'aggregation',
        sql: `SELECT 
  category,
  COUNT(*) as product_count,
  ROUND(AVG(price)::numeric, 2) as avg_price
FROM sample_products
GROUP BY category
HAVING COUNT(*) >= 2;`,
        explanation: 'HAVING filters groups (like WHERE for aggregated data). Used after GROUP BY.'
    },

    // Joins
    {
        id: 'inner-join',
        title: 'Inner Join',
        description: 'Combine rows from two tables',
        category: 'joins',
        sql: `SELECT 
  c.first_name,
  c.last_name,
  o.order_date,
  o.total_amount,
  o.status
FROM sample_customers c
INNER JOIN sample_orders o ON c.id = o.customer_id
ORDER BY o.order_date DESC;`,
        explanation: 'INNER JOIN returns only rows that have matching values in both tables. Use aliases (c, o) for clarity.'
    },
    {
        id: 'left-join',
        title: 'Left Join',
        description: 'Include all rows from the left table',
        category: 'joins',
        sql: `SELECT 
  c.first_name,
  c.last_name,
  COUNT(o.id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_spent
FROM sample_customers c
LEFT JOIN sample_orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_spent DESC;`,
        explanation: 'LEFT JOIN includes all rows from the left table, even if there\'s no match in the right table.'
    },
    {
        id: 'multiple-joins',
        title: 'Multiple Joins',
        description: 'Join three or more tables',
        category: 'joins',
        sql: `SELECT 
  c.first_name || ' ' || c.last_name as customer_name,
  p.name as product_name,
  oi.quantity,
  oi.unit_price,
  o.order_date
FROM sample_customers c
JOIN sample_orders o ON c.id = o.customer_id
JOIN sample_order_items oi ON o.id = oi.order_id
JOIN sample_products p ON oi.product_id = p.id
LIMIT 20;`,
        explanation: 'You can chain multiple JOINs to connect several tables together. || concatenates strings.'
    },

    // Advanced
    {
        id: 'subquery',
        title: 'Subquery',
        description: 'Use a query inside another query',
        category: 'advanced',
        sql: `SELECT *
FROM sample_products
WHERE price > (
  SELECT AVG(price)
  FROM sample_products
);`,
        explanation: 'A subquery is a query nested inside another query. The inner query runs first, then its result is used.'
    },
    {
        id: 'case-when',
        title: 'CASE WHEN',
        description: 'Conditional logic in queries',
        category: 'advanced',
        sql: `SELECT 
  name,
  price,
  CASE 
    WHEN price < 50 THEN 'Budget'
    WHEN price < 200 THEN 'Mid-range'
    WHEN price < 500 THEN 'Premium'
    ELSE 'Luxury'
  END as price_tier
FROM sample_products
ORDER BY price;`,
        explanation: 'CASE WHEN creates conditional expressions, similar to if-else statements in programming.'
    },
    {
        id: 'cte',
        title: 'Common Table Expression (CTE)',
        description: 'Create temporary named result sets',
        category: 'advanced',
        sql: `WITH customer_totals AS (
  SELECT 
    customer_id,
    SUM(total_amount) as total_spent,
    COUNT(*) as order_count
  FROM sample_orders
  WHERE status != 'cancelled'
  GROUP BY customer_id
)
SELECT 
  c.first_name,
  c.last_name,
  ct.total_spent,
  ct.order_count
FROM customer_totals ct
JOIN sample_customers c ON ct.customer_id = c.id
ORDER BY ct.total_spent DESC;`,
        explanation: 'CTEs (WITH clause) create named temporary result sets that make complex queries more readable.'
    },
    {
        id: 'window-function',
        title: 'Window Functions',
        description: 'Calculate values across row sets',
        category: 'advanced',
        sql: `SELECT 
  name,
  category,
  price,
  RANK() OVER (ORDER BY price DESC) as price_rank,
  RANK() OVER (PARTITION BY category ORDER BY price DESC) as category_rank
FROM sample_products;`,
        explanation: 'Window functions perform calculations across a set of rows related to the current row.'
    },
    {
        id: 'date-functions',
        title: 'Date Functions',
        description: 'Work with dates and times',
        category: 'advanced',
        sql: `SELECT 
  order_date,
  DATE_TRUNC('month', order_date) as order_month,
  AGE(NOW(), order_date) as order_age,
  EXTRACT(DOW FROM order_date) as day_of_week,
  TO_CHAR(order_date, 'YYYY-MM-DD') as formatted_date
FROM sample_orders
ORDER BY order_date DESC;`,
        explanation: 'PostgreSQL provides many date functions: DATE_TRUNC, AGE, EXTRACT, TO_CHAR for formatting.'
    },
];

export const TEMPLATE_CATEGORIES = [
    { id: 'basics', label: 'Basics', icon: '📚' },
    { id: 'filtering', label: 'Filtering', icon: '🔍' },
    { id: 'aggregation', label: 'Aggregation', icon: '📊' },
    { id: 'joins', label: 'Joins', icon: '🔗' },
    { id: 'advanced', label: 'Advanced', icon: '🚀' },
];
