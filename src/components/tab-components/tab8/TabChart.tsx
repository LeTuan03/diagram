import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import testphuongxa8TinhNamBo_WGS84 from "../tab5/geoData/testphuongxa8TinhNamBo_WGS84.json";
import phuongxa8TinhNamBo_WGS84 from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import TinhTest_v2 from "../tab5/geoData/TinhTest_v2.json";

import TinhNamBo_WGS84_RanhTinh_v2 from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";
// import TinhNamBov2 from "../tab5/geoData/";
import mapModule from "highcharts/modules/map.js"; // <-- default import
mapModule(Highcharts);

const MapChart: React.FC = () => {
    // useEffect(() => {
    //     // Đảm bảo module map được khởi tạo
    //     if (typeof Highcharts.mapChart === 'undefined') {
    //         HC_map(Highcharts);
    //     }
    // }, []);

    const options: Highcharts.Options = {
        chart: {
            map: phuongxa8TinhNamBo_WGS84 as any,
            backgroundColor: 'from-slate-900 via-slate-800 to-slate-900 ',
            // className:"from-slate-900 via-slate-800 to-slate-900",
            height: 800,
            width: 800,
        },
        title: undefined,
        // subtitle: {
        //     text: 'Hiển thị từ dữ liệu GeoJSON',
        //     style: {
        //         color: '#666'
        //     }
        // },
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
                // mapData: TinhTest_v2 as any, //
                data: (phuongxa8TinhNamBo_WGS84 as any).features.map((feature: any, index: number) => ({
                    Ten: feature.properties?.Ten || `Vùng ${index + 1}`,
                    name: feature.properties?.Ten || `Vùng ${index + 1}`,
                    code: index,
                    value: Math.floor(Math.random() * 100)
                })),
                joinBy: "Ten",
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
        // plotOptions: {
        //     map: {
        //         allAreas: true,
        //         // animation: {
        //         //     duration: 1000
        //         // }
        //     }
        // },
        // legend: {
        //     enabled: true,
        //     title: {
        //         text: 'Giá trị'
        //     }
        // }
    };

    return (
        <div>
            {/* <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Bản đồ 8 tỉnh Nam Bộ
                </h2>
                <p className="text-gray-600">
                    Hiển thị dữ liệu phường/xã từ file GeoJSON
                </p>
            </div> */}

            <HighchartsReact
                highcharts={Highcharts}
                constructorType="mapChart"
                options={options}
                containerProps={{ style: { width: '100%', height: "700px" } }}
            />

            {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Hướng dẫn sử dụng:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hover chuột để xem thông tin chi tiết</li>
                    <li>• Click để chọn khu vực</li>
                    <li>• Sử dụng nút zoom để phóng to/thu nhỏ</li>
                    <li>• Kéo thả để di chuyển bản đồ</li>
                </ul> */}
        </div>
    );
};

export default MapChart;