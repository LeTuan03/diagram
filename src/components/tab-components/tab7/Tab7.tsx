import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { MapPin, TrendingUp, Users, Activity } from 'lucide-react';
import Tab6 from '../tab6/Tab6';

const Tab7: React.FC = () => {
    const barData = [
        { name: 'Hà Nội', value: 771 },
        { name: 'TP.HCM', value: 652 },
        { name: 'Đà Nẵng', value: 542 },
        { name: 'Cần Thơ', value: 487 },
        { name: 'Hải Phòng', value: 386 },
        { name: 'Nha Trang', value: 298 },
    ];

    const lineData = [
        { name: 'Tháng 1', value: 400 },
        { name: 'Tháng 2', value: 300 },
        { name: 'Tháng 3', value: 600 },
        { name: 'Tháng 4', value: 800 },
        { name: 'Tháng 5', value: 500 },
        { name: 'Tháng 6', value: 700 },
    ];

    const pieData = [
        { name: 'Loại A', value: 35, color: '#00D4FF' },
        { name: 'Loại B', value: 25, color: '#FF6B9D' },
        { name: 'Loại C', value: 20, color: '#4ECDC4' },
        { name: 'Loại D', value: 20, color: '#45B7D1' },
    ];

    const regionData = [
        {
            subject: 'Hà Nội',
            A: 120,
            B: 110,
            fullMark: 150,
        },
        {
            subject: 'TP.HCM',
            A: 98,
            B: 130,
            fullMark: 150,
        },
        {
            subject: 'Đà Nẵng',
            A: 86,
            B: 130,
            fullMark: 150,
        },
        {
            subject: 'Cần Thơ',
            A: 99,
            B: 100,
            fullMark: 150,
        },
        {
            subject: 'Hải Phòng',
            A: 85,
            B: 90,
            fullMark: 150,
        },
        {
            subject: 'Nha Trang',
            A: 65,
            B: 85,
            fullMark: 150,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
            {/* Lưới chính */}
            <div className="grid grid-cols-12 gap-6 h-full">
                {/* Cột trái */}
                <div className="col-span-3 space-y-6">
                    {/* Biểu đồ cột */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-300">Xếp Hạng Thành Phố</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Bar dataKey="value" fill="#00D4FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Biểu đồ tròn */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-300">Phân Bố Dữ Liệu</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Thống kê thời gian thực */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-300">Dữ Liệu Thời Gian Thực</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Người Dùng Trực Tuyến</span>
                                <span className="text-2xl font-bold text-cyan-400">1,234</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Tổng Lượt Truy Cập</span>
                                <span className="text-2xl font-bold text-green-400">45,678</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Tỷ Lệ Chuyển Đổi</span>
                                <span className="text-2xl font-bold text-yellow-400">78%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột giữa - bản đồ */}
                <div className="col-span-6">
                    <Tab6 />
                </div>

                {/* Cột phải */}
                <div className="col-span-3 space-y-6">
                    {/* Thống kê ngắn */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">54</div>
                                    <div className="text-sm text-gray-400">Thiết Bị Hoạt Động</div>
                                </div>
                                <Activity className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-cyan-400">377</div>
                                    <div className="text-sm text-gray-400">Kết Nối Tổng</div>
                                </div>
                                <Users className="w-8 h-8 text-cyan-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-green-400">2,634</div>
                                    <div className="text-sm text-gray-400">Khối Lượng Xử Lý</div>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-yellow-400">42</div>
                                    <div className="text-sm text-gray-400">Sự Cố Cảnh Báo</div>
                                </div>
                                <MapPin className="w-8 h-8 text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ đường */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-300">Phân Tích Xu Hướng</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Line type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Dữ liệu vùng */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-300">Dữ Liệu Theo Khu Vực</h3>
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={225}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={regionData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis />
                                    <Radar name="A" dataKey="A" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tab7;
