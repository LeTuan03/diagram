import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TinhTest_v2 from "../tab5/geoData/TinhTest_v2.json";
import Phuongxa8TinhNamBo_WGS84_v2 from "../tab5/geoData/phuongxa8TinhNamBo_WGS84_v2.json";
import mapModule from "highcharts/modules/map.js";
import flowmapModule from "highcharts/modules/flowmap.js";
import { MapPin, Navigation, TrendingUp, Users, Activity } from 'lucide-react';
import ColumnsChart from "../tab8/Bieudocotdung";
import BarChart from "../tab8/BarChart";
import CircleChart from "../tab8/CircleChart";
import {
    Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import Tab9 from "../tab9/Tab9"
import ModernBarChart from "../tab8/charts/ModernBarChart";
import ModernLineChart from "../tab8/charts/ModernLineChart";
import Modern3DPolarChart from "../tab8/charts/Modern3DPolarChart";
import "./style.scss";
import ModernDoughnutChart from "../tab8/charts/ModernDoughnutChart";
import ModernAreaChart from "../tab8/charts/ModernAreaChart";
import ModernRadarChart from "../tab8/charts/ModernRadarChart";
import { LabelTitleComponent } from "../../LabelTitle";

mapModule(Highcharts);
flowmapModule(Highcharts);

interface MarkerData {
    lat: number;
    lon: number;
    name: string;
    value: number;
    category: string;
    id: string;
    population: number;
    populationCategory?: 'mega' | 'large' | 'medium' | 'small';
    economicType?: 'industrial' | 'commercial' | 'residential' | 'mixed';
}

interface FlowData {
    from: string;
    to: string;
    weight: number;
    name: string;
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    markerEnd?: {
        width: string | number;
        height: string | number;
    };
}

const Tab7: React.FC = () => {
    const chartRef = useRef<any>(null);
    const [zoomRatio, setZoomRatio] = useState<number | null>(null);
    const [showMarkers, setShowMarkers] = useState(true);
    const [showFlows, setShowFlows] = useState(true);


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


    const lineData = [
        { name: 'Tháng 1', value: 400 },
        { name: 'Tháng 2', value: 300 },
        { name: 'Tháng 3', value: 600 },
        { name: 'Tháng 4', value: 800 },
        { name: 'Tháng 5', value: 500 },
        { name: 'Tháng 6', value: 700 },
    ];
    // Các hàm không đổi, chuyển ra ngoài component hoặc dùng useCallback
    const formatPopulation = useCallback((population: number): string => {
        if (population >= 1000000) return `${(population / 1000000).toFixed(1)}M`;
        if (population >= 1000) return `${(population / 1000).toFixed(0)}K`;
        return population.toString();
    }, []);

    const getMarkerSize = useCallback((population: number): number => {
        if (population >= 500) return 35;
        if (population >= 100) return 28;
        if (population >= 50) return 22;
        if (population >= 10) return 18;
        return 14;
    }, []);

    const getMarkerColor = useCallback((populationCategory?: string): string => {
        switch (populationCategory) {
            case 'mega': return 'rgba(220, 38, 127, 0.9)';
            case 'large': return 'rgba(59, 130, 246, 0.9)';
            case 'medium': return 'rgba(34, 197, 94, 0.9)';
            case 'small': return 'rgba(251, 146, 60, 0.9)';
            default: return 'rgba(156, 163, 175, 0.9)';
        }
    }, []);

    // Memo hóa dữ liệu marker, population, cluster, flow, map...
    const markerData = useMemo(() => [
        { id: "hcm", lat: 10.8231, lon: 106.6297, name: "TP.HCM", value: 95, category: "major", population: 9000000, populationCategory: "mega", economicType: "mixed" },
        { id: "cantho", lat: 10.0452, lon: 105.7469, name: "Cần Thơ", value: 65, category: "medium", population: 1200000, populationCategory: "large", economicType: "mixed" },
        { id: "thuduc", lat: 10.9804, lon: 106.6750, name: "Thủ Đức", value: 45, category: "small", population: 1100000, populationCategory: "large", economicType: "mixed" },
        { id: "quan1", lat: 10.7769, lon: 106.7009, name: "Quận 1", value: 50, category: "small", population: 204000, populationCategory: "medium", economicType: "mixed" },
        { id: "tanan", lat: 10.7546, lon: 106.4230, name: "Tân An", value: 35, category: "small", population: 150000, populationCategory: "small", economicType: "mixed" },
        { id: "vungtau", lat: 10.4113, lon: 107.1365, name: "Vũng Tàu", value: 55, category: "medium", population: 432000, populationCategory: "medium", economicType: "mixed" },
        { id: "camau", lat: 9.1767, lon: 105.1524, name: "Cà Mau", value: 38, category: "small", population: 120000, populationCategory: "small", economicType: "mixed" },
        { id: "angiang", lat: 10.1961151100, lon: 105.0524, name: "An Giang", value: 38, category: "small", population: 1200, populationCategory: "small", economicType: "mixed" },
    ], []);

    const populationData = useMemo(() => [
        { id: "bienhoa", name: "Biên Hòa", lat: 10.9447, lon: 106.8243, value: 60, category: "medium", population: 120, populationCategory: "large", },
        { id: "longkhanh", name: "Long Khánh", lat: 10.9739, lon: 107.2446, value: 40, category: "small", population: 180, populationCategory: "small", },
        { id: "thuanan", name: "Thuận An", lat: 10.9500, lon: 106.7000, value: 55, category: "medium", population: 600, populationCategory: "medium", },
        { id: "diangan", name: "Dĩ An", lat: 10.9164, lon: 106.7692, value: 50, category: "medium", population: 500, populationCategory: "medium", },
        { id: "baria", name: "Bà Rịa", lat: 10.4950, lon: 107.1680, value: 35, category: "small", population: 150, populationCategory: "small", },
        { id: "tan_an", name: "Tân An", lat: 10.5359, lon: 106.4137, value: 30, category: "small", population: 150, populationCategory: "small", },
        { id: "mytho", name: "Mỹ Tho", lat: 10.3600, lon: 106.3655, value: 35, category: "small", population: 220, populationCategory: "medium", },
        { id: "bentre", name: "Bến Tre", lat: 10.2415, lon: 106.3759, value: 32, category: "small", population: 250, populationCategory: "medium", },
        { id: "travinh", name: "Trà Vinh", lat: 9.9347, lon: 106.3450, value: 28, category: "small", population: 160, populationCategory: "small", },
        { id: "vinhlong", name: "Vĩnh Long", lat: 10.2544, lon: 105.9645, value: 30, category: "small", population: 200, populationCategory: "small", },
        { id: "sa_dec", name: "Sa Đéc", lat: 10.2920, lon: 105.7567, value: 28, category: "small", population: 100, populationCategory: "small", },
        { id: "longxuyen", name: "Long Xuyên", lat: 10.3864, lon: 105.4352, value: 40, category: "medium", population: 400, populationCategory: "medium", },
        { id: "vinhchau", name: "Vĩnh Châu", lat: 9.2552, lon: 105.9642, value: 25, category: "small", population: 150, populationCategory: "small", },
        { id: "rachgia", name: "Rạch Giá", lat: 10.0125, lon: 105.0808, value: 38, category: "small", population: 21, populationCategory: "medium", },
    ], []);

    const flowData = useMemo(() => [
        // ...existing flowData...
        {
            from: "hcm",
            to: "cantho",
            weight: 55,
            name: "TP.HCM → Cần Thơ",
            color: "#036336ff",
            fillColor: "#96CEB4",
            fillOpacity: 1,
            markerEnd: { width: "55%", height: "55%" }
        },
        {
            from: "camau",
            to: "angiang",
            weight: 50,
            name: "Cà Mau -> An Giang",
            color: "#036336ff",
            fillColor: "#96CEB4",
            fillOpacity: 1,
            markerEnd: { width: "40%", height: "40%" }
        },
        {
            from: "hcm",
            to: "vungtau",
            weight: 40,
            name: "TP.HCM → Vũng Tàu",
            color: "#036336ff",
            fillColor: "#96CEB4",
            fillOpacity: 1,
            markerEnd: { width: "50%", height: "50%" }
        }
    ], []);

    // Memo hóa clusterMarkers
    const clusterMarkers = useCallback((markers: MarkerData[]) => {
        return markers.map(marker => ({
            markers: [marker],
            center: [marker.lon, marker.lat] as [number, number],
            totalValue: marker.value,
            id: marker.id
        }));
    }, []);

    // Memo hóa các biến phụ thuộc vào zoomRatio
    const useDetailedMap = useMemo(() => zoomRatio !== null && zoomRatio > 9, [zoomRatio]);
    const joinKey = useMemo(() => useDetailedMap ? "Ten" : "TenTinh", [useDetailedMap]);
    const currentMap: any = useMemo(() => useDetailedMap ? Phuongxa8TinhNamBo_WGS84_v2 : TinhTest_v2, [useDetailedMap]);

    // Memo hóa currentData
    const getColorByIndex = useCallback((index: number) => {
        const hue = (index * 137.508) % 360;
        return `hsl(${hue}, 65%, 60%)`;
    }, []);

    const currentData = useMemo(() => currentMap.features.map((feature: any, index: number) => {
        const uniqueId = `feature-${index}`;
        feature.properties.id = uniqueId;
        return {
            id: uniqueId,
            name: feature.properties?.[joinKey],
            code: index,
            value: index + 10,
            color: getColorByIndex(index),
        };
    }), [currentMap, joinKey, getColorByIndex]);
    console.log(2)
    // Memo hóa clusters
    const clusters = useMemo(() => clusterMarkers(markerData), [markerData, clusterMarkers]);
    const clustersPopulation = useMemo(() => clusterMarkers(populationData), [populationData, clusterMarkers]);

    // Memo hóa các series data
    const locationIconData = useMemo(() => clusters.map((cluster) => {
        const marker = cluster.markers[0];
        return {
            id: `location-${cluster.id}`,
            lat: cluster.center[1],
            lon: cluster.center[0],
            name: marker.name,
            population: marker.population,
            populationCategory: marker.populationCategory,
            economicType: marker.economicType,
            marker: {
                radius: 0,
                fillColor: 'transparent',
                lineWidth: 0
            }
        };
    }), [clusters]);

    const markerSeriesData = useMemo(() => clusters.map((cluster) => ({
        id: cluster.id,
        lat: cluster.center[1],
        lon: cluster.center[0],
        name: cluster.markers.length > 1
            ? `Cluster (${cluster.markers.length} điểm)`
            : cluster.markers[0].name,
        value: cluster.totalValue,
        count: cluster.markers.length,
        markers: cluster.markers,
        population: cluster.markers.length > 1
            ? cluster.markers.reduce((sum, m) => sum + m.population, 0)
            : cluster.markers[0].population,
        populationCategory: cluster.markers.length > 1
            ? 'mega'
            : cluster.markers[0].populationCategory,
        z: cluster.markers.length > 1 ? cluster.markers.length * 5 : cluster.markers[0].value / 2,
        marker: {
            radius: cluster.markers.length > 1
                ? Math.max(20, Math.min(40, cluster.markers.length * 8))
                : getMarkerSize(cluster.markers[0].population),
            fillColor: cluster.markers.length > 1
                ? 'rgba(255, 107, 107, 0.8)'
                : getMarkerColor(cluster?.markers[0]?.populationCategory),
            lineWidth: 2,
            lineColor: '#ffffff',
            symbol: 'circle',
            states: {
                hover: {
                    fillColor: 'rgba(255, 215, 0, 0.9)',
                    lineWidth: 3
                }
            }
        }
    })), [clusters, getMarkerColor, getMarkerSize]);

    const populationTextData = useMemo(() => clustersPopulation.map((cluster) => {
        const populationCategory = cluster.markers.length > 1
            ? 'mega'
            : cluster.markers[0].populationCategory;
        return {
            id: `${cluster.id}_text`,
            lat: cluster.center[1],
            lon: cluster.center[0],
            name: cluster.markers.length > 1
                ? cluster.markers.length.toString()
                : formatPopulation(cluster.markers[0].population),
            parentId: cluster.id,
            isCluster: cluster.markers.length > 1,
            population: cluster.markers.length > 1
                ? cluster.markers.reduce((sum, m) => sum + m.population, 0)
                : cluster.markers[0].population,
            marker: {
                enabled: true,
                radius: 14,
                fillColor: getMarkerColor(populationCategory),
                lineWidth: 2,
                lineColor: "#fff",
                symbol: "circle"
            }
        };
    }), [clustersPopulation, formatPopulation, getMarkerColor]);

    const flowSeriesData = useMemo(() => flowData.map(flow => ({
        from: flow.from,
        to: flow.to,
        weight: flow.weight,
        name: flow.name,
        color: flow.color,
        fillColor: flow.fillColor,
        fillOpacity: flow.fillOpacity,
        markerEnd: flow.markerEnd
    })), [flowData]);

    // Memo hóa series
    const series = useMemo(() => {
        const s: any[] = [
            {
                type: "map",
                data: currentData,
                joinBy: ["id", "id"],
                states: {
                    hover: {
                        brightness: 0.2,
                        borderWidth: 2,
                        borderColor: '#000'
                    },
                    select: {
                        color: "#FF5722",
                    },
                    inactive: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: `{point.name}`,
                    style: {
                        fontSize: "10px",
                        fontWeight: "normal",
                    },
                },
                borderColor: "#333",
                borderWidth: 0.5,
                allowPointSelect: true,
                cursor: "pointer",
                showInLegend: false,
                point: {
                    events: {
                        click: function (this: any) {
                            // ...existing code...
                        },
                    },
                },
            }
        ];
        if (showMarkers) {
            s.push({
                type: "mappoint",
                id: "cities",
                name: "Điểm đánh dấu",
                data: markerSeriesData,
                dataLabels: {
                    enabled: true,
                    format: `<div style="
                    position: relative;
                    display: inline-block;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: bold;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">
                        <div style="margin-bottom: 2px;">{point.name}</div>
                        <div style="
                            content: '';
                            position: absolute;
                            bottom: -6px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 6px solid rgba(0,0,0,0.8);
                        "></div>
                    </div>
                `,
                    style: {
                        fontSize: '11px'
                    },
                    useHTML: true,
                    allowOverlap: false,
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    shadow: false,
                    y: -20
                },
                tooltip: {
                    headerFormat: undefined,
                    pointFormat: '<b>{point.name}</b><br/>' +
                        'Dân số: {point.population:,.0f} người<br/>' +
                        'Tổng giá trị: {point.value}<br/>' +
                        'Số điểm: {point.count}<br/>' +
                        'Loại: {point.populationCategory}',
                },
                point: {
                    events: {
                        click: function (this: any) {
                            console.log("Clicked marker:", this.name, "Markers:", this.markers);
                        },
                    },
                },
            });
            s.push({
                type: "mappoint",
                id: "population-text",
                name: "Dân số",
                data: populationTextData,
                enableMouseTracking: false,
                marker: {
                    enabled: false,
                    radius: 0,
                    fillColor: 'transparent',
                    lineWidth: 0
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textOutline: '1px contrast',
                        textShadow: '0 0 3px rgba(0,0,0,0.8)'
                    },
                    useHTML: false,
                    allowOverlap: true,
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    shadow: false,
                    y: 0,
                    verticalAlign: 'middle',
                    align: 'center'
                },
                showInLegend: false,
                zIndex: 10
            });
            s.push({
                type: "mappoint",
                id: "location-icons",
                name: "Biểu tượng địa điểm",
                data: locationIconData,
                dataLabels: {
                    enabled: true,
                    format: '<div style="font-size: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));">' +
                        '<span style="color: #FF6B6B;">📍</span>' +
                        '</div>',
                    useHTML: true,
                    allowOverlap: true,
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    shadow: false,
                    y: 0 // Đặt icon location phía trên
                },
                tooltip: {
                    pointFormat: '<b>{point.name}</b><br/>' +
                        'Dân số: {point.population:,.0f} người<br/>' +
                        'Quy mô: {point.populationCategory}<br/>' +
                        'Loại kinh tế: {point.economicType}',
                },
                showInLegend: false,
                enableMouseTracking: true,
                point: {
                    events: {
                        click: function (this: any) {
                            console.log("Clicked location icon:", this.name);
                        },
                    },
                },
            });
        }
        if (showFlows) {
            s.push({
                type: "flowmap",
                name: "Luồng di chuyển",
                linkedTo: ":previous",
                data: flowSeriesData,
                minWidth: 3,
                maxWidth: 20,
                growTowards: true,
                opacity: 0.8,
                tooltip: {
                    pointFormat: '<b>{point.name}</b><br/>Cường độ: {point.weight:.1f}',
                },
                dataLabels: { enabled: false },
                animation: { duration: 2000 },
                accessibility: {
                    description: 'Biểu đồ luồng di chuyển với mũi tên chỉ hướng'
                }
            });
        }
        return s;
    }, [currentData, showMarkers, markerSeriesData, populationTextData, locationIconData, showFlows, flowSeriesData]);

    // Memo hóa options
    const options = useMemo<Highcharts.Options>(() => ({
        chart: {
            map: currentMap as any,
            backgroundColor: 'transparent',
            height: 700,
        },
        title: undefined,
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: false,
            enableButtons: false,
            buttonOptions: {
                verticalAlign: "bottom",
            },
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            style: { color: '#ffffff' },
            borderRadius: 8,
            borderWidth: 0,
            shadow: true,
            headerFormat: undefined,
            pointFormat: `<b>{point.name}</b><br/>Mã: {point.code}<br/>Giá trị: {point.value}`
        },
        series: series,
        plotOptions: {
            map: {
                states: {
                    hover: {
                        brightness: 0.1,
                        borderColor: '#000',
                        borderWidth: 2
                    }
                }
            },
            flowmap: {},
            mappoint: {
                animation: { duration: 1500 },
            },
        },
    }), [currentMap, series]);

    // useEffect chỉ chạy khi chartRef thay đổi
    useEffect(() => {
        const chart = chartRef.current?.chart;
        if (!chart) return;

        const updateZoomRatio = () => {
            if (chart.mapView && chart.mapView.zoom != null) {
                const ratio = parseFloat(chart.mapView.zoom.toFixed(2));
                setZoomRatio(ratio);
            }
        };

        updateZoomRatio();
        Highcharts.addEvent(chart, "redraw", updateZoomRatio);
        return () => {
            Highcharts.removeEvent(chart, "redraw", updateZoomRatio);
        };
    }, [chartRef]);

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
                        <BarChart />
                    </div>
                    <div className="">
                        <LabelTitleComponent title="Radar Chart" />
                        <ColumnsChart />
                    </div>

                    <div className="">
                        <LabelTitleComponent title="Radar Chart" />
                        <CircleChart />
                    </div>

                </div>
                <div className="col-span-6 p-5">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Toggle Controls */}
                            <div className="space-y-4">
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

                            {/* Zoom Info */}
                            <div className="bg-black/20 rounded-lg p-4">
                                <div className="text-white text-sm">
                                    <div className="flex justify-between mb-2">
                                        <span>Zoom Level:</span>
                                        <span className="font-mono text-blue-400">
                                            {zoomRatio?.toFixed(2) || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Map Type:</span>
                                        <span className="text-green-400">
                                            {useDetailedMap ? 'Chi tiết' : 'Tổng quan'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Clusters:</span>
                                        <span className="text-yellow-400">{clusters.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Status */}
                            <div className="bg-black/20 rounded-lg p-4">
                                <div className="text-white text-sm space-y-2">
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
                            <div className="bg-black/20 rounded-lg p-4">
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
                        {/* <HighchartsReact
                            highcharts={Highcharts}
                            constructorType="mapChart"
                            options={options}
                            containerProps={{
                                style: {
                                    width: "100%",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    // height:700
                                }
                            }}
                            ref={chartRef}
                        /> */}
                    </div>
                </div>
                <div className="col-span-3 space-y-6 p-5 z-10">
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
                    <div className="space-y-4">
                        <LabelTitleComponent title="Radar Chart" />
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={regionData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis />
                                <Radar name="A" dataKey="A" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="items-center">
                        <div className="flex items-center mb-6">
                            <LabelTitleComponent title="Radar Chart" />
                        </div>
                        <div className="flex items-center">
                            <ResponsiveContainer width="100%" height={250}>
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
            {/* <div className="absolute inset-0 h-full w-full flex items-center justify-center">
                            <HighchartsReact
                                highcharts={Highcharts}
                                constructorType="mapChart"
                                options={options}
                                containerProps={{
                                    style: {
                                        width: "75%",
                                        borderRadius: "8px",
                                        // height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        // paddingTop: "100px",
                                        // overflow: "hidden"
                                    }
                                }}
                                ref={chartRef}
                            />
                        </div> */}
        </div>
    );
};

export default Tab7;