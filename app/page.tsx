import Link from 'next/link';
import { CampaignStats } from '@/lib/types';
import db from '@/lib/db';
import { 
  FiUsers, 
  FiSend, 
  FiMail, 
  FiMousePointer, 
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';

interface RecipientStats {
  id: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
}

async function getStats(): Promise<CampaignStats> {
  // Get all recipients
  const { data: recipients } = await db
    .from('recipients')
    .select('id, sent_at, opened_at, clicked_at');

  const total = recipients?.length || 0;
  const sent = recipients?.filter((r: RecipientStats) => r.sent_at).length || 0;
  const opened = recipients?.filter((r: RecipientStats) => r.opened_at).length || 0;
  const clicked = recipients?.filter((r: RecipientStats) => r.clicked_at).length || 0;

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
      <div className="page-header">
        <h1>Email Marketing Tracker</h1>
        <p>
          Track email opens and clicks for your marketing campaigns
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiUsers className="stat-card-icon" />
              Total Recipients
            </h3>
          </div>
          <div className="value">{stats.total_recipients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiSend className="stat-card-icon" />
              Emails Sent
            </h3>
          </div>
          <div className="value">{stats.sent_count}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMail className="stat-card-icon" />
              Opened
            </h3>
          </div>
          <div className="value">{stats.opened_count}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMousePointer className="stat-card-icon" />
              Clicked
            </h3>
          </div>
          <div className="value">{stats.clicked_count}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiTrendingUp className="stat-card-icon" />
              Open Rate
            </h3>
          </div>
          <div className="value">{stats.open_rate.toFixed(1)}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiActivity className="stat-card-icon" />
              Click Rate
            </h3>
          </div>
          <div className="value">{stats.click_rate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiActivity style={{ fontSize: '20px' }} />
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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

