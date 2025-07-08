import React from 'react';

interface GoogleLineChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

export const GoogleLineChart: React.FC<GoogleLineChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getY = (value: number) => {
    return 100 - ((value - minValue) / range) * 80;
  };

  const pathData = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 200;
    const y = getY(item.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800/50 to-green-900/50 backdrop-blur-sm border border-green-400/30 rounded-xl p-4">
      <h3 className="text-green-300 font-semibold text-sm mb-4">{title}</h3>
      
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="200"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Area under curve */}
          <path
            d={`${pathData} L 200 100 L 0 100 Z`}
            fill="url(#gradient)"
            opacity="0.3"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 200;
            const y = getY(item.value);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#10B981"
                className="hover:r-4 transition-all duration-300"
              />
            );
          })}
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-300">
          {data.map((item, index) => (
            <span key={index}>{item.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};