'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { FiArrowLeft, FiUsers, FiSend, FiInfo, FiMail, FiRefreshCw, FiClock, FiMousePointer } from 'react-icons/fi';
import { m } from 'framer-motion';
import SendEmailForm from '@/components/SendEmailForm';
import StatCard from '@/components/StatCard';
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
      {/* Header Card */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-gray-200/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <CardHeader className="relative flex flex-col gap-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <m.div 
                  className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiMail size={24} className="text-white" />
                </m.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {campaign.name}
                  </h1>
                  <p className="text-gray-500 mt-1">{campaign.subject}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onPress={() => router.refresh()}
                    variant="flat"
                    startContent={<FiRefreshCw />}
                    className="rounded-xl bg-white/80 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    Reload
                  </Button>
                </m.div>
                <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    as={Link}
                    href="/campaigns"
                    variant="flat"
                    startContent={<FiArrowLeft />}
                    className="rounded-xl bg-white/80 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    Back
                  </Button>
                </m.div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Chip 
                color={campaign.status === 'sent' ? 'success' : 'warning'} 
                variant="flat"
                size="sm"
                className="rounded-full capitalize font-medium"
                startContent={
                  <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'sent' ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                }
              >
                {campaign.status}
              </Chip>
              <div className="pill flex items-center gap-2">
                <FiClock size={14} />
                <span>Created {new Date(campaign.created_at).toLocaleString()}</span>
              </div>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                From <strong>{campaign.from_name}</strong> &lt;{campaign.from_email}&gt;
              </span>
            </div>
          </CardHeader>
        </Card>
      </m.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            index={index}
          />
        ))}
      </div>

      {/* Campaign Details */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg">
          <CardHeader className="flex items-center gap-3 p-6 pb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl">
              <FiInfo className="text-xl text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Campaign details</h2>
          </CardHeader>
          <CardBody className="p-6 pt-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'From', value: `${campaign.from_name} <${campaign.from_email}>` },
                { label: 'Subject', value: campaign.subject },
                { label: 'Created', value: new Date(campaign.created_at).toLocaleString() },
              ].map((item, i) => (
                <m.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</span>
                  <p className="text-gray-900 mt-1 font-medium">{item.value}</p>
                </m.div>
              ))}
            </div>
            
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-gray-700 flex items-center gap-2">
                  <FiMail className="text-primary" />
                  Email preview
                </strong>
                <span className="text-xs text-gray-400">HTML content</span>
              </div>
              <div 
                className="p-5 bg-white rounded-xl border border-gray-200 min-h-[200px] shadow-inner email-preview"
                dangerouslySetInnerHTML={{ __html: campaign.html_content }} 
              />
            </div>
          </CardBody>
        </Card>
      </m.div>

      {/* Send Email Form */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg">
          <CardHeader className="flex items-center gap-3 p-6 pb-2">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
              <FiSend className="text-xl text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send email</h2>
              <p className="text-sm text-gray-500">Add a new recipient and send the campaign</p>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-2">
            <SendEmailForm campaignId={campaign.id} />
          </CardBody>
        </Card>
      </m.div>

      {/* Recipients Table */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg overflow-hidden">
          <CardHeader className="flex items-center gap-3 p-6 pb-2">
            <div className="p-3 bg-gradient-to-br from-success/10 to-emerald-500/10 rounded-xl">
              <FiUsers className="text-xl text-success" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recipients</h2>
              <p className="text-sm text-gray-500">{recipients.length} total recipients</p>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-2">
            {recipients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiUsers className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500">No recipients added yet.</p>
                <p className="text-sm text-gray-400 mt-1">Use the form above to send emails.</p>
              </div>
            ) : (
              <Table 
                aria-label="Recipients table"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-600 font-semibold text-xs uppercase tracking-wider",
                  td: "py-3",
                  tr: "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-colors",
                }}
              >
                <TableHeader>
                  <TableColumn>EMAIL</TableColumn>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>SENT</TableColumn>
                  <TableColumn>OPENED</TableColumn>
                  <TableColumn>CLICKED</TableColumn>
                  <TableColumn>
                    <div className="flex items-center gap-1">
                      <FiMail size={14} />
                      OPENS
                    </div>
                  </TableColumn>
                  <TableColumn>
                    <div className="flex items-center gap-1">
                      <FiMousePointer size={14} />
                      CLICKS
                    </div>
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient, index) => (
                    <TableRow key={recipient.id}>
                      <TableCell>
                        <span className="font-medium text-gray-900">{recipient.email}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{recipient.name || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {recipient.sent_at ? (
                          <Chip color="primary" variant="flat" size="sm" className="text-xs">
                            {new Date(recipient.sent_at).toLocaleString()}
                          </Chip>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {recipient.opened_at ? (
                          <Chip color="success" variant="flat" size="sm" className="text-xs">
                            {new Date(recipient.opened_at).toLocaleString()}
                          </Chip>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {recipient.clicked_at ? (
                          <Chip color="warning" variant="flat" size="sm" className="text-xs">
                            {new Date(recipient.clicked_at).toLocaleString()}
                          </Chip>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip color="success" variant="flat" size="sm" className="font-semibold">
                          {recipient.opened_count}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="warning" variant="flat" size="sm" className="font-semibold">
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
      </m.div>
    </>
  );
}
