import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
}

export const CustomLineChart: React.FC<LineChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            stroke="rgba(59, 130, 246, 0.3)"
          />
          <YAxis 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            stroke="rgba(59, 130, 246, 0.3)"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#60a5fa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};