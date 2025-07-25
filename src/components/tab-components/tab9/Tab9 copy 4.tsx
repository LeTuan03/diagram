import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import phuongXaGeojson from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";
import tinh3Geojson from "../tab5/geoData/Tinh3.json";
import tinh6Geojson from "../tab5/geoData/Tinh6.json";
import ChartOverlay from './ChartOverlay';


const VietnamProvinceMap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [currentZoom, setCurrentZoom] = useState(1);

    const displayGeoJSON: any = useMemo(() => (currentZoom > 1.3 ? phuongXaGeojson : tinhGeojson), [currentZoom > 1.3]);
    const displayGeoTinhJSON: any = useMemo(() => (tinhGeojson), [currentZoom > 1.3]);
    const display3GeoTinhJSON: any = useMemo(() => (tinh3Geojson), [currentZoom > 1.3]);
    const display6GeoTinhJSON: any = useMemo(() => (tinh6Geojson), [currentZoom > 1.3]);

    const [chartOverlay, setChartOverlay] = useState<{
        x: number;
        y: number;
        data: any[];
        type: 'bar' | 'pie' | 'sparkline';
        title: string;
    } | null>(null);

    // --- Dữ liệu mẫu cho bubble ---

    const bubbleDataLocation = [
        { name: "Vị trí 1", value: 25, coordinates: [106.5, 10.5] },
        { name: "Vị trí 2", value: 18, coordinates: [105.8, 10.8] },
        { name: "Vị trí 3", value: 42, coordinates: [107.2, 11.1] },
        { name: "Vị trí 4", value: 33, coordinates: [106.0, 9.8] },
        { name: "Vị trí 5", value: 67, coordinates: [105.5, 10.2] }
    ];

    const flows = [
        { from: "Thành phố Hồ Chí Minh", to: "Tỉnh Đồng Nai", value: 50 },
        { from: "Tỉnh An Giang", to: "Tỉnh Cà Mau", value: 30 },
        { from: "Tỉnh Đồng Tháp", to: "Tỉnh Vĩnh Long", value: 40 },
    ];

    useEffect(() => {
        if (!svgRef.current || !displayGeoJSON) return;

        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 650;
        // Clear previous content
        svg.selectAll("*").remove();

        // Định nghĩa arrowhead marker
        const defs = svg.append("defs");

        const arrowMarker = defs.append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -6 12 12")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .attr("markerUnits", "strokeWidth");

        arrowMarker.append("path")
            .attr("d", "M0,-2L0,2L12,0Z")
            .attr("fill", "blue")
            .attr("stroke", "blue");

        // Calculate bounds
        const bounds = d3.geoBounds(displayGeoJSON);
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
                const newZoom = event.transform.k;
                setCurrentZoom(newZoom);

                // Tạo một group container cho tất cả các phần tử cần zoom
                const zoomContainer = svg.select('.zoom-container');
                if (!zoomContainer.empty()) {
                    zoomContainer.attr('transform', event.transform);
                }
            });
        svg.call(zoom);

        // Tạo zoom container cho tất cả các phần tử cần zoom
        const zoomContainer = svg.append("g").attr("class", "zoom-container");

        // Color scale based on population
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, displayGeoJSON.features.length]);

        // Draw provinces
        zoomContainer.selectAll('path')
            .data(displayGeoJSON.features)
            .enter()
            .append('path')
            .attr('d', path as any)
            .attr('fill', (_: any, i: number) => colorScale(i))
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('mouseover', function (event, d: any) {
                d3.select(this).attr('stroke-width', 2);

                setChartOverlay({
                    x: event.pageX - 900,
                    y: event.pageY - 500,
                    data: d.chartData,
                    type: d.chartType,
                    title: `${d.properties.Ten || d.properties.TenTinh || 'Unknown'}`
                });
            })
            .on('mouseout', function () {
                d3.select(this).attr('stroke-width', 1);
                setChartOverlay(null);
            })
            .on('click', (event, d: any) => {
                // Handle click event
                console.log(d.properties.Ten || d.properties.TenTinh || 'Unknown');
            });

        // Draw bubbles (dùng dữ liệu mẫu bubbleData)
        zoomContainer.selectAll(".bubble")
            .data(display6GeoTinhJSON.features)
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", (d: any) => {
                const coords = projection(d3.geoCentroid(d));
                return coords ? coords[0] : 0;
            })
            .attr("cy", (d: any) => {
                const coords = projection(d3.geoCentroid(d));
                return coords ? coords[1] : 0;
            })
            .attr("r", 20)
            .attr("fill", "pink")
            .attr("opacity", 0.8)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)

        // thêm location

        const iconGroup = zoomContainer.selectAll(".icon-group")
            .data(display3GeoTinhJSON.features)
            .enter()
            .append("g")
            .attr("class", "icon-group")
            .attr("transform", (d: any) => {
                const coords = projection(d3.geoCentroid(d));
                return coords ? `translate(${coords[0]}, ${coords[1]})` : "";
            });


        iconGroup.each(function () {
            const group = d3.select(this);

            // 📍 Icon Text
            const icon = group
                .append("text")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "25px")
                .attr("fill", "red")
                .text("📍");

            // 🌊 Aura (Lan tỏa vòng tròn)
            const aura = group
                .append("circle")
                .attr("r", 0)
                .attr("fill", "red")
                .attr("opacity", 0.4);

            function pulse() {
                aura
                    .attr("r", 0)
                    .attr("opacity", 0.4)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeCubicOut)
                    .attr("r", 30)
                    .attr("opacity", 0)
                    .on("end", pulse);
            }
            // 👉 Áp dụng hiệu ứng nảy
            function bounce() {
                icon
                    .attr("transform", "translate(0, 0)")
                    .transition()
                    .duration(600)
                    .ease(d3.easeQuadOut)
                    .attr("transform", "translate(0, -10)")
                    .transition()
                    .duration(600)
                    .ease(d3.easeBounceOut)
                    .attr("transform", "translate(0, 0)")
                    .on("end", bounce);
            }

            pulse();
            bounce();
        });



        // Thêm text
        zoomContainer.selectAll(".bubble-label-sales")
            .data(displayGeoTinhJSON.features)
            .enter()
            .append("text")
            .attr("class", "bubble-label")
            .attr("x", (d: any) => {
                const coords = projection(d3.geoCentroid(d));
                return coords ? coords[0] : 0;
            })
            .attr("y", (d: any) => {
                const coords = projection(d3.geoCentroid(d));
                return coords ? coords[1] + 4 : 0; // +4 để căn giữa theo chiều dọc
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("pointer-events", "none")
            .text((_: any) => (_.properties.TenTinh));

        // Thêm bubbleDataLocation - hình tròn với số ở bên trong


        zoomContainer.selectAll(".bubble-location")
            .data(bubbleDataLocation)
            .enter()
            .append("circle")
            .attr("class", "bubble-location")
            .attr("cx", (d: any) => {
                const coords = projection(d.coordinates);
                return coords ? coords[0] : 0;
            })
            .attr("cy", (d: any) => {
                const coords = projection(d.coordinates);
                return coords ? coords[1] : 0;
            })
            .attr("r", 10)
            .attr("fill", "#4CAF50")
            .attr("opacity", 0.8)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)

        // Thêm số ở bên trong hình tròn location
        zoomContainer.selectAll(".bubble-location-label")
            .data(bubbleDataLocation)
            .enter()
            .append("text")
            .attr("class", "bubble-location-label")
            .attr("x", (d: any) => {
                const coords = projection(d.coordinates);
                return coords ? coords[0] : 0;
            })
            .attr("y", (d: any) => {
                const coords = projection(d.coordinates);
                return coords ? coords[1] + 3 : 0; // +3 để căn giữa theo chiều dọc
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("pointer-events", "none")
            .text((d: any) => d.value);

        //flow
        const provinceCentroids = new Map<string, [number, number]>();

        displayGeoJSON.features.forEach((feature: any) => {
            const name = feature.properties.Ten || feature.properties.TenTinh;
            const coords = projection(d3.geoCentroid(feature));
            if (coords) {
                provinceCentroids.set(name, coords);
            }
        });

        //flow với mũi tên
        zoomContainer.selectAll(".flow-line")
            .data(flows)
            .enter()
            .append("path")
            .attr("class", "flow-line")
            .attr("d", (d: any) => {
                const from = provinceCentroids.get(d.from);
                const to = provinceCentroids.get(d.to);
                if (!from || !to) return "";

                // Bézier curve (có thể thay bằng đường thẳng nếu muốn)
                const midX = (from[0] + to[0]) / 2;
                const midY = (from[1] + to[1]) / 2 - 10; // cong lên một chút

                return `M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`;
            })
            .attr("stroke", "blue")
            .attr("stroke-width", (d: any) => Math.max(1, d.value / 10))
            .attr("fill", "none")
            .attr("opacity", 0.6)
            .attr("marker-end", "url(#arrowhead)"); // Thêm mũi tên ở cuối đường

        // Draw labels
        zoomContainer.selectAll('.province-label')
            .data(displayGeoJSON.features)
            .enter()
            .append('text')
            .attr('class', 'province-label')
            .attr('x', (d: any) => path.centroid(d)[0])
            .attr('y', (d: any) => path.centroid(d)[1])
            .attr('text-anchor', 'middle')
            .attr('font-size', '6px')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr("stroke-width", (d: any) => Math.max(1, d.value / 10))
            .style('pointer-events', 'none');

    }, [displayGeoJSON]);

    return (
        <div className="">
            <div className="">
                {displayGeoJSON ? (
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="700"
                        viewBox="0 0 800 600"
                        className=" rounded  transparent"
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

            {chartOverlay && (
                <ChartOverlay
                    x={chartOverlay.x}
                    y={chartOverlay.y}
                    title={chartOverlay.title}
                />
            )}
        </div>
    );
};

export default VietnamProvinceMap;