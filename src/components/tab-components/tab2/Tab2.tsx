import React, { useState, useEffect } from 'react';
import { GoogleBarChart } from './GoogleBarChart';
import { GooglePieChart } from './GooglePieChart';
import { GoogleLineChart } from './GoogleLineChart';
import { StatCard } from './StatCard';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  BarChart3,
  PieChart,
  MapPin,
  Maximize2,
} from 'lucide-react';
import { GeographicChart } from '../GeographicChart';

interface DashboardData {
  worldData: Array<{ country: string; value: number }>;
  barChartData: Array<{ name: string; value: number }>;
  pieChartData: Array<{ name: string; value: number }>;
  lineChartData: Array<{ name: string; value: number }>;
  stats: Array<{ title: string; value: string; change: string; icon: any; trend: 'up' | 'down' }>;
}

export const Tab2: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Sample data
  const dashboardData: DashboardData = {
    worldData: [
      { country: 'Trung Quốc', value: 1500 },
      { country: 'Hoa Kỳ', value: 1200 },
      { country: 'Nhật Bản', value: 800 },
      { country: 'Đức', value: 600 },
      { country: 'Vương quốc Anh', value: 500 },
      { country: 'Pháp', value: 450 },
      { country: 'Ấn Độ', value: 400 },
      { country: 'Brazil', value: 350 },
      { country: 'Canada', value: 300 },
      { country: 'Úc', value: 250 },
    ],
    barChartData: [
      { name: 'Quý 1 2024', value: 2400 },
      { name: 'Quý 2 2024', value: 1398 },
      { name: 'Quý 3 2024', value: 9800 },
      { name: 'Quý 4 2024', value: 3908 },
    ],
    pieChartData: [
      { name: 'Máy tính', value: 400 },
      { name: 'Di động', value: 300 },
      { name: 'Máy tính bảng', value: 200 },
      { name: 'TV thông minh', value: 150 },
      { name: 'Khác', value: 100 },
    ],
    lineChartData: [
      { name: 'Tháng 1', value: 400 },
      { name: 'Tháng 2', value: 300 },
      { name: 'Tháng 3', value: 500 },
      { name: 'Tháng 4', value: 280 },
      { name: 'Tháng 5', value: 590 },
      { name: 'Tháng 6', value: 320 },
      { name: 'Tháng 7', value: 450 },
      { name: 'Tháng 8', value: 680 },
    ],
    stats: [
      { title: 'Người dùng toàn cầu', value: '2.4M', change: '+15.3%', icon: Users, trend: 'up' },
      { title: 'Doanh thu', value: '$1.25M', change: '+8.2%', icon: DollarSign, trend: 'up' },
      { title: 'Khu vực hoạt động', value: '47', change: '+3', icon: MapPin, trend: 'up' },
      { title: 'Tỷ lệ chuyển đổi', value: '4.24%', change: '+0.8%', icon: Target, trend: 'up' },
    ]
  };

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartComponents = [
    {
      component: <GoogleBarChart data={dashboardData.barChartData} title="Quarterly Performance" />,
      icon: BarChart3,
      title: "Performance"
    },
    {
      component: <GooglePieChart data={dashboardData.pieChartData} title="Device Distribution" />,
      icon: PieChart,
      title: "Distribution"
    },
    {
      component: <GoogleLineChart data={dashboardData.lineChartData} title="Growth Trend" />,
      icon: TrendingUp,
      title: "Trends"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'overflow-hidden'}`}>
      {/* Header */}
      <div className={`relative z-10 pt-8 pb-4 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="text-center">
          {/* Control Panel */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg px-4 py-2 text-white flex items-center space-x-2 transition-all duration-300"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Top Row */}
      <div className={`relative z-10 px-6 mb-4 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-5 gap-4">
            {dashboardData.stats.map((stat, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 ${animationPhase === index ? 'scale-105' : 'scale-100'
                  }`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <StatCard {...stat} />
              </div>
            ))}
            {/* Additional stat card to match the 5-column layout */}
            <div className="transform transition-all duration-1000">
              <StatCard
                title="系统状态"
                value="99.9%"
                change="+0.1%"
                icon={Activity}
                trend="up"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className={`relative flex-1 ${isFullscreen ? 'p-0' : 'px-6'}`}>
        <div className={`mx-auto relative ${isFullscreen ? 'w-full h-screen' : 'max-w-7xl h-[600px]'}`}>

          {/* Central Geographic Chart */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className={`transition-all duration-700 ${isFullscreen ? 'w-[95vw] h-[90vh]' : 'w-[600px] h-[400px]'
                } relative`}
            >
              <div className="relative">
                {/* Animated rings around the map */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isFullscreen ? 'hidden' : ''}`}>
                  <div className="w-full h-full rounded-full border-2 border-blue-400/20 animate-ping"></div>
                  <div className="absolute w-4/5 h-4/5 rounded-full border border-blue-300/30 animate-pulse"></div>
                  <div className="absolute w-3/5 h-3/5 rounded-full border border-blue-200/40"></div>
                </div>

                <GeographicChart
                  data={dashboardData.worldData}
                  title="Global Data Distribution"
                />

                {/* Floating data indicator */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-white text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Data</span>
                    </div>
                    <div className="text-xs text-gray-300">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Fullscreen Exit Button */}
                {isFullscreen && (
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-6 left-6 bg-red-600/80 hover:bg-red-600 rounded-lg p-3 text-white transition-all duration-300 z-50"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}

                {/* Fullscreen Charts Display */}
                {isFullscreen && (
                  <div className="inset-0 grid grid-cols-3 gap-6 pt-8">
                    {chartComponents.map((chart, index) => (
                      <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="h-full">
                          {chart.component}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Radial Chart Layout - Improved positioning */}
          {!isFullscreen && (
            <>
              {/* Left Side Charts */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-6">
                <div className="w-80 h-48 pointer-events-auto group transition-transform duration-500 hover:scale-105">
                  <div className="relative w-full h-full rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
                    <GoogleBarChart data={dashboardData.barChartData} title="Phân tích hiệu suất hàng quý" />
                    <div className="absolute -top-4 left-4 bg-blue-500 rounded-full p-2 shadow-lg">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="w-80 h-48 pointer-events-auto group transition-transform duration-500 hover:scale-105">
                  <div className="relative w-full h-full rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
                    <GoogleLineChart data={dashboardData.lineChartData} title="Phân tích xu hướng tăng trưởng" />
                    <div className="absolute -top-4 left-4 bg-green-500 rounded-full p-2 shadow-lg">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Charts */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-6">
                <div className="w-80 h-48 pointer-events-auto group transition-transform duration-500 hover:scale-105">
                  <div className="relative w-full h-full rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
                    <GooglePieChart data={dashboardData.pieChartData} title="Thống kê phân phối thiết bị" />
                    <div className="absolute -top-4 right-4 bg-purple-500 rounded-full p-2 shadow-lg">
                      <PieChart className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="w-80 h-48 pointer-events-auto group transition-transform duration-500 hover:scale-105">
                  <div className="relative w-full h-full rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
                    <div className="p-4 h-full">
                      <h3 className="text-cyan-300 font-semibold text-sm mb-4">Giám sát dữ liệu thời gian thực</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Người dùng trực tuyến', value: '24,567', color: 'text-green-400' },
                          { label: 'Phiên hoạt động', value: '8,432', color: 'text-blue-400' },
                          { label: 'Truyền dữ liệu', value: '1.2GB/s', color: 'text-yellow-400' },
                          { label: 'Tải hệ thống', value: '67%', color: 'text-orange-400' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">{item.label}</span>
                            <span className={`font-bold ${item.color}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute -top-4 right-4 bg-cyan-500 rounded-full p-2 shadow-lg">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className={`fixed bottom-6 right-6 w-80 bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 z-30 ${isFullscreen ? 'hidden' : ''}`}>
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Giám sát hoạt động theo thời gian thực
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {[
            { color: 'green', text: 'Người dùng mới ở Hà Nội', time: '2 giây trước' },
            { color: 'blue', text: 'Đồng bộ dữ liệu hoàn tất', time: '15 giây trước' },
            { color: 'orange', text: 'Cảnh báo lưu lượng cao', time: '1 phút trước' },
            { color: 'purple', text: 'Báo cáo đã được tạo', time: '3 phút trước' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 bg-${activity.color}-400 rounded-full animate-pulse`}></div>
              <span className="text-cyan-200 flex-1">{activity.text}</span>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};