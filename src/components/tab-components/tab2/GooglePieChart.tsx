import React from 'react';

interface GooglePieChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

export const GooglePieChart: React.FC<GooglePieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const colors = ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-4">
      <h3 className="text-purple-300 font-semibold text-sm mb-4">{title}</h3>
      
      <div className="flex items-center justify-center h-32">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="ml-4 space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-white">{item.name}</span>
              <span className="text-gray-300">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};