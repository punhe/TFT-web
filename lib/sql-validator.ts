/**
 * SQL Query Validator
 * Validates SQL queries to ensure only safe SELECT operations are allowed
 */

// Forbidden keywords that indicate write/DDL/admin operations
const FORBIDDEN_KEYWORDS = [
  'INSERT',
  'UPDATE',
  'DELETE',
  'UPSERT',
  'MERGE',
  'DROP',
  'ALTER',
  'TRUNCATE',
  'CREATE',
  'GRANT',
  'REVOKE',
  'COPY',
  'VACUUM',
  'ANALYZE',
  'CALL',
  'DO',
  'EXECUTE',
  'PREPARE',
  'DEALLOCATE',
  'LISTEN',
  'NOTIFY',
  'UNLISTEN',
  'LOAD',
  'LOCK',
  'DISCARD',
  'CLUSTER',
  'REINDEX',
  'REFRESH',
  'SECURITY',
  'SET ROLE',
  'RESET ROLE',
  'pg_sleep',
  'pg_terminate',
  'pg_cancel',
  'pg_reload',
  'pg_rotate',
  'lo_import',
  'lo_export',
  'dblink',
];

// Forbidden patterns as regex
const FORBIDDEN_PATTERNS = [
  /\bpg_\w*\s*\(/i,           // pg_* functions (pg_sleep, pg_terminate_backend, etc.)
  /\blo_\w*\s*\(/i,           // Large object functions
  /\bdblink\s*\(/i,           // dblink function
  /\bcopy\s+/i,               // COPY command
  /\binto\s+(?:temp|temporary|unlogged)?\s*table/i, // SELECT INTO table
  /\\[a-z]/i,                 // psql meta-commands
  // Block access to sensitive legacy tables
  /\b(campaigns|recipients|tracking_events)\b/i,
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: 'VALIDATION_ERROR' | 'FORBIDDEN_KEYWORD' | 'MULTI_STATEMENT' | 'EMPTY_QUERY';
  sanitizedSql?: string;
}

/**
 * Removes SQL comments from the query
 */
function removeComments(sql: string): string {
  // Remove single-line comments (-- comment)
  let result = sql.replace(/--[^\n\r]*/g, '');

  // Remove multi-line comments (/* comment */)
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  return result;
}

/**
 * Checks if the query contains multiple statements
 */
function hasMultipleStatements(sql: string): boolean {
  // Remove string literals to avoid false positives
  const withoutStrings = sql
    .replace(/'[^']*'/g, '')   // Remove single-quoted strings
    .replace(/"[^"]*"/g, '')   // Remove double-quoted strings
    .replace(/\$\$[\s\S]*?\$\$/g, ''); // Remove dollar-quoted strings

  // Check for semicolons not at the end
  const trimmed = withoutStrings.trim();
  const withoutTrailingSemicolon = trimmed.replace(/;+\s*$/, '');

  return withoutTrailingSemicolon.includes(';');
}

/**
 * Checks if the query starts with SELECT or WITH (optionally EXPLAIN)
 */
function startsWithAllowedKeyword(sql: string): boolean {
  const trimmed = sql.trim().toUpperCase();

  // Allow EXPLAIN SELECT, EXPLAIN ANALYZE SELECT, EXPLAIN (options) SELECT
  if (trimmed.startsWith('EXPLAIN')) {
    // Check if it's EXPLAIN followed by SELECT/WITH
    const afterExplain = trimmed.replace(/^EXPLAIN\s*/i, '').replace(/^\([^)]*\)\s*/i, '').replace(/^ANALYZE\s*/i, '');
    return afterExplain.startsWith('SELECT') || afterExplain.startsWith('WITH');
  }

  return trimmed.startsWith('SELECT') || trimmed.startsWith('WITH');
}

/**
 * Checks for forbidden keywords in the query
 */
function containsForbiddenKeywords(sql: string): string | null {
  const upperSql = sql.toUpperCase();

  // Check for exact forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    // Use word boundary to avoid false positives
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(sql)) {
      return keyword;
    }
  }

  // Check for forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(sql)) {
      return pattern.toString();
    }
  }

  return null;
}

/**
 * Extracts the LIMIT value from the query if present
 */
export function extractLimit(sql: string): number | null {
  // Match LIMIT followed by a number, handling various whitespace
  const match = sql.match(/\bLIMIT\s+(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Adds or modifies LIMIT clause in the query
 */
export function applyLimit(sql: string, maxLimit: number = 1000): string {
  const existingLimit = extractLimit(sql);

  if (existingLimit === null) {
    // No LIMIT present, add one
    // Remove trailing semicolon if present
    const trimmed = sql.trim().replace(/;+\s*$/, '');
    return `${trimmed} LIMIT ${maxLimit}`;
  } else if (existingLimit > maxLimit) {
    // Replace with max limit
    return sql.replace(/\bLIMIT\s+\d+/i, `LIMIT ${maxLimit}`);
  }

  // Limit is within bounds, return as-is
  return sql;
}

/**
 * Main validation function
 * Validates SQL query for safety before execution
 */
export function validateQuery(sql: string): ValidationResult {
  // Check for empty query
  if (!sql || !sql.trim()) {
    return {
      valid: false,
      error: 'Query cannot be empty',
      code: 'EMPTY_QUERY'
    };
  }

  // Remove comments for safer parsing
  const withoutComments = removeComments(sql);

  // Check for empty query after removing comments
  if (!withoutComments.trim()) {
    return {
      valid: false,
      error: 'Query contains only comments',
      code: 'EMPTY_QUERY'
    };
  }

  // Check for multiple statements
  if (hasMultipleStatements(withoutComments)) {
    return {
      valid: false,
      error: 'Multiple SQL statements are not allowed. Please run one query at a time.',
      code: 'MULTI_STATEMENT'
    };
  }

  // Check if starts with allowed keyword
  if (!startsWithAllowedKeyword(withoutComments)) {
    return {
      valid: false,
      error: 'Only SELECT queries are allowed. Query must start with SELECT, WITH, or EXPLAIN SELECT.',
      code: 'VALIDATION_ERROR'
    };
  }

  // Check for forbidden keywords
  const forbiddenKeyword = containsForbiddenKeywords(withoutComments);
  if (forbiddenKeyword) {
    return {
      valid: false,
      error: `Forbidden operation detected: ${forbiddenKeyword}. Only read operations are allowed.`,
      code: 'FORBIDDEN_KEYWORD'
    };
  }

  return {
    valid: true,
    sanitizedSql: withoutComments.trim()
  };
}

/**
 * Validates and prepares a query for safe execution
 */
export function prepareQuery(sql: string, maxLimit: number = 1000): ValidationResult & { preparedSql?: string } {
  const validation = validateQuery(sql);

  if (!validation.valid) {
    return validation;
  }

  // Apply limit
  const preparedSql = applyLimit(validation.sanitizedSql!, maxLimit);

  return {
    ...validation,
    preparedSql
  };
}
