import db from '@/lib/db';
import { 
  FiBarChart2, 
  FiUsers, 
  FiSend, 
  FiMail, 
  FiMousePointer,
  FiTrendingUp,
  FiActivity,
  FiClock
} from 'react-icons/fi';
import CampaignChart from '@/components/CampaignChart';
import RateChart from '@/components/RateChart';

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

  const campaignMap = new Map((eventCampaigns || []).map((c: any) => [c.id, c]));

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

  return (
    <div className="container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiBarChart2 style={{ fontSize: '28px' }} />
          Analytics Dashboard
        </h1>
        <p>Detailed tracking and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiUsers className="stat-card-icon" />
              Total Recipients
            </h3>
          </div>
          <div className="value">{overall.total_recipients || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiSend className="stat-card-icon" />
              Emails Sent
            </h3>
          </div>
          <div className="value">{overall.sent_count || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMail className="stat-card-icon" />
              Unique Opens
            </h3>
          </div>
          <div className="value">{overall.opened_count || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMail className="stat-card-icon" />
              Total Opens
            </h3>
          </div>
          <div className="value">{overall.total_opens || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMousePointer className="stat-card-icon" />
              Unique Clicks
            </h3>
          </div>
          <div className="value">{overall.clicked_count || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMousePointer className="stat-card-icon" />
              Total Clicks
            </h3>
          </div>
          <div className="value">{overall.total_clicks || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiTrendingUp className="stat-card-icon" />
              Open Rate
            </h3>
          </div>
          <div className="value">{openRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiActivity className="stat-card-icon" />
              Click Rate
            </h3>
          </div>
          <div className="value">{clickRate}%</div>
        </div>
      </div>

      {campaigns.length > 0 && (
        <>
          <div className="card">
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBarChart2 />
              Campaign Performance Chart
            </h2>
            <CampaignChart data={campaignChartData} />
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTrendingUp />
              Open & Click Rates by Campaign
            </h2>
            <RateChart data={rateChartData} />
          </div>
        </>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiBarChart2 />
          Campaign Performance
        </h2>
        {campaigns.length === 0 ? (
          <p style={{ color: '#666' }}>No campaigns yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Recipients</th>
                <th>Sent</th>
                <th>Opened</th>
                <th>Clicked</th>
                <th>Open Rate</th>
                <th>Click Rate</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const campaignOpenRate = campaign.sent_count > 0 
                  ? ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1) 
                  : '0';
                const campaignClickRate = campaign.sent_count > 0 
                  ? ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1) 
                  : '0';
                
                return (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.recipient_count || 0}</td>
                    <td>{campaign.sent_count || 0}</td>
                    <td>{campaign.opened_count || 0}</td>
                    <td>{campaign.clicked_count || 0}</td>
                    <td>{campaignOpenRate}%</td>
                    <td>{campaignClickRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiClock />
          Recent Tracking Events
        </h2>
        {recentEvents.length === 0 ? (
          <p style={{ color: '#666' }}>No tracking events yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Campaign</th>
                <th>Recipient</th>
                <th>Event</th>
                <th>Link</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{new Date(event.created_at).toLocaleString()}</td>
                  <td>{event.campaign_name}</td>
                  <td>{event.email}</td>
                  <td>
                    <span className={`badge badge-${event.event_type === 'open' ? 'info' : 'success'}`}>
                      {event.event_type}
                    </span>
                  </td>
                  <td>{event.link_url ? <a href={event.link_url} target="_blank" rel="noopener noreferrer">{event.link_url.substring(0, 50)}...</a> : '-'}</td>
                  <td>{event.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

