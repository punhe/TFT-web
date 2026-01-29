import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prepareQuery, extractLimit } from '@/lib/sql-validator';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Configuration
const MAX_LIMIT = 1000;
const QUERY_TIMEOUT_MS = 10000; // 10 seconds

interface QueryResult {
    ok: boolean;
    columns?: string[];
    rows?: Record<string, unknown>[];
    rowCount?: number;
    runtimeMs?: number;
    appliedLimit?: number;
    error?: {
        message: string;
        code: 'SQL_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT' | 'AUTH_ERROR';
    };
}

/**
 * Extract PostgreSQL error details for user-friendly messages
 */
function formatPgError(error: { message?: string; code?: string; details?: string; hint?: string }): string {
    let message = error.message || 'Query execution failed';

    // Remove Postgres internal details
    message = message.replace(/^ERROR:\s*/i, '');

    // Add helpful context
    if (error.hint) {
        message += ` Hint: ${error.hint}`;
    }

    return message;
}

/**
 * POST /api/run-query
 * Executes a validated SQL query and returns results
 */
export async function POST(request: NextRequest): Promise<NextResponse<QueryResult>> {
    const startTime = Date.now();

    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                ok: false,
                error: {
                    message: 'Authentication required. Please sign in.',
                    code: 'AUTH_ERROR'
                }
            }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');

        // Create a Supabase client with the user's token to verify auth
        const supabaseAuth = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });

        // Verify the user is authenticated
        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({
                ok: false,
                error: {
                    message: 'Invalid or expired session. Please sign in again.',
                    code: 'AUTH_ERROR'
                }
            }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { sql } = body;

        if (!sql || typeof sql !== 'string') {
            return NextResponse.json({
                ok: false,
                error: {
                    message: 'SQL query is required',
                    code: 'VALIDATION_ERROR'
                }
            }, { status: 400 });
        }

        // Validate and prepare the query
        const validation = prepareQuery(sql, MAX_LIMIT);

        if (!validation.valid) {
            return NextResponse.json({
                ok: false,
                error: {
                    message: validation.error!,
                    code: 'VALIDATION_ERROR'
                }
            }, { status: 400 });
        }

        // Create admin client for query execution ON SERVER SIDE ONLY
        // Service role key is never exposed to client
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
            db: {
                schema: 'public'
            }
        });

        // Execute query with timeout using statement_timeout
        const queryStartTime = Date.now();
        const queryWithTimeout = `SET statement_timeout = '${QUERY_TIMEOUT_MS}ms'; ${validation.preparedSql}`;

        // Use Postgres RPC to execute the query safely
        // We use the supabaseAuth client (user's token) so that auth.uid() is available in the DB
        const { data, error } = await supabaseAuth.rpc('execute_safe_query', {
            query_text: validation.preparedSql
        });

        const runtimeMs = Date.now() - queryStartTime;

        // Handle errors
        if (error) {
            // Check for timeout
            if (error.message?.includes('statement timeout') || error.message?.includes('canceling statement')) {
                return NextResponse.json({
                    ok: false,
                    error: {
                        message: `Query timed out after ${QUERY_TIMEOUT_MS / 1000} seconds. Try a simpler query or add more specific filters.`,
                        code: 'TIMEOUT'
                    }
                }, { status: 408 });
            }

            return NextResponse.json({
                ok: false,
                error: {
                    message: formatPgError(error),
                    code: 'SQL_ERROR'
                }
            }, { status: 400 });
        }

        // Process results
        const rows = Array.isArray(data) ? data : (data ? [data] : []);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        const appliedLimit = extractLimit(validation.preparedSql!) || MAX_LIMIT;

        return NextResponse.json({
            ok: true,
            columns,
            rows,
            rowCount: rows.length,
            runtimeMs,
            appliedLimit
        });

    } catch (error) {
        console.error('Query execution error:', error);

        const message = error instanceof Error ? error.message : 'An unexpected error occurred';

        // Check for timeout in catch
        if (message.includes('timeout') || message.includes('canceling')) {
            return NextResponse.json({
                ok: false,
                error: {
                    message: `Query timed out. Try a simpler query or add more specific filters.`,
                    code: 'TIMEOUT'
                }
            }, { status: 408 });
        }

        return NextResponse.json({
            ok: false,
            error: {
                message,
                code: 'SQL_ERROR'
            }
        }, { status: 500 });
    }
}
