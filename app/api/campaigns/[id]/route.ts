import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: campaign, error } = await db
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign', details: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, subject, from_email, from_name, html_content, status } = body;

    if (!name || !subject || !from_email || !from_name || !html_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if campaign exists
    const { data: existingCampaign, error: checkError } = await db
      .from('campaigns')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Update campaign
    const updateData: any = {
      name,
      subject,
      from_email,
      from_name,
      html_content,
    };

    if (status && ['draft', 'sent', 'scheduled'].includes(status)) {
      updateData.status = status;
    }

    const { data: updatedCampaign, error: updateError } = await db
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase error updating campaign:', updateError);
      return NextResponse.json(
        { 
          error: 'Failed to update campaign',
          details: updateError.message || 'Database error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCampaign);
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update campaign',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await db
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting campaign:', error);
      return NextResponse.json(
        { 
          error: 'Failed to delete campaign',
          details: error.message || 'Database error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete campaign',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

