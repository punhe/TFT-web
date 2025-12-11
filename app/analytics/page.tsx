import db from '@/lib/db';
import { 
  FiBarChart2, 
  FiUsers, 
  FiSend, 
  FiMail, 
  FiMousePointer,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import AnalyticsContent from '@/components/AnalyticsContent';

async function getAnalytics() {
  // Overall stats
  const { data: recipients } = await db
    .from('recipients')
    .select('id, sent_at, opened_at, clicked_at, opened_count, clicked_count');

  const total_recipients = recipients?.length || 0;
  const sent_count = recipients?.filter(r => r.sent_at).length || 0;
  const opened_count = recipients?.filter(r => r.opened_at).length || 0;
  const clicked_count = recipients?.filter(r => r.clicked_at).length || 0;
  const total_opens = recipients?.reduce((sum, r) => sum + (r.opened_count || 0), 0) || 0;
  const total_clicks = recipients?.reduce((sum, r) => sum + (r.clicked_count || 0), 0) || 0;

  const overall = {
    total_recipients,
    sent_count,
    opened_count,
    clicked_count,
    total_opens,
    total_clicks,
  };

  // Campaign performance
  const { data: campaigns } = await db
    .from('campaigns')
    .select('id, name, subject')
    .order('created_at', { ascending: false });

  const campaignsWithStats = await Promise.all(
    (campaigns || []).map(async (campaign) => {
      const { data: campaignRecipients } = await db
        .from('recipients')
        .select('id, sent_at, opened_at, clicked_at, opened_count, clicked_count')
        .eq('campaign_id', campaign.id);

      const recipient_count = campaignRecipients?.length || 0;
      const sent_count = campaignRecipients?.filter(r => r.sent_at).length || 0;
      const opened_count = campaignRecipients?.filter(r => r.opened_at).length || 0;
      const clicked_count = campaignRecipients?.filter(r => r.clicked_at).length || 0;
      const total_opens = campaignRecipients?.reduce((sum, r) => sum + (r.opened_count || 0), 0) || 0;
      const total_clicks = campaignRecipients?.reduce((sum, r) => sum + (r.clicked_count || 0), 0) || 0;

      return {
        ...campaign,
        recipient_count,
        sent_count,
        opened_count,
        clicked_count,
        total_opens,
        total_clicks,
      };
    })
  );

  // Recent events
  const { data: recentEvents } = await db
    .from('tracking_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Get recipients and campaigns for events
  const eventRecipientIds = [...new Set((recentEvents || []).map((e: any) => e.recipient_id))];
  
  let recipientMap = new Map();
  let campaignMap = new Map();
  
  if (eventRecipientIds.length > 0) {
    const { data: eventRecipients } = await db
      .from('recipients')
      .select('id, email, name, campaign_id')
      .in('id', eventRecipientIds);

    recipientMap = new Map((eventRecipients || []).map((r: any) => [r.id, r]));
    const campaignIds = [...new Set((eventRecipients || []).map((r: any) => r.campaign_id).filter(Boolean))];
    
    if (campaignIds.length > 0) {
      const { data: eventCampaigns } = await db
        .from('campaigns')
        .select('id, name')
        .in('id', campaignIds);
      
      campaignMap = new Map((eventCampaigns || []).map((c: any) => [c.id, c]));
    }
  }

  // Transform events to include email and campaign_name
  const transformedEvents = (recentEvents || []).map((event: any) => {
    const recipient = recipientMap.get(event.recipient_id);
    const campaign = recipient ? campaignMap.get(recipient.campaign_id) : null;
    
    return {
      ...event,
      email: recipient?.email,
      name: recipient?.name,
      campaign_name: campaign?.name,
    };
  });

  return { overall, campaigns: campaignsWithStats, recentEvents: transformedEvents };
}

export default async function AnalyticsPage() {
  const { overall, campaigns, recentEvents } = await getAnalytics();

  const openRate = overall.sent_count > 0 ? ((overall.opened_count / overall.sent_count) * 100).toFixed(1) : '0';
  const clickRate = overall.sent_count > 0 ? ((overall.clicked_count / overall.sent_count) * 100).toFixed(1) : '0';

  // Prepare chart data
  const campaignChartData = campaigns.map(c => ({
    name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
    sent: c.sent_count || 0,
    opened: c.opened_count || 0,
    clicked: c.clicked_count || 0,
  }));

  const rateChartData = campaigns.map(c => {
    const sent = c.sent_count || 0;
    const openRate = sent > 0 ? ((c.opened_count / sent) * 100) : 0;
    const clickRate = sent > 0 ? ((c.clicked_count / sent) * 100) : 0;
    return {
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      openRate: parseFloat(openRate.toFixed(1)),
      clickRate: parseFloat(clickRate.toFixed(1)),
    };
  });

  const statCards = [
    { 
      title: 'Total Recipients', 
      value: overall.total_recipients || 0, 
      icon: <FiUsers size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Emails Sent', 
      value: overall.sent_count || 0, 
      icon: <FiSend size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Unique Opens', 
      value: overall.opened_count || 0, 
      icon: <FiMail size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Total Opens', 
      value: overall.total_opens || 0, 
      icon: <FiMail size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Unique Clicks', 
      value: overall.clicked_count || 0, 
      icon: <FiMousePointer size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Total Clicks', 
      value: overall.total_clicks || 0, 
      icon: <FiMousePointer size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Open Rate', 
      value: `${openRate}%`, 
      icon: <FiTrendingUp size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Click Rate', 
      value: `${clickRate}%`, 
      icon: <FiActivity size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
  ];

  return (
    <div className="container">
      <AnalyticsContent
        statCards={statCards}
        campaignChartData={campaignChartData}
        rateChartData={rateChartData}
        campaigns={campaigns}
        recentEvents={recentEvents}
      />
    </div>
  );
}

