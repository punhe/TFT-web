import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 1x1 transparent pixel
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipientId } = await params;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get recipient
    const { data: recipients } = await db
      .from('recipients')
      .select('*')
      .eq('id', recipientId)
      .limit(1);
    
    const recipient = recipients && recipients.length > 0 ? recipients[0] : null;
    
    if (recipient) {
      const now = new Date().toISOString();
      
      // Update recipient open tracking
      if (!recipient.opened_at) {
        await db
          .from('recipients')
          .update({
            opened_at: now,
            opened_count: (recipient.opened_count || 0) + 1,
          })
          .eq('id', recipientId);
      } else {
        await db
          .from('recipients')
          .update({
            opened_count: (recipient.opened_count || 0) + 1,
          })
          .eq('id', recipientId);
      }

      // Log tracking event
      await db
        .from('tracking_events')
        .insert({
          recipient_id: recipientId,
          event_type: 'open',
          ip_address: ip,
          user_agent: userAgent,
        });
    }

    // Return 1x1 transparent pixel
    return new NextResponse(PIXEL, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error tracking email open:', error);
    // Still return pixel even on error
    return new NextResponse(PIXEL, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}

