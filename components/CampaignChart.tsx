'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CampaignData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
}

interface CampaignChartProps {
  data: CampaignData[];
}

export default function CampaignChart({ data }: CampaignChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
        No data available for chart
      </div>
    );
  }

  return (
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
        <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
        <Bar dataKey="opened" fill="#10b981" name="Opened" />
        <Bar dataKey="clicked" fill="#f59e0b" name="Clicked" />
      </BarChart>
    </ResponsiveContainer>
  );
}

