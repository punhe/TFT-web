import db from '@/lib/db';
import { 
  FiBarChart2, 
  FiUsers, 
  FiSend, 
  FiMail, 
  FiMousePointer,
  FiTrendingUp,
  FiActivity,
  FiClock
} from 'react-icons/fi';
import CampaignChart from '@/components/CampaignChart';
import RateChart from '@/components/RateChart';
import { Card, CardBody, CardHeader, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

async function getAnalytics() {
  // Overall stats
  const { data: recipients } = await db
    .from('recipients')
    .select('id, sent_at, opened_at, clicked_at, opened_count, clicked_count');

  const total_recipients = recipients?.length || 0;
  const sent_count = recipients?.filter(r => r.sent_at).length || 0;
  const opened_count = recipients?.filter(r => r.opened_at).length || 0;
  const clicked_count = recipients?.filter(r => r.clicked_at).length || 0;
  const total_opens = recipients?.reduce((sum, r) => sum + (r.opened_count || 0), 0) || 0;
  const total_clicks = recipients?.reduce((sum, r) => sum + (r.clicked_count || 0), 0) || 0;

  const overall = {
    total_recipients,
    sent_count,
    opened_count,
    clicked_count,
    total_opens,
    total_clicks,
  };

  // Campaign performance
  const { data: campaigns } = await db
    .from('campaigns')
    .select('id, name, subject')
    .order('created_at', { ascending: false });

  const campaignsWithStats = await Promise.all(
    (campaigns || []).map(async (campaign) => {
      const { data: campaignRecipients } = await db
        .from('recipients')
        .select('id, sent_at, opened_at, clicked_at, opened_count, clicked_count')
        .eq('campaign_id', campaign.id);

      const recipient_count = campaignRecipients?.length || 0;
      const sent_count = campaignRecipients?.filter(r => r.sent_at).length || 0;
      const opened_count = campaignRecipients?.filter(r => r.opened_at).length || 0;
      const clicked_count = campaignRecipients?.filter(r => r.clicked_at).length || 0;
      const total_opens = campaignRecipients?.reduce((sum, r) => sum + (r.opened_count || 0), 0) || 0;
      const total_clicks = campaignRecipients?.reduce((sum, r) => sum + (r.clicked_count || 0), 0) || 0;

      return {
        ...campaign,
        recipient_count,
        sent_count,
        opened_count,
        clicked_count,
        total_opens,
        total_clicks,
      };
    })
  );

  // Recent events
  const { data: recentEvents } = await db
    .from('tracking_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Get recipients and campaigns for events
  const eventRecipientIds = [...new Set((recentEvents || []).map((e: any) => e.recipient_id))];
  
  let recipientMap = new Map();
  let campaignMap = new Map();
  
  if (eventRecipientIds.length > 0) {
    const { data: eventRecipients } = await db
      .from('recipients')
      .select('id, email, name, campaign_id')
      .in('id', eventRecipientIds);

    recipientMap = new Map((eventRecipients || []).map((r: any) => [r.id, r]));
    const campaignIds = [...new Set((eventRecipients || []).map((r: any) => r.campaign_id).filter(Boolean))];
    
    if (campaignIds.length > 0) {
      const { data: eventCampaigns } = await db
        .from('campaigns')
        .select('id, name')
        .in('id', campaignIds);
      
      campaignMap = new Map((eventCampaigns || []).map((c: any) => [c.id, c]));
    }
  }

  const campaignMap = new Map((eventCampaigns || []).map((c: any) => [c.id, c]));

  // Transform events to include email and campaign_name
  const transformedEvents = (recentEvents || []).map((event: any) => {
    const recipient = recipientMap.get(event.recipient_id);
    const campaign = recipient ? campaignMap.get(recipient.campaign_id) : null;
    
    return {
      ...event,
      email: recipient?.email,
      name: recipient?.name,
      campaign_name: campaign?.name,
    };
  });

  return { overall, campaigns: campaignsWithStats, recentEvents: transformedEvents };
}

export default async function AnalyticsPage() {
  const { overall, campaigns, recentEvents } = await getAnalytics();

  const openRate = overall.sent_count > 0 ? ((overall.opened_count / overall.sent_count) * 100).toFixed(1) : '0';
  const clickRate = overall.sent_count > 0 ? ((overall.clicked_count / overall.sent_count) * 100).toFixed(1) : '0';

  // Prepare chart data
  const campaignChartData = campaigns.map(c => ({
    name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
    sent: c.sent_count || 0,
    opened: c.opened_count || 0,
    clicked: c.clicked_count || 0,
  }));

  const rateChartData = campaigns.map(c => {
    const sent = c.sent_count || 0;
    const openRate = sent > 0 ? ((c.opened_count / sent) * 100) : 0;
    const clickRate = sent > 0 ? ((c.clicked_count / sent) * 100) : 0;
    return {
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      openRate: parseFloat(openRate.toFixed(1)),
      clickRate: parseFloat(clickRate.toFixed(1)),
    };
  });

  const statCards = [
    { 
      title: 'Total Recipients', 
      value: overall.total_recipients || 0, 
      icon: FiUsers, 
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Emails Sent', 
      value: overall.sent_count || 0, 
      icon: FiSend, 
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Unique Opens', 
      value: overall.opened_count || 0, 
      icon: FiMail, 
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Total Opens', 
      value: overall.total_opens || 0, 
      icon: FiMail, 
      gradient: 'from-teal-500 to-cyan-500'
    },
    { 
      title: 'Unique Clicks', 
      value: overall.clicked_count || 0, 
      icon: FiMousePointer, 
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      title: 'Total Clicks', 
      value: overall.total_clicks || 0, 
      icon: FiMousePointer, 
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      title: 'Open Rate', 
      value: `${openRate}%`, 
      icon: FiTrendingUp, 
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      title: 'Click Rate', 
      value: `${clickRate}%`, 
      icon: FiActivity, 
      gradient: 'from-violet-500 to-purple-500'
    },
  ];

  return (
    <div className="container">
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <CardHeader>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiBarChart2 size={32} />
            Analytics Dashboard
          </h1>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-white/90">Detailed tracking and performance metrics</p>
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
    </div>
  );
}

