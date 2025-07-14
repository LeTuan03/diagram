import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TinhTest_v2 from "../tab5/geoData/TinhTest_v2.json";
import Phuongxa8TinhNamBo_WGS84_v2 from "../tab5/geoData/phuongxa8TinhNamBo_WGS84_v2.json";

import mapModule from "highcharts/modules/map.js";
mapModule(Highcharts);

const Tab7: React.FC = () => {

    const chartRef = useRef<any>(null);
    const [zoomRatio, setZoomRatio] = useState<number | null>(null);

    const seriesData = useMemo(() => {
        return zoomRatio && zoomRatio > 9
            ? ((Phuongxa8TinhNamBo_WGS84_v2 as any).features.map((feature, index) => ({
                Ten: feature.Ten,
                value: Math.floor(Math.random() * 100),
                properties: feature.properties,
            })))
            : ((TinhTest_v2 as any).features.map((feature, index) => ({
                Ten: feature.TenTinh,
                value: Math.floor(Math.random() * 100),
                properties: feature.properties,
            })));
    }, [zoomRatio]);

    useEffect(() => {
        const chart = chartRef.current?.chart;

        if (!chart) return;

        const updateZoomRatio = () => {
            // Kiểm tra mapView có tồn tại không
            if (chart.mapView) {
                // mapView.zoom là mức zoom hiện tại
                setZoomRatio(chart.mapView.zoom.toFixed(2));
                console.log("🔍 ZoomRatio:", chart.mapView.zoom.toFixed(2));
            }
        };

        updateZoomRatio();

        Highcharts.addEvent(chart, "redraw", updateZoomRatio);

        return () => {
            Highcharts.removeEvent(chart, "redraw", updateZoomRatio);
        };
    }, []);

    const options: Highcharts.Options = {
        chart: {
            map: TinhTest_v2 as any,
            backgroundColor: 'from-slate-900 via-slate-800 to-slate-900 ',
            height: 800,
            width: 800,
        },
        title: undefined,
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: false,
            buttonOptions: {
                verticalAlign: undefined,
            },
        },
        colorAxis: {
            min: 0,
            minColor: '#E8F5E8',
            maxColor: '#4CAF50',
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br/>Mã: {point.code}<br/>Giá trị: {point.value}'
        },
        series: [
            {
                type: "map",
                name: "Phường/Xã",
                data: (TinhTest_v2 as any).features.map((feature: any, index: number) => ({
                    TenTinh: feature.properties?.TenTinh,
                    code: index,
                    value: Math.floor(Math.random() * 100)
                })),
                joinBy: "TenTinh",
                states: {
                    hover: {
                        color: "#FFEB3B",
                        borderColor: '#FF9800',
                        borderWidth: 2
                    },
                    select: {
                        color: '#FF5722'
                    }
                },
                dataLabels: {
                    enabled: false, // Tắt để tránh quá tải text
                    format: "{point.name}",
                    style: {
                        fontSize: '10px',
                        fontWeight: 'normal'
                    }
                },
                borderColor: '#333',
                borderWidth: 0.5,
                allowPointSelect: true,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            console.log('Clicked on:', this.name);
                            // Thêm logic xử lý khi click vào khu vực
                        }
                    }
                }
            },
        ],
        plotOptions: {
            map: {
                allAreas: false,
            }
        },
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType="mapChart"
                options={options}
                containerProps={{ style: { width: '100%' } }}
                ref={chartRef}
            />
        </div>
    );
};

export default Tab7;
