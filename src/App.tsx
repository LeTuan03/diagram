import { StatCard } from './components/StatCard';
import { GeographicChart } from './components/GeographicChart';
import { RegionChart } from './components/RegionChart';
import { GoogleBarChart } from './components/GoogleBarChart';
import { GooglePieChart } from './components/GooglePieChart';
import { GoogleLineChart } from './components/GoogleLineChart';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  Globe,
  MapPin
} from 'lucide-react';
import TabRender from './components/TabRender';

function App() {
  // Sample data for charts
  const barChartData = [
    { name: 'Q1 2024', value: 2400 },
    { name: 'Q2 2024', value: 1398 },
    { name: 'Q3 2024', value: 9800 },
    { name: 'Q4 2024', value: 3908 },
  ];

  const pieChartData = [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
    { name: 'Smart TV', value: 150 },
    { name: 'Others', value: 100 },
  ];

  const lineChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
    { name: 'Jun', value: 320 },
    { name: 'Jul', value: 450 },
    { name: 'Aug', value: 680 },
  ];

  // Geographic data for world map
  const worldData = [
    { country: 'China', value: 1500 },
    { country: 'United States', value: 1200 },
    { country: 'Japan', value: 800 },
    { country: 'Germany', value: 600 },
    { country: 'United Kingdom', value: 500 },
    { country: 'France', value: 450 },
    { country: 'India', value: 400 },
    { country: 'Brazil', value: 350 },
    { country: 'Canada', value: 300 },
    { country: 'Australia', value: 250 },
  ];

  // Regional data for Asia
  const asiaData = [
    { region: 'CN-BJ', value: 200 }, // Beijing
    { region: 'CN-SH', value: 180 }, // Shanghai
    { region: 'CN-GD', value: 160 }, // Guangdong
    { region: 'CN-JS', value: 140 }, // Jiangsu
    { region: 'CN-ZJ', value: 120 }, // Zhejiang
    { region: 'CN-SD', value: 100 }, // Shandong
    { region: 'CN-HB', value: 90 },  // Hubei
    { region: 'CN-SC', value: 85 },  // Sichuan
  ];

  const tabs = [
    {
      label: 'Global Distribution', content: <GeographicChart
        data={worldData}
        title="Global Distribution"
      />
    },
    {
      label: 'RegionChart', content:
        <RegionChart
          data={asiaData}
          title="Asia Pacific Regions"
          region="CN"
        />
    },
    {
      label: 'Global Distribution', content: <GeographicChart
        data={worldData}
        title="Global Distribution"
      />
    },
    {
      label: 'Asia Pacific Regions', content:
        <RegionChart
          data={asiaData}
          title="Asia Pacific Regions"
          region="CN"
        />
    },
    {
      label: 'Quarterly Performance', content:
        <GoogleBarChart data={barChartData} title="Quarterly Performance" />
    },
    {
      label: 'Device Distribution', content:
        <GooglePieChart data={pieChartData} title="Device Distribution" />
    },
    {
      label: 'Monthly Growth Trend', content: <GoogleLineChart data={lineChartData} title="Monthly Growth Trend" />
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Globe className="w-10 h-10 mr-3 text-blue-400" />
            Global Analytics Dashboard
          </h1>
          {/* <p className="text-blue-200">Real-time insights and geographic data visualization</p> */}
          <TabRender tabs={tabs} />
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Global Users"
            value="2.4M"
            change="+15.3% from last month"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Revenue"
            value="$1.25M"
            change="+8.2% from last month"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Active Regions"
            value="47"
            change="+3 new regions"
            icon={MapPin}
            trend="up"
          />
          <StatCard
            title="Conversion Rate"
            value="4.24%"
            change="+0.8% from last month"
            icon={Target}
            trend="up"
          />
        </div> */}

        {/* Geographic Visualizations */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GeographicChart
            data={worldData}
            title="Global Distribution"
          />
          <RegionChart
            data={asiaData}
            title="Asia Pacific Regions"
            region="CN"
          />
        </div> */}

        {/* Performance Metrics */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Page Load Speed</span>
                <span className="text-green-400 font-semibold">1.2s</span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-200">Server Response</span>
                <span className="text-green-400 font-semibold">0.8s</span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-200">Uptime</span>
                <span className="text-green-400 font-semibold">99.9%</span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Real-time Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-sm">New user from Tokyo</span>
                <span className="text-xs text-gray-400">2s ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-sm">Purchase completed in NYC</span>
                <span className="text-xs text-gray-400">15s ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-sm">Server maintenance in EU</span>
                <span className="text-xs text-gray-400">1m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-sm">Report generated</span>
                <span className="text-xs text-gray-400">3m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-sm">API call from London</span>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Top Regions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-red-500 rounded-sm"></div>
                  <span className="text-blue-200">China</span>
                </div>
                <span className="text-white font-semibold">1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-blue-600 rounded-sm"></div>
                  <span className="text-blue-200">United States</span>
                </div>
                <span className="text-white font-semibold">1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-white rounded-sm"></div>
                  <span className="text-blue-200">Japan</span>
                </div>
                <span className="text-white font-semibold">800</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-black rounded-sm"></div>
                  <span className="text-blue-200">Germany</span>
                </div>
                <span className="text-white font-semibold">600</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-blue-800 rounded-sm"></div>
                  <span className="text-blue-200">United Kingdom</span>
                </div>
                <span className="text-white font-semibold">500</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GoogleBarChart data={barChartData} title="Quarterly Performance" />
          <GooglePieChart data={pieChartData} title="Device Distribution" />
          <GoogleLineChart data={lineChartData} title="Monthly Growth Trend" />
        </div> */}
      </div>
    </div>
  );
}

export default App;