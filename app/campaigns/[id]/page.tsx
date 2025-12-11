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
import { Card, CardBody, CardHeader, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

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
      icon: FiUsers, 
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Sent', 
      value: stats.sent, 
      icon: FiSend, 
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Opened', 
      value: stats.opened, 
      icon: FiMail, 
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Clicked', 
      value: stats.clicked, 
      icon: FiMousePointer, 
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      title: 'Open Rate', 
      value: `${stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : 0}%`, 
      icon: FiTrendingUp, 
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      title: 'Click Rate', 
      value: `${stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(1) : 0}%`, 
      icon: FiActivity, 
      gradient: 'from-violet-500 to-purple-500'
    },
  ];

  return (
    <div className="container">
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-white/90 mt-1">{campaign.subject}</p>
          </div>
          <Button
            as={Link}
            href="/campaigns"
            variant="light"
            startContent={<FiArrowLeft />}
            className="text-white hover:bg-white/20"
            size="lg"
          >
            Back to Campaigns
          </Button>
        </CardHeader>
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
          <FiInfo className="text-xl" />
          <h2 className="text-xl font-semibold">Campaign Details</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <span className="text-sm font-semibold text-gray-600">From:</span>
            <p className="text-gray-900">{campaign.from_name} &lt;{campaign.from_email}&gt;</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-600">Subject:</span>
            <p className="text-gray-900">{campaign.subject}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-600">Status:</span>
            <div className="mt-1">
              <Chip 
                color={campaign.status === 'sent' ? 'success' : 'warning'} 
                variant="flat"
                size="lg"
              >
                {campaign.status}
              </Chip>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-600">Created:</span>
            <p className="text-gray-900">{new Date(campaign.created_at).toLocaleString()}</p>
          </div>
          <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <strong className="block mb-3 text-gray-700">Preview:</strong>
            <div 
              className="p-5 bg-white rounded-lg border border-gray-200 min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: campaign.html_content }} 
            />
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6 shadow-lg">
        <CardHeader className="flex items-center gap-2">
          <FiSend className="text-xl" />
          <h2 className="text-xl font-semibold">Send Email</h2>
        </CardHeader>
        <CardBody>
          <SendEmailForm campaignId={campaign.id} />
        </CardBody>
      </Card>

      <Card className="mt-6 shadow-lg">
        <CardHeader className="flex items-center gap-2">
          <FiUsers className="text-xl" />
          <h2 className="text-xl font-semibold">Recipients</h2>
        </CardHeader>
        <CardBody>
          {recipients.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No recipients added yet. Use the form above to send emails.</p>
          ) : (
            <Table aria-label="Recipients table">
              <TableHeader>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>SENT</TableColumn>
                <TableColumn>OPENED</TableColumn>
                <TableColumn>CLICKED</TableColumn>
                <TableColumn>OPEN COUNT</TableColumn>
                <TableColumn>CLICK COUNT</TableColumn>
              </TableHeader>
              <TableBody>
                {recipients.map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell className="font-medium">{recipient.email}</TableCell>
                    <TableCell>{recipient.name || '-'}</TableCell>
                    <TableCell>
                      {recipient.sent_at ? (
                        <Chip color="primary" variant="flat" size="sm">
                          {new Date(recipient.sent_at).toLocaleString()}
                        </Chip>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipient.opened_at ? (
                        <Chip color="success" variant="flat" size="sm">
                          {new Date(recipient.opened_at).toLocaleString()}
                        </Chip>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipient.clicked_at ? (
                        <Chip color="warning" variant="flat" size="sm">
                          {new Date(recipient.clicked_at).toLocaleString()}
                        </Chip>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip color="success" variant="flat" size="sm">
                        {recipient.opened_count}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip color="warning" variant="flat" size="sm">
                        {recipient.clicked_count}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

