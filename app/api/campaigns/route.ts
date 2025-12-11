import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, from_email, from_name, html_content } = body;

    if (!name || !subject || !from_email || !from_name || !html_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from('campaigns')
      .insert({
        name,
        subject,
        from_email,
        from_name,
        html_content,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating campaign:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create campaign',
          details: error.message || 'Database error',
          hint: error.message?.includes('relation') 
            ? 'Make sure you have run the SQL schema in Supabase (see supabase-schema.sql)'
            : error.message?.includes('permission')
            ? 'Check your Supabase RLS policies and API keys'
            : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    
    // Check if it's a Supabase connection error
    if (error?.message?.includes('Invalid supabaseUrl') || error?.message?.includes('Missing Supabase')) {
      return NextResponse.json(
        { 
          error: 'Supabase not configured',
          details: error.message,
          hint: 'Please create a .env.local file with your Supabase credentials. See README.md for setup instructions.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create campaign',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all campaigns with recipient stats
    const { data: campaigns, error: campaignsError } = await db
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch campaigns',
          details: campaignsError.message 
        },
        { status: 500 }
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json([]);
    }

    // Get recipient stats for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const { data: recipients } = await db
            .from('recipients')
            .select('id, opened_at, clicked_at')
            .eq('campaign_id', campaign.id);

          const recipient_count = recipients?.length || 0;
          const opened_count = recipients?.filter((r: any) => r.opened_at).length || 0;
          const clicked_count = recipients?.filter((r: any) => r.clicked_at).length || 0;

          return {
            ...campaign,
            recipient_count,
            opened_count,
            clicked_count,
          };
        } catch (error) {
          console.error(`Error fetching stats for campaign ${campaign.id}:`, error);
          return {
            ...campaign,
            recipient_count: 0,
            opened_count: 0,
            clicked_count: 0,
          };
        }
      })
    );

    return NextResponse.json(campaignsWithStats);
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch campaigns',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

