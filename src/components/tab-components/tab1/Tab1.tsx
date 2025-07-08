import { StatCard } from './StatCard';
import { GeographicChart } from '../GeographicChart';
import { RegionChart } from './RegionChart';
import { GoogleBarChart } from './GoogleBarChart';
import { GooglePieChart } from './GooglePieChart';
import { GoogleLineChart } from './GoogleLineChart';
import {
    Users,
    TrendingUp,
    DollarSign,
    Target,
    Globe,
    MapPin
} from 'lucide-react';

function Tap1() {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                        <Globe className="w-10 h-10 mr-3 text-blue-400" />
                        Global Analytics Dashboard
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                </div>

                {/* Geographic Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
                    <GeographicChart
                        data={worldData}
                        title="Global Distribution"
                    />
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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

                    <div className="rounded-xl">
                        <RegionChart
                            data={asiaData}
                            region="VN"
                        />
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
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <GoogleBarChart data={barChartData} title="Quarterly Performance" />
                    <GooglePieChart data={pieChartData} title="Device Distribution" />
                    <GoogleLineChart data={lineChartData} title="Monthly Growth Trend" />
                </div>
            </div>
        </div>
    );
}

export default Tap1;