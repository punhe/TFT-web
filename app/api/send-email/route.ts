import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendTrackedEmail } from '@/lib/email';

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
    const { data: campaign, error: campaignError } = await db
      .from('campaigns')
      .select('*')
      .eq('id', campaign_id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if recipient already exists
    const { data: existingRecipients, error: checkError } = await db
      .from('recipients')
      .select('*')
      .eq('campaign_id', campaign_id)
      .eq('email', email)
      .limit(1);

    let recipient;
    if (existingRecipients && existingRecipients.length > 0) {
      recipient = existingRecipients[0];
    } else {
      // Create new recipient
      const { data: newRecipient, error: recipientError } = await db
        .from('recipients')
        .insert({
          campaign_id,
          email,
          name: name || null,
        })
        .select()
        .single();

      if (recipientError) {
        console.error('Error creating recipient:', recipientError);
        return NextResponse.json(
          { error: 'Failed to create recipient', details: recipientError.message },
          { status: 500 }
        );
      }
      recipient = newRecipient;
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
      await db
        .from('recipients')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', recipient.id);
      
      // Update campaign status
      await db
        .from('campaigns')
        .update({ status: 'sent' })
        .eq('id', campaign_id);

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

