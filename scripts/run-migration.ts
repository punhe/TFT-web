/**
 * Database Migration Script
 * Run with: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!');
    console.error('   Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function runMigration() {
    console.log('🚀 Starting database migration...\n');

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase-sql-learning-migration.sql');

    if (!fs.existsSync(migrationPath)) {
        console.error('❌ Migration file not found: supabase-sql-learning-migration.sql');
        process.exit(1);
    }

    const fullSql = fs.readFileSync(migrationPath, 'utf-8');

    // Split SQL into individual statements
    // We need to be careful with functions that contain semicolons
    const statements = splitSqlStatements(fullSql);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i].trim();
        if (!stmt || stmt.startsWith('--')) continue;

        // Skip comments-only statements
        const withoutComments = stmt.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (!withoutComments) continue;

        const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + (stmt.length > 60 ? '...' : '');

        try {
            // Use rpc to execute raw SQL
            const { error } = await supabase.rpc('exec_sql', { sql_string: stmt });

            if (error) {
                // If exec_sql doesn't exist, try alternative approach
                if (error.message?.includes('function') && error.message?.includes('does not exist')) {
                    // Fall back to direct query via REST API
                    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': supabaseServiceKey,
                            'Authorization': `Bearer ${supabaseServiceKey}`,
                        },
                        body: JSON.stringify({ query: stmt }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                    }
                } else {
                    throw error;
                }
            }

            console.log(`✅ [${i + 1}/${statements.length}] ${preview}`);
            successCount++;
        } catch (error: any) {
            // Some errors are expected (like "already exists")
            const msg = error.message || String(error);
            if (msg.includes('already exists') || msg.includes('duplicate')) {
                console.log(`⚠️  [${i + 1}/${statements.length}] ${preview} (already exists)`);
                successCount++;
            } else {
                console.error(`❌ [${i + 1}/${statements.length}] ${preview}`);
                console.error(`   Error: ${msg}\n`);
                errorCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Success: ${successCount} statements`);
    if (errorCount > 0) {
        console.log(`❌ Errors: ${errorCount} statements`);
    }
    console.log('='.repeat(50));

    if (errorCount === 0) {
        console.log('\n🎉 Migration completed successfully!');
        console.log('   You can now use the SQL Learning App.');
    } else {
        console.log('\n⚠️  Migration completed with some errors.');
        console.log('   Please check the error messages above.');
        console.log('   You may need to run the migration manually in Supabase SQL Editor.');
    }
}

/**
 * Split SQL into statements, handling functions with $$ delimiters
 */
function splitSqlStatements(sql: string): string[] {
    const statements: string[] = [];
    let current = '';
    let inDollarQuote = false;
    let dollarTag = '';

    const lines = sql.split('\n');

    for (const line of lines) {
        // Check for $$ or $tag$ delimiters
        const dollarMatch = line.match(/\$([a-zA-Z_]*)\$/g);

        if (dollarMatch) {
            for (const match of dollarMatch) {
                if (!inDollarQuote) {
                    inDollarQuote = true;
                    dollarTag = match;
                } else if (match === dollarTag) {
                    inDollarQuote = false;
                    dollarTag = '';
                }
            }
        }

        current += line + '\n';

        // If we're not in a dollar quote and line ends with semicolon
        if (!inDollarQuote && line.trim().endsWith(';')) {
            statements.push(current.trim());
            current = '';
        }
    }

    // Add any remaining statement
    if (current.trim()) {
        statements.push(current.trim());
    }

    return statements;
}

// Run the migration
runMigration().catch(console.error);
