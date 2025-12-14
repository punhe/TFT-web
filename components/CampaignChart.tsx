'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { m } from 'framer-motion';

interface CampaignData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
}

interface CampaignChartProps {
  data: CampaignData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-xl">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampaignChart({ data }: CampaignChartProps) {
  if (data.length === 0) {
    return (
      <m.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm">Send some campaigns to see the chart</p>
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <defs>
            <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="clickedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: 20 }}
            iconType="circle"
          />
          <Bar 
            dataKey="sent" 
            fill="url(#sentGradient)" 
            name="Sent" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="opened" 
            fill="url(#openedGradient)" 
            name="Opened"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="clicked" 
            fill="url(#clickedGradient)" 
            name="Clicked"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </m.div>
  );
}
