import React from 'react';
import { BarChart, TrendingUp, PieChart, Activity, Target, Zap } from 'lucide-react';
import ModernLineChart from './charts/ModernLineChart';
import ModernBarChart from './charts/ModernBarChart';
import ModernDoughnutChart from './charts/ModernDoughnutChart';
import ModernRadarChart from './charts/ModernRadarChart';
import ModernAreaChart from './charts/ModernAreaChart';
import Modern3DPolarChart from './charts/Modern3DPolarChart';
import Modern3DScatterChart from './charts/Modern3DScatterChart';

const Tab8: React.FC = () => {
  return (
    <div className="min-h-screen p-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="group bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-white mb-1">$45,231</p>
                <p className="text-green-400 text-sm font-medium">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-colors">
                <TrendingUp className="text-blue-400" size={28} />
              </div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-green-400/50 transition-all duration-300 shadow-2xl hover:shadow-green-500/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Active Users</p>
                <p className="text-3xl font-bold text-white mb-1">2,842</p>
                <p className="text-green-400 text-sm font-medium">+8% from last week</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-2xl group-hover:bg-green-500/30 transition-colors">
                <Activity className="text-green-400" size={28} />
              </div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-orange-400/50 transition-all duration-300 shadow-2xl hover:shadow-orange-500/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Conversion Rate</p>
                <p className="text-3xl font-bold text-white mb-1">12.5%</p>
                <p className="text-orange-400 text-sm font-medium">+2.3% improvement</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-2xl group-hover:bg-orange-500/30 transition-colors">
                <Target className="text-orange-400" size={28} />
              </div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-white mb-1">1,234</p>
                <p className="text-purple-400 text-sm font-medium">+15% this month</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl group-hover:bg-purple-500/30 transition-colors">
                <BarChart className="text-purple-400" size={28} />
              </div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-r from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transition-all duration-300 shadow-2xl hover:shadow-pink-500/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Growth Rate</p>
                <p className="text-3xl font-bold text-white mb-1">+23%</p>
                <p className="text-pink-400 text-sm font-medium">Exceeding target</p>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-2xl group-hover:bg-pink-500/30 transition-colors">
                <PieChart className="text-pink-400" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Modern Line Chart */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Revenue Analytics</h3>
            </div>
            <ModernLineChart />
          </div>

          {/* Modern Bar Chart */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-green-400/50 transition-all duration-300 shadow-2xl hover:shadow-green-500/20 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <BarChart className="text-green-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Quarterly Performance</h3>
            </div>
            <ModernBarChart />
          </div>

          {/* Modern Doughnut Chart */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <PieChart className="text-purple-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Market Share Distribution</h3>
            </div>
            <ModernDoughnutChart />
          </div>

          {/* Modern Radar Chart */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-orange-400/50 transition-all duration-300 shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <Activity className="text-orange-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Performance Metrics</h3>
            </div>
            <ModernRadarChart />
          </div>
        </div>

        {/* Second Row - Advanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 3D Polar Chart */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transition-all duration-300 shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-500/20 rounded-xl">
                <Target className="text-pink-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Department Analysis</h3>
            </div>
            <Modern3DPolarChart />
          </div>

          {/* 3D Scatter Chart */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-teal-400/50 transition-all duration-300 shadow-2xl hover:shadow-teal-500/20 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-500/20 rounded-xl">
                <Zap className="text-teal-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Performance Scatter</h3>
            </div>
            <Modern3DScatterChart />
          </div>
        </div>

        {/* Full Width Area Chart */}
        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-indigo-400/50 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">User Engagement Trends</h3>
          </div>
          <ModernAreaChart />
        </div>
      </div>
    </div>
  );
};

export default Tab8;