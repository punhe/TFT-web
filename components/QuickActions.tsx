'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { FiActivity } from 'react-icons/fi';

export default function QuickActions() {
  return (
    <Card className="mt-6 shadow-sm border border-slate-200 rounded-2xl bg-white/95">
      <CardHeader className="flex items-center gap-3 pb-2">
        <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
          <FiActivity className="text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <p className="text-sm text-slate-500">Jump into your most common tasks</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            as={Link}
            href="/campaigns"
            color="primary"
            variant="flat"
            size="md"
            className="rounded-xl px-4 justify-start w-full bg-blue-50 text-blue-800 border border-blue-100"
          >
            View all campaigns
          </Button>
          <Button
            as={Link}
            href="/campaigns/new"
            color="secondary"
            variant="solid"
            size="md"
            className="rounded-xl px-4 justify-start w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
          >
            Create new campaign
          </Button>
          <Button
            as={Link}
            href="/analytics"
            color="default"
            variant="bordered"
            size="md"
            className="rounded-xl px-4 justify-start w-full border-slate-200 text-slate-800"
          >
            View analytics
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

