import Link from 'next/link';
import db from '@/lib/db';
import { Campaign } from '@/lib/types';

async function getCampaigns(): Promise<Campaign[]> {
  const campaigns = db.prepare(`
    SELECT c.*,
           COUNT(r.id) as recipient_count,
           COUNT(CASE WHEN r.opened_at IS NOT NULL THEN 1 END) as opened_count,
           COUNT(CASE WHEN r.clicked_at IS NOT NULL THEN 1 END) as clicked_count
    FROM campaigns c
    LEFT JOIN recipients r ON c.id = r.campaign_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all() as any[];

  return campaigns;
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Campaigns</h1>
          <p style={{ marginTop: '8px', color: '#666' }}>Manage your email marketing campaigns</p>
        </div>
        <Link href="/campaigns/new" className="btn btn-primary">
          Create Campaign
        </Link>
      </div>

      <div className="card">
        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No campaigns yet. Create your first campaign to get started.</p>
            <Link href="/campaigns/new" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              Create Campaign
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Recipients</th>
                <th>Opened</th>
                <th>Clicked</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.subject}</td>
                  <td>{campaign.recipient_count || 0}</td>
                  <td>{campaign.opened_count || 0}</td>
                  <td>{campaign.clicked_count || 0}</td>
                  <td>
                    <span className={`badge badge-${campaign.status === 'sent' ? 'success' : 'warning'}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>{new Date(campaign.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/campaigns/${campaign.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View
                      </Link>
                      <Link href={`/campaigns/${campaign.id}/edit`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

