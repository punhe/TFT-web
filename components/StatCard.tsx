'use client';

import { Card, CardBody } from '@heroui/react';
import { ReactNode } from 'react';
import { m } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
  index?: number;
}

const gradientMap: Record<string, string> = {
  'from-blue-50 to-indigo-50': 'from-primary/20 to-primary/5',
  'from-emerald-50 to-teal-50': 'from-success/20 to-success/5',
  'from-amber-50 to-orange-50': 'from-warning/20 to-warning/5',
};

const iconGradientMap: Record<string, string> = {
  'from-blue-50 to-indigo-50': 'from-primary to-primary-600',
  'from-emerald-50 to-teal-50': 'from-success to-success-600',
  'from-amber-50 to-orange-50': 'from-warning to-warning-600',
};

export default function StatCard({ title, value, icon, gradient, index = 0 }: StatCardProps) {
  const bgGradient = gradientMap[gradient] || 'from-primary/20 to-primary/5';
  const iconGradient = iconGradientMap[gradient] || 'from-primary to-primary-600';

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card 
        className={`
          relative overflow-hidden
          bg-white/80 backdrop-blur-sm
          border border-white/50
          rounded-2xl
          shadow-lg shadow-gray-200/50
          hover:shadow-xl hover:shadow-primary/10
          transition-all duration-400
          group
        `}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <CardBody className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <m.div 
              className={`
                p-3.5 rounded-2xl 
                bg-gradient-to-br ${iconGradient}
                text-white shadow-lg
                group-hover:scale-110 transition-transform duration-300
              `}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center justify-center">
                {icon}
              </span>
            </m.div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Live
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <m.p 
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
            >
              {value}
            </m.p>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </CardBody>
      </Card>
    </m.div>
  );
}
