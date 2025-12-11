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
import StatCard from '@/components/StatCard';
import DashboardHeader from '@/components/DashboardHeader';
import QuickActions from '@/components/QuickActions';

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

  const statCards = [
    { 
      title: 'Total Recipients', 
      value: stats.total_recipients, 
      icon: <FiUsers size={24} />, 
      color: 'primary',
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Emails Sent', 
      value: stats.sent_count, 
      icon: <FiSend size={24} />, 
      color: 'secondary',
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Opened', 
      value: stats.opened_count, 
      icon: <FiMail size={24} />, 
      color: 'success',
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Clicked', 
      value: stats.clicked_count, 
      icon: <FiMousePointer size={24} />, 
      color: 'warning',
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Open Rate', 
      value: `${stats.open_rate.toFixed(1)}%`, 
      icon: <FiTrendingUp size={24} />, 
      color: 'primary',
      gradient: 'from-gray-100 to-gray-200'
    },
    { 
      title: 'Click Rate', 
      value: `${stats.click_rate.toFixed(1)}%`, 
      icon: <FiActivity size={24} />, 
      color: 'secondary',
      gradient: 'from-gray-100 to-gray-200'
    },
  ];

  return (
    <div className="container">
      <DashboardHeader 
        title="Punhe CRM Dashboard"
        description="Track email opens and clicks for your marketing campaigns"
      />

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>

      <QuickActions />
    </div>
  );
}

