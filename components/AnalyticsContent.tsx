'use client';

import { Card, CardBody, CardHeader, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { FiBarChart2, FiTrendingUp, FiClock } from 'react-icons/fi';
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
        description="Detailed tracking and performance metrics"
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

      {campaigns.length > 0 && (
        <>
          <Card className="mt-6 shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <FiBarChart2 className="text-xl" />
              <h2 className="text-xl font-semibold">Campaign Performance Chart</h2>
            </CardHeader>
            <CardBody>
              <CampaignChart data={campaignChartData} />
            </CardBody>
          </Card>

          <Card className="mt-6 shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <FiTrendingUp className="text-xl" />
              <h2 className="text-xl font-semibold">Open & Click Rates by Campaign</h2>
            </CardHeader>
            <CardBody>
              <RateChart data={rateChartData} />
            </CardBody>
          </Card>
        </>
      )}

      <Card className="mt-6 shadow-lg">
        <CardHeader className="flex items-center gap-2">
          <FiBarChart2 className="text-xl" />
          <h2 className="text-xl font-semibold">Campaign Performance</h2>
        </CardHeader>
        <CardBody>
          {campaigns.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No campaigns yet.</p>
          ) : (
            <Table aria-label="Campaign performance table">
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
                      <TableCell className="font-semibold">{campaign.name}</TableCell>
                      <TableCell>
                        <Chip color="primary" variant="flat" size="sm">
                          {campaign.recipient_count || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="secondary" variant="flat" size="sm">
                          {campaign.sent_count || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="success" variant="flat" size="sm">
                          {campaign.opened_count || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="warning" variant="flat" size="sm">
                          {campaign.clicked_count || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="primary" variant="flat" size="sm">
                          {campaignOpenRate}%
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="secondary" variant="flat" size="sm">
                          {campaignClickRate}%
                        </Chip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6 shadow-lg">
        <CardHeader className="flex items-center gap-2">
          <FiClock className="text-xl" />
          <h2 className="text-xl font-semibold">Recent Tracking Events</h2>
        </CardHeader>
        <CardBody>
          {recentEvents.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No tracking events yet.</p>
          ) : (
            <Table aria-label="Recent tracking events">
              <TableHeader>
                <TableColumn>TIME</TableColumn>
                <TableColumn>CAMPAIGN</TableColumn>
                <TableColumn>RECIPIENT</TableColumn>
                <TableColumn>EVENT</TableColumn>
                <TableColumn>LINK</TableColumn>
                <TableColumn>IP ADDRESS</TableColumn>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(event.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{event.campaign_name || '-'}</TableCell>
                    <TableCell>{event.email || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        color={event.event_type === 'open' ? 'primary' : 'success'} 
                        variant="flat"
                        size="sm"
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
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {event.link_url.substring(0, 50)}...
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{event.ip_address || '-'}</TableCell>
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

