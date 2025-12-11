'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { FiArrowLeft, FiUsers, FiSend, FiInfo } from 'react-icons/fi';
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
  return (
    <>
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
    </>
  );
}

