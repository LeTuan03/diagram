import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TinhTest_v2 from "../tab5/geoData/TinhTest_v2.json";
import Phuongxa8TinhNamBo_WGS84_v2 from "../tab5/geoData/phuongxa8TinhNamBo_WGS84_v2.json";
import mapModule from "highcharts/modules/map.js";
import flowmapModule from "highcharts/modules/flowmap.js";
import { MapPin, Navigation } from "lucide-react";

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
    populationCategory: 'mega' | 'large' | 'medium' | 'small';
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

    // Dữ liệu marker mẫu cho Việt Nam với IDs
    const markerData: MarkerData[] = [
        { id: "hcm", lat: 10.8231, lon: 106.6297, name: "TP.HCM", value: 95, category: "major", population: 9000000, populationCategory: "large" },
        { id: "cantho", lat: 10.0452, lon: 105.7469, name: "Cần Thơ", value: 65, category: "medium", population: 9000000, populationCategory: "medium" },
        { id: "thuduc", lat: 10.9804, lon: 106.6750, name: "Thủ Đức", value: 45, category: "small", population: 9000000, populationCategory: "large" },
        { id: "quan1", lat: 10.7769, lon: 106.7009, name: "Quận 1", value: 50, category: "small", population: 9000000, populationCategory: "medium" },
        { id: "tanan", lat: 10.7546, lon: 106.4230, name: "Tân An", value: 35, category: "small", population: 9000000, populationCategory: "large" },
        { id: "vungtau", lat: 10.4113, lon: 107.1365, name: "Vũng Tàu", value: 55, category: "medium", population: 9000000, populationCategory: "small" },
        { id: "camau", lat: 9.1767, lon: 105.1524, name: "Cà Mau", value: 38, category: "small", population: 9000000, populationCategory: "large" },
    ];

    // Dữ liệu flow map với mũi tên
    const flowData: FlowData[] = [
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
            from: "thuduc",
            to: "quan1",
            weight: 25,
            name: "Thủ Đức → Quận 1",
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
    ];

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
    }, []);

    // Hàm cluster markers dựa trên khoảng cách
    const clusterMarkers = (markers: MarkerData[]) => {
        return markers.map(marker => ({
            markers: [marker],
            center: [marker.lon, marker.lat] as [number, number],
            totalValue: marker.value,
            id: marker.id
        }));
    };

    const useDetailedMap = zoomRatio !== null && zoomRatio > 9;
    const joinKey = useDetailedMap ? "Ten" : "TenTinh";
    const currentMap: any = useDetailedMap ? Phuongxa8TinhNamBo_WGS84_v2 : TinhTest_v2;

    const currentData = currentMap.features.map((feature: any, index: number) => ({
        [joinKey]: feature.properties?.[joinKey],
        code: index,
        // value: Math.floor(Math.random() * 100),
    }));

    const clusters = clusterMarkers(markerData);

    // Tạo dữ liệu cho marker series
    const markerSeriesData = clusters.map((cluster) => ({
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
            radius: Math.max(8, Math.min(25, cluster.totalValue / 4)),
            fillColor: cluster.markers.length > 1
                ? 'rgba(255, 107, 107, 0.8)'
                : cluster.markers[0].category === 'major'
                    ? 'rgba(70, 130, 180, 0.9)'
                    : cluster.markers[0].category === 'medium'
                        ? 'rgba(34, 139, 34, 0.8)'
                        : 'rgba(255, 165, 0, 0.8)',
            lineWidth: 2,
            lineColor: '#ffffff',
            states: {
                hover: {
                    fillColor: 'rgba(255, 215, 0, 0.9)',
                    lineWidth: 3
                }
            }
        }
    }));

    // Tạo dữ liệu cho flowmap series
    const flowSeriesData = flowData.map(flow => ({
        from: flow.from,
        to: flow.to,
        weight: flow.weight,
        name: flow.name,
        color: flow.color,
        fillColor: flow.fillColor,
        fillOpacity: flow.fillOpacity,
        markerEnd: flow.markerEnd
    }));

    const series: any[] = [
        // Bản đồ nền
        {
            type: "map",
            data: currentData,
            joinBy: joinKey,
            states: {
                hover: {
                    color: "#FFEB3B",
                    borderColor: "#FF9800",
                    borderWidth: 2,
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
                format: `{point.${joinKey}}`,
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
                        console.log("Clicked on:", this?.[joinKey] || "Unknown");
                    },
                },
            },
        }
    ];

    // Thêm marker series nếu được bật
    if (showMarkers) {
        series.push({
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
    }

    // Thêm flowmap series nếu được bật
    if (showFlows) {
        series.push({
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
            dataLabels: {
                enabled: false,
            },
            animation: {
                duration: 2000,
            },
            accessibility: {
                description: 'Biểu đồ luồng di chuyển với mũi tên chỉ hướng'
            }
        });
    }

    const options: Highcharts.Options = {
        chart: {
            map: currentMap as any,
            backgroundColor: 'transparent',
            height: 800,
        },
        title: undefined,
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: false,
            buttonOptions: {
                verticalAlign: "bottom",
            },
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            style: {
                color: '#ffffff'
            },
            borderRadius: 8,
            borderWidth: 0,
            shadow: true,
            pointFormat: `<b>{point.${joinKey}}</b><br/>Mã: {point.code}<br/>Giá trị: {point.value}`
        },
        legend: {
            enabled: true,
            align: 'right',
            verticalAlign: 'bottom',
            layout: 'vertical',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 5,
            padding: 10
        },
        series: series,
        plotOptions: {
            flowmap: {
                animation: {
                    duration: 2000,
                },
            },
            mappoint: {
                animation: {
                    duration: 1500,
                },
            },
        },
    };

    return (
        <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Control Panel */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                    </div>
                </div>

                {/* Map Container */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType="mapChart"
                        options={options}
                        containerProps={{
                            style: {
                                width: "100%",
                                borderRadius: "8px",
                                overflow: "hidden"
                            }
                        }}
                        ref={chartRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tab7;