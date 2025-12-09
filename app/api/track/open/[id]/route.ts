import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

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
    const recipient = db.prepare('SELECT * FROM recipients WHERE id = ?').get(recipientId) as any;
    
    if (recipient) {
      // Update recipient open tracking
      const now = new Date().toISOString();
      if (!recipient.opened_at) {
        db.prepare('UPDATE recipients SET opened_at = ?, opened_count = opened_count + 1 WHERE id = ?').run(now, recipientId);
      } else {
        db.prepare('UPDATE recipients SET opened_count = opened_count + 1 WHERE id = ?').run(recipientId);
      }

      // Log tracking event
      const eventId = uuidv4();
      db.prepare(`
        INSERT INTO tracking_events (id, recipient_id, event_type, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `).run(eventId, recipientId, 'open', ip, userAgent);
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

