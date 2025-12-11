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
    <Card className="shadow-md border border-gray-100 bg-white rounded-2xl">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full bg-gradient-to-br ${gradient} text-gray-900`}>
            <span className="inline-flex items-center justify-center">
              {icon}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

