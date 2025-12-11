'use client';

import { Card, CardBody } from '@heroui/react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
}

export default function StatCard({ title, value, icon, gradient }: StatCardProps) {
  return (
    <Card className="shadow-sm border border-slate-200 bg-white/95 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition duration-200">
      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-slate-900 shadow-inner`}>
            <span className="inline-flex items-center justify-center">
              {icon}
            </span>
          </div>
          <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
            Now
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-600 font-semibold">{title}</p>
          <p className="text-3xl font-bold text-slate-900 leading-tight">
            {value}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

