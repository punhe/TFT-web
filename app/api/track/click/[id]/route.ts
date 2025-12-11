import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipientId } = await params;
    const url = request.nextUrl.searchParams.get('url');
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!url) {
      return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    // Get recipient
    const { data: recipients } = await db
      .from('recipients')
      .select('*')
      .eq('id', recipientId)
      .limit(1);
    
    const recipient = recipients && recipients.length > 0 ? recipients[0] : null;
    
    if (recipient) {
      const now = new Date().toISOString();
      
      // Update recipient click tracking
      if (!recipient.clicked_at) {
        await db
          .from('recipients')
          .update({
            clicked_at: now,
            clicked_count: (recipient.clicked_count || 0) + 1,
          })
          .eq('id', recipientId);
      } else {
        await db
          .from('recipients')
          .update({
            clicked_count: (recipient.clicked_count || 0) + 1,
          })
          .eq('id', recipientId);
      }

      // Log tracking event
      await db
        .from('tracking_events')
        .insert({
          recipient_id: recipientId,
          event_type: 'click',
          link_url: url,
          ip_address: ip,
          user_agent: userAgent,
        });
    }

    // Redirect to original URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error tracking click:', error);
    // Try to redirect anyway
    const url = request.nextUrl.searchParams.get('url');
    if (url) {
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}

