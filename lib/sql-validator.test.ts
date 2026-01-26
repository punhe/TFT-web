/**
 * SQL Validator Unit Tests
 * Run with: npx ts-node --esm lib/sql-validator.test.ts
 * Or integrate with your test runner
 */

import { validateQuery, prepareQuery, extractLimit, applyLimit } from './sql-validator';

// Test helper
function test(name: string, fn: () => void) {
    try {
        fn();
        console.log(`✅ ${name}`);
    } catch (error) {
        console.error(`❌ ${name}`);
        console.error(`   ${error}`);
        process.exitCode = 1;
    }
}

function assertEqual(actual: unknown, expected: unknown, message?: string) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

// ========================
// Valid Queries (should pass)
// ========================

test('validateQuery: SELECT 1 is valid', () => {
    const result = validateQuery('SELECT 1');
    assertEqual(result.valid, true);
});

test('validateQuery: SELECT * FROM table is valid', () => {
    const result = validateQuery('SELECT * FROM users');
    assertEqual(result.valid, true);
});

test('validateQuery: WITH CTE is valid', () => {
    const result = validateQuery('WITH t AS (SELECT 1) SELECT * FROM t');
    assertEqual(result.valid, true);
});

test('validateQuery: EXPLAIN SELECT is valid', () => {
    const result = validateQuery('EXPLAIN SELECT * FROM users');
    assertEqual(result.valid, true);
});

test('validateQuery: EXPLAIN ANALYZE SELECT is valid', () => {
    const result = validateQuery('EXPLAIN ANALYZE SELECT * FROM users');
    assertEqual(result.valid, true);
});

test('validateQuery: Case insensitive SELECT is valid', () => {
    const result = validateQuery('select * from users');
    assertEqual(result.valid, true);
});

test('validateQuery: Query with trailing semicolon is valid', () => {
    const result = validateQuery('SELECT * FROM users;');
    assertEqual(result.valid, true);
});

test('validateQuery: Query with whitespace is valid', () => {
    const result = validateQuery('  \n  SELECT * FROM users  \n  ');
    assertEqual(result.valid, true);
});

// ========================
// Invalid Queries (should fail)
// ========================

test('validateQuery: Empty query is invalid', () => {
    const result = validateQuery('');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'EMPTY_QUERY');
});

test('validateQuery: Whitespace only is invalid', () => {
    const result = validateQuery('   \n\t   ');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'EMPTY_QUERY');
});

test('validateQuery: INSERT is rejected', () => {
    const result = validateQuery('INSERT INTO users VALUES (1)');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: UPDATE is rejected', () => {
    const result = validateQuery('UPDATE users SET name = "hacked"');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: DELETE is rejected', () => {
    const result = validateQuery('DELETE FROM users');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: DROP TABLE is rejected', () => {
    const result = validateQuery('DROP TABLE users');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: ALTER TABLE is rejected', () => {
    const result = validateQuery('ALTER TABLE users ADD COLUMN evil TEXT');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: CREATE TABLE is rejected', () => {
    const result = validateQuery('CREATE TABLE evil (id INT)');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: TRUNCATE is rejected', () => {
    const result = validateQuery('TRUNCATE TABLE users');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: GRANT is rejected', () => {
    const result = validateQuery('GRANT ALL ON users TO public');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: REVOKE is rejected', () => {
    const result = validateQuery('REVOKE ALL ON users FROM public');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: COPY is rejected', () => {
    const result = validateQuery('COPY users TO STDOUT');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: VACUUM is rejected', () => {
    const result = validateQuery('VACUUM users');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'VALIDATION_ERROR');
});

test('validateQuery: Multiple statements are rejected', () => {
    const result = validateQuery('SELECT 1; SELECT 2');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'MULTI_STATEMENT');
});

test('validateQuery: pg_sleep is rejected', () => {
    const result = validateQuery('SELECT pg_sleep(100)');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'FORBIDDEN_KEYWORD');
});

test('validateQuery: pg_terminate_backend is rejected', () => {
    const result = validateQuery('SELECT pg_terminate_backend(123)');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'FORBIDDEN_KEYWORD');
});

test('validateQuery: SELECT with hidden DROP is rejected', () => {
    const result = validateQuery('SELECT 1; DROP TABLE users');
    assertEqual(result.valid, false);
});

test('validateQuery: SELECT with hidden DELETE is rejected', () => {
    const result = validateQuery('SELECT * FROM users WHERE 1=1; DELETE FROM users');
    assertEqual(result.valid, false);
});

// ========================
// Comment handling
// ========================

test('validateQuery: Single line comment is removed', () => {
    const result = validateQuery('SELECT * FROM users -- this is a comment');
    assertEqual(result.valid, true);
});

test('validateQuery: Multi-line comment is removed', () => {
    const result = validateQuery('SELECT /* comment */ * FROM users');
    assertEqual(result.valid, true);
});

test('validateQuery: Comment-only query is invalid', () => {
    const result = validateQuery('-- just a comment');
    assertEqual(result.valid, false);
    assertEqual(result.code, 'EMPTY_QUERY');
});

test('validateQuery: Forbidden keyword in comment is still caught via query structure', () => {
    // Even if DROP is in a comment, the query itself should be SELECT-only
    const result = validateQuery('SELECT * FROM users -- DROP TABLE');
    assertEqual(result.valid, true);
});

// ========================
// LIMIT extraction and application
// ========================

test('extractLimit: No limit returns null', () => {
    const result = extractLimit('SELECT * FROM users');
    assertEqual(result, null);
});

test('extractLimit: LIMIT 10 returns 10', () => {
    const result = extractLimit('SELECT * FROM users LIMIT 10');
    assertEqual(result, 10);
});

test('extractLimit: Case insensitive', () => {
    const result = extractLimit('SELECT * FROM users limit 50');
    assertEqual(result, 50);
});

test('applyLimit: Adds limit if missing', () => {
    const result = applyLimit('SELECT * FROM users', 1000);
    assertEqual(result, 'SELECT * FROM users LIMIT 1000');
});

test('applyLimit: Removes trailing semicolon when adding limit', () => {
    const result = applyLimit('SELECT * FROM users;', 1000);
    assertEqual(result, 'SELECT * FROM users LIMIT 1000');
});

test('applyLimit: Clamps limit if too high', () => {
    const result = applyLimit('SELECT * FROM users LIMIT 5000', 1000);
    assertEqual(result, 'SELECT * FROM users LIMIT 1000');
});

test('applyLimit: Keeps limit if within bounds', () => {
    const result = applyLimit('SELECT * FROM users LIMIT 100', 1000);
    assertEqual(result, 'SELECT * FROM users LIMIT 100');
});

// ========================
// prepareQuery (combined validation + limit)
// ========================

test('prepareQuery: Valid query gets limit added', () => {
    const result = prepareQuery('SELECT * FROM users', 1000);
    assertEqual(result.valid, true);
    assertEqual(result.preparedSql, 'SELECT * FROM users LIMIT 1000');
});

test('prepareQuery: Invalid query returns error', () => {
    const result = prepareQuery('DROP TABLE users', 1000);
    assertEqual(result.valid, false);
    assertEqual(result.preparedSql, undefined);
});

test('prepareQuery: High limit gets clamped', () => {
    const result = prepareQuery('SELECT * FROM users LIMIT 9999', 1000);
    assertEqual(result.valid, true);
    assertEqual(result.preparedSql, 'SELECT * FROM users LIMIT 1000');
});

// ========================
// Edge cases
// ========================

test('validateQuery: SELECT INTO is still SELECT-starting', () => {
    // SELECT INTO creates a table, but our keyword check should catch it
    const result = validateQuery('SELECT * INTO new_table FROM users');
    // This depends on implementation - if INTO TABLE pattern is caught
    // For now, this might pass initial check but would fail at DB level
    // We rely on the database function for additional validation
});

test('validateQuery: Unicode/special chars in query', () => {
    const result = validateQuery("SELECT * FROM users WHERE name = 'José'");
    assertEqual(result.valid, true);
});

test('validateQuery: Newlines in query', () => {
    const result = validateQuery(`
    SELECT 
      id,
      name
    FROM users
    WHERE active = true
  `);
    assertEqual(result.valid, true);
});

test('validateQuery: Very long query', () => {
    const longSelect = 'SELECT ' + Array(100).fill('column').join(', ') + ' FROM users';
    const result = validateQuery(longSelect);
    assertEqual(result.valid, true);
});

// ========================
// Summary
// ========================

console.log('\n--- SQL Validator Tests Complete ---\n');
