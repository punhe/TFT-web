/**
 * Execute SQL via Support API (Management API)
 * Correct Endpoint
 */
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const projectRef = 'ilgyxutjeecvcejgwfmx';
const accessToken = 'sbp_4fe81ad691a8b5ec177a876543cb762892dc5864';

async function executeSql() {
    console.log('📖 Reading migration file...');
    const sqlPath = path.join(process.cwd(), 'supabase-sql-learning-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Sending SQL to Supabase Management API...');

    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/sql`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: sql
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('❌ Error executing SQL:', data);
        process.exit(1);
    }

    console.log('✅ SQL executed successfully!');
    console.log('Result:', JSON.stringify(data).substring(0, 500) + '...');
}

executeSql().catch(console.error);
