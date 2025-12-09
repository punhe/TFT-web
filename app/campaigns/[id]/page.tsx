import Link from 'next/link';
import db from '@/lib/db';
import { Campaign, Recipient } from '@/lib/types';
import { notFound } from 'next/navigation';
import SendEmailForm from '@/components/SendEmailForm';

async function getCampaign(id: string): Promise<Campaign | null> {
  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id) as Campaign | undefined;
  return campaign || null;
}

async function getRecipients(campaignId: string): Promise<Recipient[]> {
  const recipients = db.prepare('SELECT * FROM recipients WHERE campaign_id = ? ORDER BY created_at DESC').all(campaignId) as Recipient[];
  return recipients;
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
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{campaign.name}</h1>
          <p style={{ marginTop: '8px', color: '#666' }}>{campaign.subject}</p>
        </div>
        <Link href="/campaigns" className="btn btn-secondary">
          Back to Campaigns
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Recipients</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Sent</h3>
          <div className="value">{stats.sent}</div>
        </div>
        <div className="stat-card">
          <h3>Opened</h3>
          <div className="value">{stats.opened}</div>
        </div>
        <div className="stat-card">
          <h3>Clicked</h3>
          <div className="value">{stats.clicked}</div>
        </div>
        <div className="stat-card">
          <h3>Open Rate</h3>
          <div className="value">{stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className="stat-card">
          <h3>Click Rate</h3>
          <div className="value">{stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(1) : 0}%</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Campaign Details</h2>
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
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
          <strong>Preview:</strong>
          <div dangerouslySetInnerHTML={{ __html: campaign.html_content }} style={{ marginTop: '10px' }} />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Send Email</h2>
        <SendEmailForm campaignId={campaign.id} />
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Recipients</h2>
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

