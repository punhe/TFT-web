'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RateData {
  name: string;
  openRate: number;
  clickRate: number;
}

interface RateChartProps {
  data: RateData[];
}

export default function RateChart({ data }: RateChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
        No data available for chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          style={{ fontSize: '12px' }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="openRate" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Open Rate (%)"
          dot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="clickRate" 
          stroke="#f59e0b" 
          strokeWidth={2}
          name="Click Rate (%)"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

