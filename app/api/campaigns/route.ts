import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

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

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO campaigns (id, name, subject, from_email, from_name, html_content)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, subject, from_email, from_name, html_content);

    return NextResponse.json({ id, ...body, created_at: new Date().toISOString() });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const campaigns = db.prepare(`
      SELECT c.*,
             COUNT(r.id) as recipient_count,
             COUNT(CASE WHEN r.opened_at IS NOT NULL THEN 1 END) as opened_count,
             COUNT(CASE WHEN r.clicked_at IS NOT NULL THEN 1 END) as clicked_count
      FROM campaigns c
      LEFT JOIN recipients r ON c.id = r.campaign_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

