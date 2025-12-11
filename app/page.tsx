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
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Button } from '@heroui/react';

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
      icon: FiUsers, 
      color: 'primary',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Emails Sent', 
      value: stats.sent_count, 
      icon: FiSend, 
      color: 'secondary',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Opened', 
      value: stats.opened_count, 
      icon: FiMail, 
      color: 'success',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Clicked', 
      value: stats.clicked_count, 
      icon: FiMousePointer, 
      color: 'warning',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      title: 'Open Rate', 
      value: `${stats.open_rate.toFixed(1)}%`, 
      icon: FiTrendingUp, 
      color: 'primary',
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      title: 'Click Rate', 
      value: `${stats.click_rate.toFixed(1)}%`, 
      icon: FiActivity, 
      color: 'secondary',
      gradient: 'from-violet-500 to-purple-500'
    },
  ];

  return (
    <div className="container">
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <CardHeader className="pb-2">
          <h1 className="text-3xl font-bold">Punhe CRM Dashboard</h1>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-white/90">
            Track email opens and clicks for your marketing campaigns
          </p>
        </CardBody>
      </Card>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className="hover:scale-105 transition-transform duration-200 shadow-lg border-none"
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader className="flex items-center gap-2">
          <FiActivity className="text-xl" />
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-3 flex-wrap">
            <Button
              as={Link}
              href="/campaigns"
              color="primary"
              variant="solid"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold"
            >
              View All Campaigns
            </Button>
            <Button
              as={Link}
              href="/campaigns/new"
              color="secondary"
              variant="solid"
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
            >
              Create New Campaign
            </Button>
            <Button
              as={Link}
              href="/analytics"
              color="default"
              variant="bordered"
              size="lg"
              className="border-2 font-semibold"
            >
              View Analytics
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

