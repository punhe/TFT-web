'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { m } from 'framer-motion';
import { FiActivity, FiTrendingUp } from 'react-icons/fi';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <Card className="mb-8 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-gray-200/30 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-secondary/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <CardHeader className="relative pb-2 flex flex-col gap-4 pt-6 px-6">
          <m.div 
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="live-indicator pill">
              <FiActivity className="text-secondary animate-pulse" />
              <span>Live insights</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiTrendingUp className="text-success" />
              <span>Updated in real-time</span>
            </div>
          </m.div>
          
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {title}
              </span>
            </h1>
          </m.div>
        </CardHeader>
        
        <CardBody className="relative pt-2 pb-6 px-6">
          <m.p 
            className="text-gray-600 text-lg leading-relaxed max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {description}
          </m.p>
        </CardBody>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <m.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </div>
      </Card>
    </m.div>
  );
}
