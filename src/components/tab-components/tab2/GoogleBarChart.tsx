import React from 'react';

interface GoogleBarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

export const GoogleBarChart: React.FC<GoogleBarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
      <h3 className="text-blue-300 font-semibold text-sm mb-4">{title}</h3>
      
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-green-500', 'bg-yellow-500'];
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full ${colors[index % colors.length]} rounded-t transition-all duration-1000 hover:opacity-80`}
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-blue-200 mt-2 text-center">
                {item.name}
              </div>
              <div className="text-xs text-white font-bold">
                {item.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};