import db from '@/lib/db';

async function getAnalytics() {
  // Overall stats
  const overall = db.prepare(`
    SELECT 
      COUNT(DISTINCT r.id) as total_recipients,
      COUNT(DISTINCT CASE WHEN r.sent_at IS NOT NULL THEN r.id END) as sent_count,
      COUNT(DISTINCT CASE WHEN r.opened_at IS NOT NULL THEN r.id END) as opened_count,
      COUNT(DISTINCT CASE WHEN r.clicked_at IS NOT NULL THEN r.id END) as clicked_count,
      SUM(r.opened_count) as total_opens,
      SUM(r.clicked_count) as total_clicks
    FROM recipients r
  `).get() as any;

  // Campaign performance
  const campaigns = db.prepare(`
    SELECT 
      c.id,
      c.name,
      c.subject,
      COUNT(r.id) as recipient_count,
      COUNT(CASE WHEN r.sent_at IS NOT NULL THEN 1 END) as sent_count,
      COUNT(CASE WHEN r.opened_at IS NOT NULL THEN 1 END) as opened_count,
      COUNT(CASE WHEN r.clicked_at IS NOT NULL THEN 1 END) as clicked_count,
      SUM(r.opened_count) as total_opens,
      SUM(r.clicked_count) as total_clicks
    FROM campaigns c
    LEFT JOIN recipients r ON c.id = r.campaign_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all() as any[];

  // Recent events
  const recentEvents = db.prepare(`
    SELECT 
      te.*,
      r.email,
      r.name,
      c.name as campaign_name
    FROM tracking_events te
    JOIN recipients r ON te.recipient_id = r.id
    JOIN campaigns c ON r.campaign_id = c.id
    ORDER BY te.created_at DESC
    LIMIT 50
  `).all() as any[];

  return { overall, campaigns, recentEvents };
}

export default async function AnalyticsPage() {
  const { overall, campaigns, recentEvents } = await getAnalytics();

  const openRate = overall.sent_count > 0 ? ((overall.opened_count / overall.sent_count) * 100).toFixed(1) : '0';
  const clickRate = overall.sent_count > 0 ? ((overall.clicked_count / overall.sent_count) * 100).toFixed(1) : '0';

  return (
    <div className="container">
      <div className="header">
        <h1>Analytics Dashboard</h1>
        <p style={{ marginTop: '8px', color: '#666' }}>Detailed tracking and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Recipients</h3>
          <div className="value">{overall.total_recipients || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Emails Sent</h3>
          <div className="value">{overall.sent_count || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Unique Opens</h3>
          <div className="value">{overall.opened_count || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Opens</h3>
          <div className="value">{overall.total_opens || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Unique Clicks</h3>
          <div className="value">{overall.clicked_count || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Clicks</h3>
          <div className="value">{overall.total_clicks || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Open Rate</h3>
          <div className="value">{openRate}%</div>
        </div>
        <div className="stat-card">
          <h3>Click Rate</h3>
          <div className="value">{clickRate}%</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Campaign Performance</h2>
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
        <h2 style={{ marginBottom: '20px' }}>Recent Tracking Events</h2>
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

