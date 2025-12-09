import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

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
    const recipient = db.prepare('SELECT * FROM recipients WHERE id = ?').get(recipientId) as any;
    
    if (recipient) {
      // Update recipient click tracking
      const now = new Date().toISOString();
      if (!recipient.clicked_at) {
        db.prepare('UPDATE recipients SET clicked_at = ?, clicked_count = clicked_count + 1 WHERE id = ?').run(now, recipientId);
      } else {
        db.prepare('UPDATE recipients SET clicked_count = clicked_count + 1 WHERE id = ?').run(recipientId);
      }

      // Log tracking event
      const eventId = uuidv4();
      db.prepare(`
        INSERT INTO tracking_events (id, recipient_id, event_type, link_url, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(eventId, recipientId, 'click', url, ip, userAgent);
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

