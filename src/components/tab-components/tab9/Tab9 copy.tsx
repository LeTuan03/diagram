import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import phuongXaGeojson from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";


const VietnamProvinceMap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [geoData, setGeoData] = useState<any>(phuongXaGeojson);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number, y: number, content: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {
        if (!svgRef.current || !geoData) return;

        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 600;

        // Clear previous content
        svg.selectAll("*").remove();

        // Calculate bounds
        const bounds = d3.geoBounds(geoData);
        const scale = Math.min(
            width / Math.abs(bounds[1][0] - bounds[0][0]),
            height / Math.abs(bounds[1][1] - bounds[0][1])
        ) * 0.8;

        // Create projection centered on the data
        const projection = d3.geoMercator()
            .scale(scale * 80)
            .center([
                (bounds[0][0] + bounds[1][0]) / 2,
                (bounds[0][1] + bounds[1][1]) / 2
            ])
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                svg.selectAll('path')
                    .attr('transform', event.transform);
                svg.selectAll('text')
                    .attr('transform', event.transform);
            });

        svg.call(zoom);

        // Color scale based on population
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, geoData.features.length]);

        // Draw provinces
        svg.selectAll('path')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('d', path as any)
            .attr('fill', (d: any, i: number) =>
                selectedProvince === d.properties.name ? '#ff6b6b' : colorScale(i)
            )
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('mouseover', function (event, d: any) {
                d3.select(this).attr('stroke-width', 2);
                setTooltip({
                    x: event.pageX,
                    y: event.pageY,
                    content: `${d.properties.name || d.properties.NAME || 'Unknown'}`
                });
            })
            .on('mouseout', function (event, d: any) {
                d3.select(this).attr('stroke-width', 1);
                setTooltip(null);
            })
            .on('click', (event, d: any) => {
                setSelectedProvince(d.properties.name || d.properties.NAME || 'Unknown');
            });

        // Add province labels
        svg.selectAll('.province-label')
            .data(geoData.features)
            .enter()
            .append('text')
            .attr('class', 'province-label')
            .attr('x', (d: any) => path.centroid(d)[0])
            .attr('y', (d: any) => path.centroid(d)[1])
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .attr('stroke', '#fff')
            .attr('stroke-width', 0.5)
            .text((d: any) => d.properties.name || d.properties.NAME || 'N/A')
            .style('pointer-events', 'none');

    }, [geoData, selectedProvince]);

    const getSelectedProvinceInfo = () => {
        if (!selectedProvince || !geoData) return null;
        return geoData.features.find((f: any) =>
            (f.properties.name || f.properties.NAME) === selectedProvince
        );
    };

    const selectedInfo = getSelectedProvinceInfo();

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-100 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bản đồ khu vực Việt Nam</h1>
                {/* <p className="text-gray-600">Tải file GeoJSON hoặc sử dụng dữ liệu mẫu</p> */}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">

                    {geoData && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">
                                Số tỉnh: {geoData.features.length}
                            </span>
                        </div>
                    )}
                </div>

                {geoData ? (
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="600"
                        viewBox="0 0 800 600"
                        className="border rounded bg-blue-50"
                    />
                ) : (
                    <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
                        <div className="text-center">
                            <p className="text-gray-500 mb-4">Chưa có dữ liệu bản đồ</p>
                            <p className="text-sm text-gray-400">
                                Vui lòng tải file GeoJSON hoặc sử dụng dữ liệu mẫu
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {selectedInfo && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {selectedInfo.properties.name || selectedInfo.properties.NAME}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedInfo.properties.population && (
                            <div>
                                <span className="font-semibold text-gray-700">Dân số: </span>
                                <span className="text-gray-600">{selectedInfo.properties.population}</span>
                            </div>
                        )}
                        {selectedInfo.properties.area && (
                            <div>
                                <span className="font-semibold text-gray-700">Diện tích: </span>
                                <span className="text-gray-600">{selectedInfo.properties.area}</span>
                            </div>
                        )}
                        {selectedInfo.properties.name_en && (
                            <div>
                                <span className="font-semibold text-gray-700">Tên tiếng Anh: </span>
                                <span className="text-gray-600">{selectedInfo.properties.name_en}</span>
                            </div>
                        )}
                        <div>
                            <span className="font-semibold text-gray-700">Tọa độ trung tâm: </span>
                            <span className="text-gray-600">
                                {d3.geoCentroid(selectedInfo).map(coord => coord.toFixed(3)).join(', ')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {tooltip && (
                <div
                    className="fixed bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-sm pointer-events-none z-50"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y - 10,
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default VietnamProvinceMap;