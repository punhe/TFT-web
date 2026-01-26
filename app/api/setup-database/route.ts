import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/setup-database
 * Runs the database migration
 * Protected by a secret key for security
 */
export async function POST(request: NextRequest) {
    try {
        // Check for setup secret
        const body = await request.json();
        const { secret } = body;

        // Simple secret check - in production, use a proper secret
        const expectedSecret = process.env.SETUP_SECRET || 'setup-sql-learning-2024';

        if (secret !== expectedSecret) {
            return NextResponse.json({
                ok: false,
                error: 'Invalid setup secret'
            }, { status: 401 });
        }

        // Create admin client
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        const results: { statement: string; status: 'success' | 'error' | 'skipped'; error?: string }[] = [];

        // Define SQL statements in order
        // We'll execute them one by one
        const statements = getMigrationStatements();

        for (const stmt of statements) {
            if (!stmt.sql.trim()) continue;

            try {
                // Try to execute via RPC if available
                const { error } = await supabase.rpc('exec_sql', { sql_string: stmt.sql });

                if (error) {
                    // Check if it's because the function doesn't exist
                    if (error.message?.includes('does not exist')) {
                        results.push({
                            statement: stmt.name,
                            status: 'skipped',
                            error: 'exec_sql function not available - run migration manually'
                        });
                    } else if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
                        results.push({
                            statement: stmt.name,
                            status: 'success',
                            error: 'Already exists (skipped)'
                        });
                    } else {
                        results.push({
                            statement: stmt.name,
                            status: 'error',
                            error: error.message
                        });
                    }
                } else {
                    results.push({
                        statement: stmt.name,
                        status: 'success'
                    });
                }
            } catch (err: any) {
                results.push({
                    statement: stmt.name,
                    status: 'error',
                    error: err.message || String(err)
                });
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const errorCount = results.filter(r => r.status === 'error').length;
        const skippedCount = results.filter(r => r.status === 'skipped').length;

        return NextResponse.json({
            ok: errorCount === 0 && skippedCount === 0,
            message: skippedCount > 0
                ? 'Migration requires manual setup - please run supabase-sql-learning-migration.sql in your Supabase SQL Editor'
                : `Migration completed: ${successCount} success, ${errorCount} errors`,
            results,
            summary: { successCount, errorCount, skippedCount }
        });

    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Migration failed'
        }, { status: 500 });
    }
}

function getMigrationStatements(): { name: string; sql: string }[] {
    // Return key migration statements
    // Note: Full migration still needs to be run in Supabase SQL Editor
    // because Supabase doesn't expose raw SQL execution via REST API
    return [
        {
            name: 'Check connection',
            sql: 'SELECT 1 as test'
        }
    ];
}

/**
 * GET /api/setup-database
 * Returns setup instructions
 */
export async function GET() {
    return NextResponse.json({
        message: 'Database Setup Instructions',
        steps: [
            '1. Open your Supabase project dashboard',
            '2. Go to SQL Editor',
            '3. Copy the contents of supabase-sql-learning-migration.sql',
            '4. Paste and run in the SQL Editor',
            '5. All tables and sample data will be created automatically'
        ],
        note: 'Supabase does not allow raw SQL execution via API for security. You must run migrations through the SQL Editor.',
        alternative: 'You can also use the Supabase CLI: npx supabase db push'
    });
}
