'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-slate-100 via-white to-slate-100 text-gray-900 shadow-sm border border-gray-100 rounded-2xl">
      <CardHeader className="pb-2">
        <h1 className="text-3xl font-bold">{title}</h1>
      </CardHeader>
      <CardBody className="pt-0">
        <p className="text-gray-600">{description}</p>
      </CardBody>
    </Card>
  );
}

