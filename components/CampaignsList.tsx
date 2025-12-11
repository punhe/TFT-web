'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from '@heroui/react';
import { FiMail, FiPlus, FiEye, FiEdit, FiUsers, FiMousePointer } from 'react-icons/fi';

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
  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl animate-slide-down">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 animate-fade-in">
              <FiMail size={32} className="animate-float" />
              Campaigns
            </h1>
            <p className="text-white/90 mt-1 animate-slide-up">Manage your email marketing campaigns</p>
          </div>
          <Button
            as={Link}
            href="/campaigns/new"
            color="secondary"
            variant="solid"
            startContent={<FiPlus />}
            className="bg-white text-blue-600 font-semibold hover:bg-white/90"
            size="lg"
          >
            Create Campaign
          </Button>
        </CardHeader>
      </Card>

      <Card className="shadow-lg animate-fade-in">
        {campaigns.length === 0 ? (
          <CardBody className="text-center py-16">
            <FiMail className="mx-auto mb-4 text-6xl text-gray-300 animate-float" />
            <p className="text-gray-600 mb-6 text-lg animate-slide-up">No campaigns yet. Create your first campaign to get started.</p>
            <Button
              as={Link}
              href="/campaigns/new"
              color="primary"
              variant="solid"
              startContent={<FiPlus />}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
              size="lg"
            >
              Create Campaign
            </Button>
          </CardBody>
        ) : (
          <Table aria-label="Campaigns table" selectionMode="none">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
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
              <TableColumn>CREATED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{campaign.name}</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{campaign.subject}</TableCell>
                  <TableCell>
                    <Chip color="primary" variant="flat" size="sm">
                      {campaign.recipient_count || 0}
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
                    <Chip 
                      color={campaign.status === 'sent' ? 'success' : 'warning'} 
                      variant="flat"
                      size="sm"
                    >
                      {campaign.status}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        href={`/campaigns/${campaign.id}`}
                        size="sm"
                        variant="light"
                        startContent={<FiEye />}
                        className="text-blue-600"
                      >
                        View
                      </Button>
                      <Button
                        as={Link}
                        href={`/campaigns/${campaign.id}/edit`}
                        size="sm"
                        variant="light"
                        startContent={<FiEdit />}
                        className="text-purple-600"
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

