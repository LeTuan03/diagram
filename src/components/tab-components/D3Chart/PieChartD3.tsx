import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import dataFake from "./data/data.json";

const PieChartD3: React.FC<any> = ({ data = dataFake }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 150;
    const height = width;
    const radius = width / 6;

    // Tạo color scale
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    // Tạo hierarchy và partition layout
    const hierarchy = d3.hierarchy(data)
      .sum((d: any) => d.value || (d.children ? d.children.length : 1))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    const root = d3.partition<any>()
      .size([2 * Math.PI, hierarchy.height + 1])
      (hierarchy);
    root.each((d: any) => d.current = d);

    // Arc generator
    const arc = d3.arc<any>()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d: any) => d.y0 * radius)
      .outerRadius((d: any) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    svg
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${width}`)
      .style("font", "5px sans-serif");

    // Append the arcs
    const g = svg.append("g");
    const path = g.selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", function (d: any) { let node = d; while (node.depth > 1) node = node.parent; return color(node.data.name); })
      .attr("fill-opacity", (d: any) => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", (d: any) => arcVisible(d.current) ? "auto" : "none")
      .attr("d", (d: any) => arc(d.current) as string);

    // Make them clickable if they have children
    path.filter((d: any) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    const format = d3.format(",d");
    path.append("title")
      .text((d: any) => `${d.ancestors().map((d: any) => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d: any) => +labelVisible(d.current))
      .attr("transform", (d: any) => labelTransform(d.current))
      .text((d: any) => d.data.name);

    const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    // Handle zoom on click
    function clicked(event: any, p: any) {
      parent.datum(p.parent || root);

      root.each((d: any) => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(event.altKey ? 7500 : 750);

      path.transition(t as any)
        .tween("data", function (d: any) {
          const i = d3.interpolate(d.current, d.target);
          return function (t: number) {
            d.current = i(t);
          };
        })
        .filter(function (this: any, d: any) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d: any) => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", (d: any) => arcVisible(d.target) ? "auto" : "none")
        .attrTween("d", function (d: any) { return () => arc(d.current) as string; });

      label.filter(function (this: any, d: any) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t as any)
        .attr("fill-opacity", (d: any) => +labelVisible(d.target))
        .attrTween("transform", function (d: any) { return () => labelTransform(d.current); });
    }

    function arcVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d: any) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }, [data]);

  return <svg ref={svgRef} />;
};

export default PieChartD3;
