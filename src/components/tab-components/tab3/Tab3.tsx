import React, { useState } from "react";
import { MapPin, Navigation, TrendingUp, Users, Activity } from 'lucide-react';
import CircleChart from "../tab8/CircleChart";
import {
    XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, LineChart, Line,
} from 'recharts';
import Tab9 from "../tab9/Tab9"
import "./style.scss";
import { LabelTitleComponent } from "../../LabelTitle";
import HierarchicalBarChart from "../D3Chart/HierarchicalBarchart";
import BarChartTransitions from "../D3Chart/BarChartTransitions";
import ZoomableCirclePacking from "../D3Chart/ZoomableCirclePacking";

const Tab3: React.FC = () => {
    const [showMarkers, setShowMarkers] = useState(true);
    const [showFlows, setShowFlows] = useState(true);

    const lineData = [
        { name: 'Tháng 1', value: 400 },
        { name: 'Tháng 2', value: 300 },
        { name: 'Tháng 3', value: 600 },
        { name: 'Tháng 4', value: 800 },
        { name: 'Tháng 5', value: 500 },
        { name: 'Tháng 6', value: 700 },
    ];
    // Các hàm không đổi, chuyển ra ngoài component hoặc dùng useCallback


    return (
        <div className="w-full  min-h-screen chart-video-container">
            <div className="grid grid-cols-12 gap-6 h-full">
                {/* Control Panel */}
                <video autoPlay muted loop playsInline className="chart-video-bg">
                    <source src="media/video/backgroundMap5.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>

                <div className="col-span-3 space-y-6 p-3 z-10">
                    <div className="">
                        <LabelTitleComponent title="Radar Chart" />
                        {/* <Bubble /> */}
                        <HierarchicalBarChart />
                    </div>
                    <div className="">
                        <LabelTitleComponent title="Radar Chart" />
                        {/* <HierarchicalBarChart data={dataFake} /> */}
                        <BarChartTransitions />
                    </div>

                    <div className="">
                        <LabelTitleComponent title="Radar Chart" />
                        <CircleChart />
                    </div>

                </div>
                <div className="col-span-6 p-5">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-blue-500/20">
                        <div className="grid grid-cols-3 gap-2">
                            {/* Toggle Controls */}
                            <div className="px-2">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="showMarkers"
                                        checked={showMarkers}
                                        onChange={(e) => setShowMarkers(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showMarkers" className="text-white flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        Markers
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="showFlows"
                                        checked={showFlows}
                                        onChange={(e) => setShowFlows(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showFlows" className="text-white flex items-center gap-2">
                                        <Navigation className="w-4 h-4 text-green-400" />
                                        Flow Map
                                    </label>
                                </div>
                            </div>
                            {/* Feature Status */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 py-1 border border-blue-500/20">
                                <div className="text-white text-sm ">
                                    <div className="flex justify-between">
                                        <span>Markers:</span>
                                        <span className={showMarkers ? "text-green-400" : "text-red-400"}>
                                            {showMarkers ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Flow Map:</span>
                                        <span className={showFlows ? "text-green-400" : "text-red-400"}>
                                            {showFlows ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Population Legend */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 py-1 border border-blue-500/20">
                                <div className="text-white text-sm">
                                    <div className="font-semibold mb-2">Phân loại dân số:</div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(220, 38, 127, 0.9)' }}></div>
                                            <span className="text-xs">Mega (5M+)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(59, 130, 246, 0.9)' }}></div>
                                            <span className="text-xs">Large (1M+)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.9)' }}></div>
                                            <span className="text-xs">Medium (500K+)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(251, 146, 60, 0.9)' }}></div>
                                            <span className="text-xs">Small (100K+)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="chart-video-content rounded-xl">
                        <Tab9 />
                    </div>
                </div>
                <div className="col-span-3 space-y-6 p-3 z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 py-1 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-blue-400">54</div>
                                    <div className="text-xs text-gray-400">Thiết Bị Hoạt Động</div>
                                </div>
                                <Activity className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 py-1 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-cyan-400">377</div>
                                    <div className="text-xs text-gray-400">Kết Nối Tổng</div>
                                </div>
                                <Users className="w-8 h-8 text-cyan-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 py-1 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-green-400">2,634</div>
                                    <div className="text-xs text-gray-400">Khối Lượng Xử Lý</div>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 py-1 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-yellow-400">42</div>
                                    <div className="text-xs text-gray-400">Sự Cố Cảnh Báo</div>
                                </div>
                                <MapPin className="w-8 h-8 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <LabelTitleComponent title="Radar Chart" />
                        <ZoomableCirclePacking />
                    </div>
                    <div className="items-center">
                        <div className="flex items-center mb-6">
                            <LabelTitleComponent title="Radar Chart" />
                        </div>
                        <div className="flex items-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <Line type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tab3;