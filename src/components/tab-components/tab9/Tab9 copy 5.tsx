import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import geojsonData from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";
import tinh3Geojson from "../tab5/geoData/Tinh3.json";
import tinh6Geojson from "../tab5/geoData/Tinh6.json";
import ChartOverlay from './ChartOverlay';

const MapConfig = {
  zoomScale: 1.2,
}
const MapComponent: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [geojson, setGeojson] = useState<any>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [chartOverlay, setChartOverlay] = useState<{
    x: number;
    y: number;
    data: any[];
    type: 'bar' | 'pie' | 'sparkline';
    title: string;
  } | null>(null);

  const displayGeoJSON: any = useMemo(() => (currentZoom > MapConfig.zoomScale ? geojsonData : tinhGeojson), [currentZoom > MapConfig.zoomScale]);
  const displayGeoTinhJSON: any = useMemo(() => (tinhGeojson), []);
  const display3GeoTinhJSON: any = useMemo(() => (tinh3Geojson), []);
  const display6GeoTinhJSON: any = useMemo(() => (tinh6Geojson), []);

  const xaJson: any = geojsonData;
  let selectedProvince: SVGPathElement | null = null;

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

  useLayoutEffect(() => {
    // Khởi tạo map khi load xong JSON
    if (!geojson) {
      setGeojson(tinhGeojson);
      return;
    }

    const width = 700;
    const height = 700;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("g").remove(); // clear cũ

    // Định nghĩa arrowhead marker
    const defs = svg.append("defs");

    const arrowMarker = defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 36 36")
      .attr("refX", 18)
      .attr("refY", 18)
      .attr("markerWidth", 18)
      .attr("markerHeight", 18)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .style("fill", "#3b82f6"); // màu xanh đẹp

    arrowMarker.append("path")
      .attr("d", "M0,0 L36,18 L0,36 L9,18 Z") // mũi tên cong và lớn hơn, mượt hơn
      .attr("stroke", "none")
      .attr("fill", "#3b82f6");


    const g = svg.append("g");

    const projection = d3.geoMercator()
      .fitSize([width, height], geojson);

    const path: any = d3.geoPath().projection(projection);

    const provinceLayer = g.append("g").attr("class", "province");
    const wardLayer = g.append("g").attr("class", "ward");

    // Color scale based on population
    const colorScaleProvince = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, geojson.features.length]);
    const colorScaleWard = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, xaJson.features.length]);
    // Tỉnh
    provinceLayer.selectAll("path")
      .data((geojson.features || []).filter((d: any) => d.properties.TenTinh))
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", (_: any, i: number) => colorScaleProvince(i))
      .attr("stroke", "#2a4d69")
      .attr("stroke-width", 0.5)
      .on("mouseover", function (event, d: any) {
        d3.select(this).attr('stroke-width', 2);
        setChartOverlay({
          x: event.pageX - 900,
          y: event.pageY - 500,
          data: d.chartData,
          type: d.chartType,
          title: `${d.properties.Ten || d.properties.TenTinh || 'Unknown'}`
        });
      })
      .on("mouseout", function () {
        d3.select(this).attr('stroke-width', 0.5);
        setChartOverlay(null);
      })
      .on("click", function () {
        if (selectedProvince) {
          const prevIndexAttr = selectedProvince.getAttribute("data-index");
          const prevIndex = prevIndexAttr ? +prevIndexAttr : -1;
          if (prevIndex >= 0) {
            d3.select(selectedProvince)
              .attr("fill", colorScaleProvince(prevIndex));
          }
        }

        d3.select(this).attr("fill", "#fbbf24");
        selectedProvince = this;
      })
      .attr("data-index", (_: any, i: number) => i) // để lưu index
      .append("title")
      .text((d: any) => d.properties.TenTinh);

    // Xã/Phường
    wardLayer.selectAll("path")
      .data(xaJson.features.filter((d: any) => d.properties.Ten && d.properties.TenTinh))
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", (_: any, i: number) => colorScaleWard(i))
      .attr("stroke", "#2a4d69")
      .attr("stroke-width", 0.3)
      .style("display", "none")
      .on("mouseover", function (event, d: any) {
        d3.select(this).attr('stroke-width', 2);
        setChartOverlay({
          x: event.pageX - 900,
          y: event.pageY - 500,
          data: d.chartData,
          type: d.chartType,
          title: `${d.properties.Ten || d.properties.TenTinh || 'Unknown'}`
        });
      })
      .on("mouseout", function () {
        d3.select(this).attr('stroke-width', 0.5);
        setChartOverlay(null);
      })
      .on("click", function () {
        if (selectedProvince) {
          const prevIndexAttr = selectedProvince.getAttribute("data-index");
          const prevIndex = prevIndexAttr ? +prevIndexAttr : -1;
          if (prevIndex >= 0) {
            d3.select(selectedProvince)
              .attr("fill", colorScaleWard(prevIndex));
          }
        }

        d3.select(this).attr("fill", "#fbbf24");
        selectedProvince = this;
      })
      .attr("data-index", (_: any, i: number) => i) // để lưu index
      .append("title")
      .text((d: any) => `${d.properties.Ten}, ${d.properties.TenTinh}`);

    // Zoom handler
    const zoom: any = d3.zoom().on("zoom", (event) => {
      const transform = event.transform;
      g.attr("transform", transform);

      const zoomLevel = transform.k;
      setCurrentZoom(zoomLevel);

      const zoomContainer = svg.select('.zoom-container');
      if (!zoomContainer.empty()) {
        zoomContainer.attr('transform', event.transform);
      }

      if (zoomLevel > 1.2) {
        wardLayer.selectAll("path").style("display", "block");
        provinceLayer.selectAll("path").style("display", "none");
      } else {
        wardLayer.selectAll("path").style("display", "none");
        provinceLayer.selectAll("path").style("display", "block");
      }
    });

    svg.call(zoom);

    // Tạo zoom container cho tất cả các phần tử cần zoom
    const zoomContainer = svg.append("g").attr("class", "zoom-container");

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
      .attr("fill", "#4ade80")
      .attr("opacity", 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

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
      // Áp dụng hiệu ứng nảy
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
      .append("title")
      .text((d: any) => `${d.name}: ${d.value}`)

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
        const midY = (from[1] + to[1]) / 2 - 40; // cong lên một chút

        return `M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`;
      })
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", (d: any) => Math.max(1, d.value / 10))
      .attr("fill", "none")
      .attr("opacity", 0.9)
      .attr("marker-end", "url(#arrowhead)") // Thêm mũi tên ở cuối đường
      .append("title")
      .text((d: any) => `${d.from} → ${d.to}: ${d.value}`);

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
  }, [geojson]);

  return (
    <div> <svg ref={svgRef} />
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

export default MapComponent;