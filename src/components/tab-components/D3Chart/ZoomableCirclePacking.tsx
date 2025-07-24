import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import dataFake from "./data/data.json";

const ZoomableCirclePacking: React.FC<any> = ({ data = dataFake }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 300;
        const height = 300;

        const color = d3.scaleLinear<string>()
            .domain([0, 5])
            .range(["hsla(0, 0%, 100%, 1.00)", "hsla(199, 75%, 40%, 1.00)"])
            .interpolate(d3.interpolateHcl);

        const pack = (data: any) => d3.pack()
            .size([width, height])
            .padding(3)(
                d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => (b.value || 0) - (a.value || 0))
            );

        const root = pack(data);

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .attr("width", width)
            .attr("height", height)
            .attr("style", `max-width: 100%; height: auto; display: flex; justify-content: center; align-items: center; cursor: pointer;`);

        svg.selectAll("*").remove(); // Clear previous render

        const g = svg.append("g");

        const node = g.selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", d => d.children ? color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function () { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function () { d3.select(this).attr("stroke", null); })
            .on("click", (event, d) => {
                if (focus !== d) {
                    zoom(event, d);
                    event.stopPropagation();
                }
            });

        const label = g.append("g")
            .style("font", "10px sans-serif")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text((d: any) => `${d.data.name}${d.data.value != null ? ` (${d.data.value})` : ''}`);

        let focus = root;
        let view: [number, number, number];

        svg.on("click", (event) => zoom(event, root));

        zoomTo([focus.x, focus.y, focus.r * 2]);

        function zoomTo(v: [number, number, number]) {
            const k = width / v[2];
            view = v;
            label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
                .attr("r", d => d.r * k);
        }

        function zoom(event: any, d: any) {
            const focus0 = focus;
            focus = d;

            const transition: any = svg.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", () => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            label
                .filter(function (this: any, d: any) {
                    return d.parent === focus || this.style.display === "inline";
                })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function (this: any, d: any) {
                    if (d.parent === focus) this.style.display = "inline";
                })
                .on("end", function (this: any, d: any) {
                    if (d.parent !== focus) this.style.display = "none";
                });
        }
    }, [data]);

    return <svg ref={svgRef} />;
};

export default ZoomableCirclePacking;
