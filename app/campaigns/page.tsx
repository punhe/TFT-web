import Link from 'next/link';
import db from '@/lib/db';
import { Campaign } from '@/lib/types';
import { FiMail, FiPlus, FiEye, FiEdit, FiUsers, FiMousePointer } from 'react-icons/fi';

async function getCampaigns(): Promise<any[]> {
  // Get all campaigns
  const { data: campaigns } = await db
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (!campaigns) return [];

  // Get recipient stats for each campaign
  const campaignsWithStats = await Promise.all(
    campaigns.map(async (campaign) => {
      const { data: recipients } = await db
        .from('recipients')
        .select('id, opened_at, clicked_at')
        .eq('campaign_id', campaign.id);

      const recipient_count = recipients?.length || 0;
      const opened_count = recipients?.filter(r => r.opened_at).length || 0;
      const clicked_count = recipients?.filter(r => r.clicked_at).length || 0;

      return {
        ...campaign,
        recipient_count,
        opened_count,
        clicked_count,
      };
    })
  );

  return campaignsWithStats;
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiMail style={{ fontSize: '28px' }} />
            Campaigns
          </h1>
          <p>Manage your email marketing campaigns</p>
        </div>
        <Link href="/campaigns/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus />
          Create Campaign
        </Link>
      </div>

      <div className="card">
        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <FiMail style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ marginBottom: '20px' }}>No campaigns yet. Create your first campaign to get started.</p>
            <Link href="/campaigns/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FiPlus />
              Create Campaign
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUsers />
                    Recipients
                  </span>
                </th>
                <th>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiMail />
                    Opened
                  </span>
                </th>
                <th>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiMousePointer />
                    Clicked
                  </span>
                </th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td style={{ fontWeight: '500' }}>{campaign.name}</td>
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
                      <Link href={`/campaigns/${campaign.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FiEye />
                        View
                      </Link>
                      <Link href={`/campaigns/${campaign.id}/edit`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FiEdit />
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

