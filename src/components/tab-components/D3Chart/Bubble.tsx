import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import dataFake from "./data/dataBubble.json";

const Bubble: React.FC<any> = ({ data = dataFake }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 400;
        const height = width;
        const margin = 1;
        const name = (d: any) => d.id?.split(".").pop() || "";
        const group = (d: any) => d.id?.split(".")[1] || "";
        const names = (d: any) => name(d).split(/(?=[A-Z][a-z])|\s+/g);

        const format = d3.format(",d");
        const color = d3.scaleOrdinal(d3.schemeTableau10);

        const pack = d3.pack()
            .size([width - margin * 2, height - margin * 2])
            .padding(3);

        // Clear previous content
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Compute the hierarchy from the (flat) data; expose the values for each node; lastly apply the pack layout.
        const root = pack(
            d3.hierarchy({ children: data })
                .sum((d: any) => d.value)
        );

        // Place each (leaf) node according to the layout’s x and y values.
        const node = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll<SVGGElement, any>("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x - width / 2},${d.y - height / 2})`);

        // Add a title.
        node.append("title")
            .text((d: any) => `${d.data.id}\n${format(d.value)}`);

        // Add a filled circle.
        node.append("circle")
            .attr("fill-opacity", 0.7)
            .attr("fill", d => color(group(d.data)))
            .attr("r", d => d.r);

        // Add a label.
        const text = node.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("pointer-events", "none");

        // Add a tspan for each CamelCase-separated word.
        text.selectAll("tspan.label")
            .data(d => names(d.data))
            .join("tspan")
            .attr("class", "label")
            .attr("x", 0)
            .attr("y", (_, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
            .text((d: any) => d);

        // Add a tspan for the node’s value.
        text.append("tspan")
            .attr("x", 0)
            .attr("y", function (d: any) { return `${names(d.data).length / 2 + 0.35}em`; })
            .attr("fill-opacity", 0.7)
            .text((d: any) => format(d.value));

        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
            .attr("text-anchor", "middle");
    }, [data]);

    return <svg ref={svgRef} />;
};

export default Bubble;
