'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { m } from 'framer-motion';

interface RateData {
  name: string;
  openRate: number;
  clickRate: number;
}

interface RateChartProps {
  data: RateData[];
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
            <span className="font-semibold">{entry.value.toFixed(1)}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RateChart({ data }: RateChartProps) {
  if (data.length === 0) {
    return (
      <m.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
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
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <defs>
            <linearGradient id="openRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="clickRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
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
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: 20 }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="openRate"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#openRateGradient)"
            name="Open Rate (%)"
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="clickRate"
            stroke="#f59e0b"
            strokeWidth={3}
            fill="url(#clickRateGradient)"
            name="Click Rate (%)"
            dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </m.div>
  );
}
