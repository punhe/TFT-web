'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { FiActivity, FiMail, FiPlus, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { m } from 'framer-motion';

const actions = [
  {
    href: '/campaigns',
    label: 'View all campaigns',
    description: 'Manage your email campaigns',
    icon: FiMail,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    href: '/campaigns/new',
    label: 'Create new campaign',
    description: 'Start a fresh campaign',
    icon: FiPlus,
    gradient: 'from-primary to-secondary',
    bgGradient: 'from-primary/10 to-secondary/10',
    isPrimary: true,
  },
  {
    href: '/analytics',
    label: 'View analytics',
    description: 'Track your performance',
    icon: FiBarChart2,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
];

export default function QuickActions() {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="mt-8 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg shadow-gray-200/30 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/50" />
        
        <CardHeader className="relative flex items-center gap-4 px-6 pt-6 pb-2">
          <m.div 
            className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FiActivity className="text-2xl text-white" />
          </m.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quick actions</h2>
            <p className="text-gray-500">Jump into your most common tasks</p>
          </div>
        </CardHeader>
        
        <CardBody className="relative px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <m.div
                  key={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Button
                    as={Link}
                    href={action.href}
                    className={`
                      w-full h-auto py-5 px-5
                      flex flex-col items-start gap-3
                      rounded-2xl
                      transition-all duration-300
                      ${action.isPrimary 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30' 
                        : `bg-gradient-to-br ${action.bgGradient} text-gray-800 border border-gray-100 hover:border-gray-200 hover:shadow-lg`
                      }
                    `}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className={`
                        p-2.5 rounded-xl
                        ${action.isPrimary 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-br ${action.gradient} bg-opacity-10`
                        }
                      `}>
                        <Icon className={`text-xl ${action.isPrimary ? 'text-white' : `bg-gradient-to-r ${action.gradient} text-transparent bg-clip-text`}`} 
                          style={!action.isPrimary ? { WebkitTextFillColor: 'currentColor' } : {}}
                        />
                      </div>
                      <FiArrowRight className={`text-lg opacity-0 group-hover:opacity-100 transition-opacity ${action.isPrimary ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="w-full text-left">
                      <p className={`font-semibold ${action.isPrimary ? 'text-white' : 'text-gray-900'}`}>
                        {action.label}
                      </p>
                      <p className={`text-sm mt-0.5 ${action.isPrimary ? 'text-white/80' : 'text-gray-500'}`}>
                        {action.description}
                      </p>
                    </div>
                  </Button>
                </m.div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </m.div>
  );
}
