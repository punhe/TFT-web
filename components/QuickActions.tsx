'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { FiActivity } from 'react-icons/fi';

export default function QuickActions() {
  return (
    <Card className="mt-6 shadow-sm border border-gray-100 rounded-2xl bg-white">
      <CardHeader className="flex items-center gap-3">
        <FiActivity className="text-xl" />
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </CardHeader>
      <CardBody>
        <div className="flex gap-3 flex-wrap">
          <Button
            as={Link}
            href="/campaigns"
            color="primary"
            variant="flat"
            size="md"
            className="rounded-full px-4"
          >
            View All Campaigns
          </Button>
          <Button
            as={Link}
            href="/campaigns/new"
            color="secondary"
            variant="flat"
            size="md"
            className="rounded-full px-4"
          >
            Create New Campaign
          </Button>
          <Button
            as={Link}
            href="/analytics"
            color="default"
            variant="bordered"
            size="md"
            className="rounded-full px-4 border-gray-200"
          >
            View Analytics
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

