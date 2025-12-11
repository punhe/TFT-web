import db from '@/lib/db';
import { Campaign, Recipient } from '@/lib/types';
import { notFound } from 'next/navigation';
import { 
  FiUsers, 
  FiSend, 
  FiMail, 
  FiMousePointer,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import CampaignDetailContent from '@/components/CampaignDetailContent';

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

  const statCards = [
    { 
      title: 'Total Recipients', 
      value: stats.total, 
      icon: <FiUsers size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Sent', 
      value: stats.sent, 
      icon: <FiSend size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Opened', 
      value: stats.opened, 
      icon: <FiMail size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Clicked', 
      value: stats.clicked, 
      icon: <FiMousePointer size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Open Rate', 
      value: `${stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : 0}%`, 
      icon: <FiTrendingUp size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Click Rate', 
      value: `${stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(1) : 0}%`, 
      icon: <FiActivity size={24} />, 
      gradient: 'from-gray-100 to-gray-200'
    },
  ];

  return (
    <div className="container">
      <CampaignDetailContent
        campaign={campaign}
        recipients={recipients}
        statCards={statCards}
      />
    </div>
  );
}

