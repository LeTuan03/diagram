import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: DivideIcon;
  trend: 'up' | 'down';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div className={`text-sm font-semibold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-blue-200">{title}</div>
      </div>
      
      {/* Animated indicator */}
      <div className="mt-4 h-1 bg-blue-900/50 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};