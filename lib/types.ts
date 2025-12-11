export interface Campaign {
  id: string;
  name: string;
  subject: string;
  from_email: string;
  from_name: string;
  html_content: string;
  created_at: string;
  status: 'draft' | 'sent' | 'scheduled';
}

export interface Recipient {
  id: string;
  campaign_id: string;
  email: string;
  name: string | null;
  sent_at: string | null;
  opened_at: string | null;
  opened_count: number;
  clicked_at: string | null;
  clicked_count: number;
}

export interface TrackingEvent {
  id: string;
  recipient_id: string;
  event_type: 'open' | 'click';
  link_url?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface CampaignStats {
  total_recipients: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  open_rate: number;
  click_rate: number;
}

