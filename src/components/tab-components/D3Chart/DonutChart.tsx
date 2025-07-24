import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type SunburstNode = {
  name: string;
  value?: number;
  children?: SunburstNode[];
};

type Props = {
  data?: SunburstNode;
  width?: number;
};

const data = [
  { name: "<5", value: 19912018 },
  { name: "5-9", value: 20501982 },
  { name: "10-14", value: 20679786 },
  { name: "15-19", value: 21354481 },
  { name: "20-24", value: 22604232 },
  { name: "25-29", value: 21698010 },
  { name: "30-34", value: 21183639 },
  { name: "35-39", value: 19855782 },
  // { name: "40-44", value: 20796128 },
  // { name: "45-49", value: 21370368 },
  // { name: "50-54", value: 22525490 },
  // { name: "55-59", value: 21001947 },
  // { name: "60-64", value: 18415681 },
  // { name: "65-69", value: 14547446 },
  // { name: "70-74", value: 10587721 },
  // { name: "75-79", value: 7730129 },
  // { name: "80-84", value: 5811429 },
  // { name: "≥85", value: 5938752 },
]
const DonutChart: React.FC<Props> = ({ width = 300 }) => {

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const height = Math.min(width, 500);
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const pie = d3.pie<{ name: string; value: number }>()
      .padAngle(1 / radius)
      .sort(null)
      .value((d: any) => d.value);

    const names = data.map(d => d.name); // string[]
    const color = d3.scaleOrdinal<string, string>() // input: tên, output: màu
      .domain(names)
      .range(
        d3.quantize(
          (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
          names.length
        ).reverse()
      );
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    const pieData = d3.pie<{ name: string; value: number }>()
      .value(d => d.value)(data);
    svg.append("g")
      .selectAll("path")
      .data(pieData)
      .join("path")
      // .attr("fill", (d): string => d.data.name)
      // .attr("d", (d: any) => arc(d)!)
      .attr("fill", d => color(d.data.name))
      .attr("d", (d:any) => arc(d)!)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(data))
      .join("text")
      .attr("transform", (d: any) => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text((d: any) => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d: any) => d.data.value.toLocaleString("en-US")));

    svgRef.current.appendChild(svg.node()!);
  }, [data]);

  return <svg ref={svgRef} />;
};

export default DonutChart;
