import Link from 'next/link';
import db from '@/lib/db';
import { Campaign, Recipient } from '@/lib/types';
import { notFound } from 'next/navigation';
import SendEmailForm from '@/components/SendEmailForm';
import { 
  FiArrowLeft, 
  FiUsers, 
  FiSend, 
  FiMail, 
  FiMousePointer,
  FiTrendingUp,
  FiActivity,
  FiInfo
} from 'react-icons/fi';

async function getCampaign(id: string): Promise<Campaign | null> {
  const { data: campaign, error } = await db
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !campaign) return null;
  return campaign as Campaign;
}

async function getRecipients(campaignId: string): Promise<Recipient[]> {
  const { data: recipients } = await db
    .from('recipients')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });

  return (recipients as Recipient[]) || [];
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  const recipients = await getRecipients(id);

  if (!campaign) {
    notFound();
  }

  const stats = {
    total: recipients.length,
    sent: recipients.filter(r => r.sent_at).length,
    opened: recipients.filter(r => r.opened_at).length,
    clicked: recipients.filter(r => r.clicked_at).length,
  };

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>{campaign.name}</h1>
          <p>{campaign.subject}</p>
        </div>
        <Link href="/campaigns" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiArrowLeft />
          Back to Campaigns
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiUsers className="stat-card-icon" />
              Total Recipients
            </h3>
          </div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiSend className="stat-card-icon" />
              Sent
            </h3>
          </div>
          <div className="value">{stats.sent}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMail className="stat-card-icon" />
              Opened
            </h3>
          </div>
          <div className="value">{stats.opened}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiMousePointer className="stat-card-icon" />
              Clicked
            </h3>
          </div>
          <div className="value">{stats.clicked}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiTrendingUp className="stat-card-icon" />
              Open Rate
            </h3>
          </div>
          <div className="value">{stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>
              <FiActivity className="stat-card-icon" />
              Click Rate
            </h3>
          </div>
          <div className="value">{stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(1) : 0}%</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiInfo />
          Campaign Details
        </h2>
        <div style={{ marginBottom: '15px' }}>
          <strong>From:</strong> {campaign.from_name} &lt;{campaign.from_email}&gt;
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Subject:</strong> {campaign.subject}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Status:</strong> <span className={`badge badge-${campaign.status === 'sent' ? 'success' : 'warning'}`}>{campaign.status}</span>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Created:</strong> {new Date(campaign.created_at).toLocaleString()}
        </div>
        <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <strong style={{ display: 'block', marginBottom: '12px', color: '#374151' }}>Preview:</strong>
          <div 
            dangerouslySetInnerHTML={{ __html: campaign.html_content }} 
            style={{ 
              marginTop: '10px',
              padding: '20px',
              background: 'white',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              minHeight: '200px'
            }} 
          />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiSend />
          Send Email
        </h2>
        <SendEmailForm campaignId={campaign.id} />
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiUsers />
          Recipients
        </h2>
        {recipients.length === 0 ? (
          <p style={{ color: '#666' }}>No recipients added yet. Use the form above to send emails.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Sent</th>
                <th>Opened</th>
                <th>Clicked</th>
                <th>Open Count</th>
                <th>Click Count</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((recipient) => (
                <tr key={recipient.id}>
                  <td>{recipient.email}</td>
                  <td>{recipient.name || '-'}</td>
                  <td>{recipient.sent_at ? new Date(recipient.sent_at).toLocaleString() : '-'}</td>
                  <td>{recipient.opened_at ? new Date(recipient.opened_at).toLocaleString() : '-'}</td>
                  <td>{recipient.clicked_at ? new Date(recipient.clicked_at).toLocaleString() : '-'}</td>
                  <td>{recipient.opened_count}</td>
                  <td>{recipient.clicked_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

