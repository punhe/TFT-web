import Link from 'next/link';
import { CampaignStats } from '@/lib/types';
import db from '@/lib/db';

async function getStats(): Promise<CampaignStats> {
  const stats = db.prepare(`
    SELECT 
      COUNT(DISTINCT r.id) as total_recipients,
      COUNT(DISTINCT CASE WHEN r.sent_at IS NOT NULL THEN r.id END) as sent_count,
      COUNT(DISTINCT CASE WHEN r.opened_at IS NOT NULL THEN r.id END) as opened_count,
      COUNT(DISTINCT CASE WHEN r.clicked_at IS NOT NULL THEN r.id END) as clicked_count
    FROM recipients r
  `).get() as any;

  const total = stats.total_recipients || 0;
  const sent = stats.sent_count || 0;
  const opened = stats.opened_count || 0;
  const clicked = stats.clicked_count || 0;

  return {
    total_recipients: total,
    sent_count: sent,
    opened_count: opened,
    clicked_count: clicked,
    open_rate: sent > 0 ? (opened / sent) * 100 : 0,
    click_rate: sent > 0 ? (clicked / sent) * 100 : 0,
  };
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="container">
      <div className="header">
        <h1>Email Marketing Tracker</h1>
        <p style={{ marginTop: '8px', color: '#666' }}>
          Track email opens and clicks for your marketing campaigns
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Recipients</h3>
          <div className="value">{stats.total_recipients}</div>
        </div>
        <div className="stat-card">
          <h3>Emails Sent</h3>
          <div className="value">{stats.sent_count}</div>
        </div>
        <div className="stat-card">
          <h3>Opened</h3>
          <div className="value">{stats.opened_count}</div>
        </div>
        <div className="stat-card">
          <h3>Clicked</h3>
          <div className="value">{stats.clicked_count}</div>
        </div>
        <div className="stat-card">
          <h3>Open Rate</h3>
          <div className="value">{stats.open_rate.toFixed(1)}%</div>
        </div>
        <div className="stat-card">
          <h3>Click Rate</h3>
          <div className="value">{stats.click_rate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/campaigns" className="btn btn-primary">
            View All Campaigns
          </Link>
          <Link href="/campaigns/new" className="btn btn-primary">
            Create New Campaign
          </Link>
          <Link href="/analytics" className="btn btn-secondary">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

