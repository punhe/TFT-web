'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Tooltip } from '@heroui/react';
import { FiMail, FiPlus, FiEye, FiEdit, FiUsers, FiMousePointer, FiRefreshCw, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { m } from 'framer-motion';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  recipient_count: number;
  opened_count: number;
  clicked_count: number;
  status: string;
  created_at: string;
}

interface CampaignsListProps {
  campaigns: Campaign[];
}

export default function CampaignsList({ campaigns }: CampaignsListProps) {
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
          
          <CardHeader className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
            <div className="flex items-center gap-4">
              <m.div 
                className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FiMail size={28} className="text-white" />
              </m.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Campaigns
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <FiTrendingUp className="text-success" />
                  Manage every send in one calm place
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onPress={() => router.refresh()}
                  variant="flat"
                  startContent={<FiRefreshCw />}
                  className="rounded-xl bg-white/80 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  Reload
                </Button>
              </m.div>
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  as={Link}
                  href="/campaigns/new"
                  startContent={<FiPlus />}
                  className="rounded-xl px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Create campaign
                </Button>
              </m.div>
            </div>
          </CardHeader>
        </Card>
      </m.div>

      {/* Table Card */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg shadow-gray-200/30 overflow-hidden">
          {campaigns.length === 0 ? (
            <CardBody className="text-center py-20">
              <m.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-6">
                  <FiMail className="text-6xl text-gray-300" />
                </div>
                <p className="text-gray-600 mb-2 text-xl font-medium">No campaigns yet</p>
                <p className="text-gray-400 mb-8">Create your first campaign to get started.</p>
                <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    as={Link}
                    href="/campaigns/new"
                    startContent={<FiPlus />}
                    className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl px-8 py-6 shadow-lg shadow-primary/25"
                    size="lg"
                  >
                    Create your first campaign
                  </Button>
                </m.div>
              </m.div>
            </CardBody>
          ) : (
            <Table 
              aria-label="Campaigns table" 
              selectionMode="none"
              classNames={{
                wrapper: "bg-transparent shadow-none",
                th: "bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-600 font-semibold text-xs uppercase tracking-wider",
                td: "py-4",
                tr: "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-colors duration-200",
              }}
            >
              <TableHeader>
                <TableColumn>CAMPAIGN</TableColumn>
                <TableColumn>SUBJECT</TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-primary" />
                    RECIPIENTS
                  </div>
                </TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-success" />
                    OPENED
                  </div>
                </TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    <FiMousePointer className="text-warning" />
                    CLICKED
                  </div>
                </TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign, index) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <m.div 
                        className="flex flex-col gap-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="font-semibold text-gray-900">{campaign.name}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                      </m.div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 line-clamp-1">{campaign.subject}</span>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm" 
                        className="min-w-[52px] justify-center font-semibold"
                      >
                        {campaign.recipient_count || 0}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color="success" 
                        variant="flat" 
                        size="sm" 
                        className="min-w-[52px] justify-center font-semibold"
                      >
                        {campaign.opened_count || 0}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color="warning" 
                        variant="flat" 
                        size="sm" 
                        className="min-w-[52px] justify-center font-semibold"
                      >
                        {campaign.clicked_count || 0}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={campaign.status === 'sent' ? 'success' : 'warning'} 
                        variant="flat"
                        size="sm"
                        className="capitalize rounded-full font-medium"
                        startContent={
                          campaign.status === 'sent' ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                          )
                        }
                      >
                        {campaign.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Tooltip content="View campaign details" placement="top">
                          <Button
                            as={Link}
                            href={`/campaigns/${campaign.id}`}
                            size="sm"
                            isIconOnly
                            variant="flat"
                            className="rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <FiEye />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit campaign" placement="top">
                          <Button
                            as={Link}
                            href={`/campaigns/${campaign.id}/edit`}
                            size="sm"
                            isIconOnly
                            variant="flat"
                            className="rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <FiEdit />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </m.div>
    </>
  );
}
