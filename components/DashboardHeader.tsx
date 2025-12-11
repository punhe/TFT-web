'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <Card className="mb-6 bg-white/95 shadow-sm border border-slate-200 rounded-2xl card-ghost">
      <CardHeader className="pb-2 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="pill">Live insights</span>
          <span className="text-xs text-slate-500">Updated in real-time</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        </div>
      </CardHeader>
      <CardBody className="pt-1">
        <p className="text-slate-600 text-base leading-relaxed">{description}</p>
      </CardBody>
    </Card>
  );
}

