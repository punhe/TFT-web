'use client';

import { Card, CardBody, CardHeader, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { FiBarChart2, FiTrendingUp, FiClock, FiActivity, FiMail, FiMousePointer } from 'react-icons/fi';
import { m } from 'framer-motion';
import CampaignChart from '@/components/CampaignChart';
import RateChart from '@/components/RateChart';
import StatCard from '@/components/StatCard';
import DashboardHeader from '@/components/DashboardHeader';
import { ReactNode } from 'react';

interface StatCardData {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
}

interface CampaignData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
}

interface RateData {
  name: string;
  openRate: number;
  clickRate: number;
}

interface Campaign {
  id: string;
  name: string;
  recipient_count: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
}

interface TrackingEvent {
  id: string;
  created_at: string;
  campaign_name: string;
  email: string;
  event_type: string;
  link_url: string | null;
  ip_address: string | null;
}

interface AnalyticsContentProps {
  statCards: StatCardData[];
  campaignChartData: CampaignData[];
  rateChartData: RateData[];
  campaigns: Campaign[];
  recentEvents: TrackingEvent[];
}

export default function AnalyticsContent({
  statCards,
  campaignChartData,
  rateChartData,
  campaigns,
  recentEvents,
}: AnalyticsContentProps) {
  return (
    <>
      <DashboardHeader
        title="Analytics Dashboard"
        description="Understand how your audience engages across every campaign"
      />

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

      {campaigns.length > 0 && (
        <>
          {/* Campaign Performance Chart */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg">
              <CardHeader className="flex items-center gap-3 p-6 pb-2">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                  <FiBarChart2 className="text-xl text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Campaign performance</h2>
                  <p className="text-sm text-gray-500">Compare sent, opened, and clicked across campaigns</p>
                </div>
              </CardHeader>
              <CardBody className="p-6 pt-2">
                <CampaignChart data={campaignChartData} />
              </CardBody>
            </Card>
          </m.div>

          {/* Rate Chart */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg">
              <CardHeader className="flex items-center gap-3 p-6 pb-2">
                <div className="p-3 bg-gradient-to-br from-success/10 to-emerald-500/10 rounded-xl">
                  <FiTrendingUp className="text-xl text-success" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Engagement rates</h2>
                  <p className="text-sm text-gray-500">Open and click rates by campaign</p>
                </div>
              </CardHeader>
              <CardBody className="p-6 pt-2">
                <RateChart data={rateChartData} />
              </CardBody>
            </Card>
          </m.div>
        </>
      )}

      {/* Campaign Performance Table */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg overflow-hidden">
          <CardHeader className="flex items-center gap-3 p-6 pb-2">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-xl">
              <FiActivity className="text-xl text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Performance breakdown</h2>
              <p className="text-sm text-gray-500">Detailed metrics for each campaign</p>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-2">
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiBarChart2 className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500">No campaigns yet.</p>
                <p className="text-sm text-gray-400 mt-1">Create a campaign to see analytics.</p>
              </div>
            ) : (
              <Table 
                aria-label="Campaign performance table"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-600 font-semibold text-xs uppercase tracking-wider",
                  td: "py-3",
                  tr: "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-colors",
                }}
              >
                <TableHeader>
                  <TableColumn>CAMPAIGN</TableColumn>
                  <TableColumn>RECIPIENTS</TableColumn>
                  <TableColumn>SENT</TableColumn>
                  <TableColumn>OPENED</TableColumn>
                  <TableColumn>CLICKED</TableColumn>
                  <TableColumn>OPEN RATE</TableColumn>
                  <TableColumn>CLICK RATE</TableColumn>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => {
                    const campaignOpenRate = campaign.sent_count > 0 
                      ? ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1) 
                      : '0';
                    const campaignClickRate = campaign.sent_count > 0 
                      ? ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1) 
                      : '0';
                    
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <span className="font-semibold text-gray-900">{campaign.name}</span>
                        </TableCell>
                        <TableCell>
                          <Chip color="primary" variant="flat" size="sm" className="font-semibold">
                            {campaign.recipient_count || 0}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip color="secondary" variant="flat" size="sm" className="font-semibold">
                            {campaign.sent_count || 0}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip color="success" variant="flat" size="sm" className="font-semibold">
                            {campaign.opened_count || 0}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip color="warning" variant="flat" size="sm" className="font-semibold">
                            {campaign.clicked_count || 0}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                                style={{ width: `${Math.min(parseFloat(campaignOpenRate), 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{campaignOpenRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-warning to-orange-400 rounded-full"
                                style={{ width: `${Math.min(parseFloat(campaignClickRate), 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{campaignClickRate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </m.div>

      {/* Recent Events */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="mt-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg overflow-hidden">
          <CardHeader className="flex items-center gap-3 p-6 pb-2">
            <div className="p-3 bg-gradient-to-br from-warning/10 to-orange-500/10 rounded-xl">
              <FiClock className="text-xl text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent activity</h2>
              <p className="text-sm text-gray-500">Latest tracking events across all campaigns</p>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-2">
            {recentEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiClock className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500">No tracking events yet.</p>
                <p className="text-sm text-gray-400 mt-1">Events will appear as recipients interact.</p>
              </div>
            ) : (
              <Table 
                aria-label="Recent tracking events"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-600 font-semibold text-xs uppercase tracking-wider",
                  td: "py-3",
                  tr: "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-colors",
                }}
              >
                <TableHeader>
                  <TableColumn>TIME</TableColumn>
                  <TableColumn>CAMPAIGN</TableColumn>
                  <TableColumn>RECIPIENT</TableColumn>
                  <TableColumn>EVENT</TableColumn>
                  <TableColumn>LINK</TableColumn>
                  <TableColumn>IP ADDRESS</TableColumn>
                </TableHeader>
                <TableBody>
                  {recentEvents.map((event, index) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{event.campaign_name || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{event.email || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={event.event_type === 'open' ? 'primary' : 'success'} 
                          variant="flat"
                          size="sm"
                          className="capitalize font-medium"
                          startContent={
                            event.event_type === 'open' ? <FiMail size={12} /> : <FiMousePointer size={12} />
                          }
                        >
                          {event.event_type}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {event.link_url ? (
                          <a 
                            href={event.link_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-secondary hover:underline text-sm transition-colors"
                          >
                            {event.link_url.length > 40 ? event.link_url.substring(0, 40) + '...' : event.link_url}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500 font-mono">{event.ip_address || '-'}</span>
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
