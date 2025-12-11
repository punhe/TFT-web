'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { FiArrowLeft, FiUsers, FiSend, FiInfo, FiMail, FiRefreshCw } from 'react-icons/fi';
import SendEmailForm from '@/components/SendEmailForm';
import StatCard from '@/components/StatCard';
import DashboardHeader from '@/components/DashboardHeader';
import { ReactNode } from 'react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  from_name: string;
  from_email: string;
  html_content: string;
  status: string;
  created_at: string;
}

interface Recipient {
  id: string;
  email: string;
  name: string | null;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  opened_count: number;
  clicked_count: number;
}

interface StatCardData {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
}

interface CampaignDetailContentProps {
  campaign: Campaign;
  recipients: Recipient[];
  statCards: StatCardData[];
}

export default function CampaignDetailContent({ campaign, recipients, statCards }: CampaignDetailContentProps) {
  const router = useRouter();

  return (
    <>
      <Card className="mb-6 bg-white/95 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                <FiMail size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
                <p className="text-slate-500 mt-1">{campaign.subject}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onPress={() => router.refresh()}
                variant="bordered"
                startContent={<FiRefreshCw />}
                className="border-slate-200 text-slate-800 rounded-xl"
                size="md"
              >
                Reload
              </Button>
              <Button
                as={Link}
                href="/campaigns"
                variant="bordered"
                startContent={<FiArrowLeft />}
                className="border-slate-200 text-slate-800 rounded-xl"
                size="md"
              >
                Back to campaigns
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Chip 
              color={campaign.status === 'sent' ? 'success' : 'warning'} 
              variant="flat"
              size="sm"
              className="rounded-full capitalize"
            >
              {campaign.status}
            </Chip>
            <span className="pill">Created {new Date(campaign.created_at).toLocaleString()}</span>
            <span className="text-sm text-slate-500">From {campaign.from_name} &lt;{campaign.from_email}&gt;</span>
          </div>
        </CardHeader>
      </Card>

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

      <Card className="mt-6 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex items-center gap-2">
          <FiInfo className="text-xl text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Campaign details</h2>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-gray-500">From</span>
              <p className="text-gray-900 mt-1">{campaign.from_name} &lt;{campaign.from_email}&gt;</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-gray-500">Subject</span>
              <p className="text-gray-900 mt-1">{campaign.subject}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-gray-500">Created</span>
              <p className="text-gray-900 mt-1">{new Date(campaign.created_at).toLocaleString()}</p>
            </div>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <strong className="text-gray-700">Email preview</strong>
              <span className="text-xs text-slate-500">HTML content rendered below</span>
            </div>
            <div 
              className="p-5 bg-white rounded-xl border border-gray-200 min-h-[200px] shadow-inner"
              dangerouslySetInnerHTML={{ __html: campaign.html_content }} 
            />
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex items-center gap-2">
          <FiSend className="text-xl text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Send email</h2>
        </CardHeader>
        <CardBody>
          <SendEmailForm campaignId={campaign.id} />
        </CardBody>
      </Card>

      <Card className="mt-6 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex items-center gap-2">
          <FiUsers className="text-xl text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Recipients</h2>
        </CardHeader>
        <CardBody>
          {recipients.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No recipients added yet. Use the form above to send emails.</p>
          ) : (
            <Table aria-label="Recipients table" className="table-soft">
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
    </>
  );
}

