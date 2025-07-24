import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import phuongXaGeojson from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";
import tinh3Geojson from "../tab5/geoData/Tinh3.json";
import tinh6Geojson from "../tab5/geoData/Tinh6.json";
import ChartOverlay from './ChartOverlay';

const VietnamProvinceMap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [chartOverlay, setChartOverlay] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    const displayGeoJSON = useMemo(() => (currentZoom > 1.3 ? phuongXaGeojson : tinhGeojson), [currentZoom]);
    const displayGeoTinhJSON = useMemo(() => tinhGeojson, []);
    const display3GeoTinhJSON = useMemo(() => tinh3Geojson, []);
    const display6GeoTinhJSON = useMemo(() => tinh6Geojson, []);

    const bubbleDataLocation = [
        { name: "Vị trí 1", value: 25, coordinates: [106.5, 10.5] },
        { name: "Vị trí 2", value: 18, coordinates: [105.8, 10.8] },
        { name: "Vị trí 3", value: 42, coordinates: [107.2, 11.1] },
        { name: "Vị trí 4", value: 33, coordinates: [106.0, 9.8] },
        { name: "Vị trí 5", value: 67, coordinates: [105.5, 10.2] },
    ];

    const flows = [
        { from: "Thành phố Hồ Chí Minh", to: "Tỉnh Đồng Nai", value: 50 },
        { from: "Tỉnh An Giang", to: "Tỉnh Cà Mau", value: 30 },
        { from: "Tỉnh Đồng Tháp", to: "Tỉnh Vĩnh Long", value: 40 },
    ];

    useEffect(() => {
        if (!svgRef.current || !displayGeoJSON) return;

        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);

        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 650;
        svg.selectAll("*").remove();

        // Modern gradient definitions
        const defs = svg.append("defs");

        // Glassmorphism filter
        const filter = defs.append("filter")
            .attr("id", "glassmorphism")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        filter.append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", "1");

        filter.append("feOffset")
            .attr("dx", "0")
            .attr("dy", "2")
            .attr("result", "offset");

        // Modern gradient backgrounds
        const gradient = defs.append("radialGradient")
            .attr("id", "modernGradient")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "80%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#667eea")
            .attr("stop-opacity", 0.8);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#764ba2")
            .attr("stop-opacity", 0.4);

        // Neon glow gradient
        const neonGradient = defs.append("linearGradient")
            .attr("id", "neonGlow")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");

        neonGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#00f5ff");

        neonGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ff006e");

        // Modern arrow marker
        defs.append("marker")
            .attr("id", "modernArrow")
            .attr("viewBox", "0 -6 12 12")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .attr("markerUnits", "strokeWidth")
            .append("path")
            .attr("d", "M0,-3L0,3L9,0Z")
            .attr("fill", "url(#neonGlow)")
            .attr("stroke", "none")
            .style("filter", "drop-shadow(0px 0px 6px rgba(0, 245, 255, 0.8))");

        // Background with modern pattern
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "url(#modernGradient)")
            .style("opacity", 0.1);

        const bounds = d3.geoBounds(displayGeoJSON);
        const scale = Math.min(
            width / Math.abs(bounds[1][0] - bounds[0][0]),
            height / Math.abs(bounds[1][1] - bounds[0][1])
        ) * 0.8;

        const projection = d3.geoMercator()
            .scale(scale * 80)
            .center([
                (bounds[0][0] + bounds[1][0]) / 2,
                (bounds[0][1] + bounds[1][1]) / 2,
            ])
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                setCurrentZoom(event.transform.k);
                svg.select('.zoom-container').attr('transform', event.transform);
            });
        svg.call(zoom);

        const zoomContainer = svg.append("g").attr("class", "zoom-container");

        // Modern color scheme with depth and vibrancy
        const modernColorScale = d3.scaleSequential()
            .domain([0, displayGeoJSON.features.length])
            .interpolator(t => {
                const colors = [
                    '#667eea', '#764ba2', '#f093fb', '#f5576c',
                    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
                ];
                return colors[Math.floor(t * (colors.length - 1))];
            });

        // Map regions with modern styling
        zoomContainer.selectAll('path')
            .data(displayGeoJSON.features)
            .enter()
            .append('path')
            .attr('d', path as any)
            .attr('fill', (_: any, i: number) => modernColorScale(i))
            .attr('stroke', 'rgba(255, 255, 255, 0.3)')
            .attr('stroke-width', 0.8)
            .style('cursor', 'pointer')
            .style('filter', 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))')
            .style('transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
            .on('mouseover', function (event, d: any) {
                const regionName = d.properties.Ten || d.properties.TenTinh || 'Unknown';
                setActiveRegion(regionName);

                d3.select(this)
                    .style('filter', 'drop-shadow(0px 8px 25px rgba(102, 126, 234, 0.4))')
                    .style('transform', 'scale(1.02)')
                    .attr('stroke', '#667eea')
                    .attr('stroke-width', 2);

                setChartOverlay({
                    x: event.pageX - 900,
                    y: event.pageY - 500,
                    data: d.chartData,
                    type: d.chartType,
                    title: regionName
                });
            })
            .on('mouseout', function () {
                setActiveRegion(null);

                d3.select(this)
                    .style('filter', 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))')
                    .style('transform', 'scale(1)')
                    .attr('stroke', 'rgba(255, 255, 255, 0.3)')
                    .attr('stroke-width', 0.8);

                setChartOverlay(null);
            });

        // Modern bubble design with glassmorphism
        zoomContainer.selectAll(".modern-bubble")
            .data(display6GeoTinhJSON.features)
            .enter()
            .append("circle")
            .attr("class", "modern-bubble")
            .attr("cx", d => projection(d3.geoCentroid(d))[0])
            .attr("cy", d => projection(d3.geoCentroid(d))[1])
            .attr("r", 0)
            .attr("fill", "rgba(255, 255, 255, 0.2)")
            .attr("stroke", "rgba(255, 255, 255, 0.6)")
            .attr("stroke-width", 2)
            .style("backdrop-filter", "blur(10px)")
            .style("filter", "drop-shadow(0px 4px 15px rgba(255, 192, 203, 0.3))")
            .style("cursor", "pointer")
            .transition()
            .duration(800)
            .delay((_, i) => i * 100)
            .attr("r", 25)
            .on("end", function () {
                d3.select(this)
                    .on("mouseover", function (event, d: any) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 30)
                            .style("filter", "drop-shadow(0px 8px 25px rgba(255, 192, 203, 0.6))");

                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 25)
                            .style("filter", "drop-shadow(0px 4px 15px rgba(255, 192, 203, 0.3))");

                    });
            });

        // Animated location markers with modern design
        const iconGroup = zoomContainer.selectAll(".modern-icon-group")
            .data(display3GeoTinhJSON.features)
            .enter()
            .append("g")
            .attr("class", "modern-icon-group")
            .attr("transform", d => {
                const coords = projection(d3.geoCentroid(d));
                return coords ? `translate(${coords[0]}, ${coords[1]})` : "";
            })
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .delay((_, i) => i * 150)
            .style("opacity", 1);

        iconGroup.each(function () {
            const group = d3.select(this);

            // Modern pin design
            const pin = group.append("g");

            pin.append("circle")
                .attr("r", 15)
                .attr("fill", "url(#neonGlow)")
                .style("filter", "drop-shadow(0px 4px 12px rgba(0, 245, 255, 0.4))");

            pin.append("text")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "16px")
                .attr("fill", "white")
                .attr("font-weight", "bold")
                .text("📍");

            // Pulsing aura effect
            const aura = group.append("circle")
                .attr("r", 0)
                .attr("fill", "none")
                .attr("stroke", "#00f5ff")
                .attr("stroke-width", 2)
                .attr("opacity", 0.8);

            function modernPulse() {
                aura.attr("r", 0).attr("opacity", 0.8)
                    .transition()
                    .duration(2000)
                    .ease(d3.easeCubicOut)
                    .attr("r", 40)
                    .attr("opacity", 0)
                    .on("end", modernPulse);
            }

            function floatAnimation() {
                pin.transition()
                    .duration(1500)
                    .ease(d3.easeQuadInOut)
                    .attr("transform", "translate(0, -8)")
                    .transition()
                    .duration(1500)
                    .ease(d3.easeQuadInOut)
                    .attr("transform", "translate(0, 0)")
                    .on("end", floatAnimation);
            }

            modernPulse();
            floatAnimation();
        });

        // Modern province labels with better typography
        zoomContainer.selectAll(".modern-label")
            .data(displayGeoTinhJSON.features)
            .enter()
            .append("text")
            .attr("class", "modern-label")
            .attr("x", d => projection(d3.geoCentroid(d))[0])
            .attr("y", d => projection(d3.geoCentroid(d))[1] + 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("font-weight", "600")
            .attr("fill", "rgba(255, 255, 255, 0.9)")
            .attr("pointer-events", "none")
            .style("text-shadow", "2px 2px 4px rgba(0, 0, 0, 0.8)")
            .style("font-family", "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif")
            .text(d => d.properties.TenTinh);

        // Modern location bubbles with enhanced interactivity
        zoomContainer.selectAll(".location-bubble")
            .data(bubbleDataLocation)
            .enter()
            .append("circle")
            .attr("class", "location-bubble")
            .attr("cx", d => projection(d.coordinates)[0])
            .attr("cy", d => projection(d.coordinates)[1])
            .attr("r", 0)
            .attr("fill", "rgba(76, 175, 80, 0.8)")
            .attr("stroke", "rgba(255, 255, 255, 0.9)")
            .attr("stroke-width", 3)
            .style("filter", "drop-shadow(0px 4px 15px rgba(76, 175, 80, 0.4))")
            .style("cursor", "pointer")
            .transition()
            .duration(600)
            .delay((_, i) => i * 120)
            .attr("r", d => Math.sqrt(d.value) + 8)
            .on("end", function () {
                d3.select(this)
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", Math.sqrt(d.value) + 12)
                            .style("filter", "drop-shadow(0px 8px 25px rgba(76, 175, 80, 0.7))");


                    })
                    .on("mouseout", function (_, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", Math.sqrt(d.value) + 8)
                            .style("filter", "drop-shadow(0px 4px 15px rgba(76, 175, 80, 0.4))");

                    });
            });

        // Enhanced value labels
        zoomContainer.selectAll(".value-label")
            .data(bubbleDataLocation)
            .enter()
            .append("text")
            .attr("class", "value-label")
            .attr("x", d => projection(d.coordinates)[0])
            .attr("y", d => projection(d.coordinates)[1] + 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("pointer-events", "none")
            .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.8)")
            .style("font-family", "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif")
            .style("opacity", 0)
            .text(d => d.value)
            .transition()
            .duration(800)
            .delay((_, i) => i * 120 + 300)
            .style("opacity", 1);

        // Modern flow lines with enhanced animation
        const provinceCentroids = new Map();
        displayGeoJSON.features.forEach(f => {
            const name = f.properties.Ten || f.properties.TenTinh;
            const coords = projection(d3.geoCentroid(f));
            if (coords) provinceCentroids.set(name, coords);
        });

        const flowLines = zoomContainer.selectAll(".modern-flow-line")
            .data(flows)
            .enter()
            .append("path")
            .attr("class", "modern-flow-line")
            .attr("d", d => {
                const from = provinceCentroids.get(d.from);
                const to = provinceCentroids.get(d.to);
                if (!from || !to) return "";
                const midX = (from[0] + to[0]) / 2;
                const midY = (from[1] + to[1]) / 2 - 15;
                return `M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`;
            })
            .attr("stroke", "url(#neonGlow)")
            .attr("stroke-width", d => Math.max(2, d.value / 8))
            .attr("fill", "none")
            .attr("opacity", 0)
            .attr("marker-end", "url(#modernArrow)")
            .style("filter", "drop-shadow(0px 0px 8px rgba(0, 245, 255, 0.6))")
            .style("stroke-dasharray", function () {
                return this.getTotalLength();
            })
            .style("stroke-dashoffset", function () {
                return this.getTotalLength();
            });

        // Animate flow lines
        flowLines
            .transition()
            .duration(1500)
            .delay((_, i) => i * 300 + 1000)
            .attr("opacity", 0.8)
            .style("stroke-dashoffset", 0);

    }, [displayGeoJSON]);

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            {/* Loading animation */}
            {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white mt-4 font-medium">Đang tải bản đồ...</p>
                        <div className="w-48 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main map container */}
            <div>
                <svg
                    ref={svgRef}
                    width="100%"
                    height="700"
                    viewBox="0 0 800 650"
                    className="rounded-xl shadow-xl"
                />
            </div>

            {/* Chart overlay */}
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