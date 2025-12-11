'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from '@heroui/react';
import { FiMail, FiPlus, FiEye, FiEdit, FiUsers, FiMousePointer, FiRefreshCw } from 'react-icons/fi';

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
      <Card className="mb-6 bg-white/95 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FiMail size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Campaigns</h1>
              <p className="text-slate-500 mt-1">Manage every send in one calm place</p>
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
              href="/campaigns/new"
              color="secondary"
              variant="solid"
              startContent={<FiPlus />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md rounded-xl"
              size="md"
            >
              Create campaign
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white/95">
        {campaigns.length === 0 ? (
          <CardBody className="text-center py-16">
            <FiMail className="mx-auto mb-4 text-6xl text-gray-300" />
            <p className="text-gray-600 mb-6 text-lg">No campaigns yet. Create your first campaign to get started.</p>
            <Button
              as={Link}
              href="/campaigns/new"
              color="primary"
              variant="solid"
              startContent={<FiPlus />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl"
              size="md"
            >
              Create campaign
            </Button>
          </CardBody>
        ) : (
          <Table aria-label="Campaigns table" selectionMode="none" className="table-soft text-sm">
            <TableHeader>
              <TableColumn>CAMPAIGN</TableColumn>
              <TableColumn>SUBJECT</TableColumn>
              <TableColumn>
                <div className="flex items-center gap-2">
                  <FiUsers />
                  RECIPIENTS
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-2">
                  <FiMail />
                  OPENED
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-2">
                  <FiMousePointer />
                  CLICKED
                </div>
              </TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-900">{campaign.name}</span>
                      <span className="text-xs text-gray-500">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{campaign.subject}</TableCell>
                  <TableCell>
                    <Chip color="primary" variant="flat" size="sm" className="min-w-[52px] justify-center">
                      {campaign.recipient_count || 0}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color="success" variant="flat" size="sm" className="min-w-[52px] justify-center">
                      {campaign.opened_count || 0}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color="warning" variant="flat" size="sm" className="min-w-[52px] justify-center">
                      {campaign.clicked_count || 0}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={campaign.status === 'sent' ? 'success' : 'warning'} 
                      variant="flat"
                      size="sm"
                      className="capitalize rounded-full"
                    >
                      {campaign.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        as={Link}
                        href={`/campaigns/${campaign.id}`}
                        size="sm"
                        variant="flat"
                        startContent={<FiEye />}
                        className="rounded-lg border border-slate-200 text-blue-700 bg-blue-50"
                      >
                        View
                      </Button>
                      <Button
                        as={Link}
                        href={`/campaigns/${campaign.id}/edit`}
                        size="sm"
                        variant="flat"
                        startContent={<FiEdit />}
                        className="rounded-lg border border-slate-200 text-slate-800"
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </>
  );
}

