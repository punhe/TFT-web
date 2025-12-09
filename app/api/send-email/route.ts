import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendTrackedEmail } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaign_id, email, name } = body;

    if (!campaign_id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get campaign
    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaign_id) as any;
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if recipient already exists
    let recipient = db.prepare('SELECT * FROM recipients WHERE campaign_id = ? AND email = ?').get(campaign_id, email) as any;

    if (!recipient) {
      // Create new recipient
      const recipientId = uuidv4();
      db.prepare(`
        INSERT INTO recipients (id, campaign_id, email, name)
        VALUES (?, ?, ?, ?)
      `).run(recipientId, campaign_id, email, name || null);
      recipient = { id: recipientId, campaign_id, email, name: name || null };
    }

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const result = await sendTrackedEmail({
      to: email,
      subject: campaign.subject,
      html: campaign.html_content,
      from: `${campaign.from_name} <${campaign.from_email}>`,
      trackingId: recipient.id,
      baseUrl,
    });

    if (result.success) {
      // Update recipient sent_at
      db.prepare('UPDATE recipients SET sent_at = CURRENT_TIMESTAMP WHERE id = ?').run(recipient.id);
      
      // Update campaign status
      db.prepare('UPDATE campaigns SET status = ? WHERE id = ?').run('sent', campaign_id);

      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

