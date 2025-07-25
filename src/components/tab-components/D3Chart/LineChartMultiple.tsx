import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import dataFake from "./data/unemployment.json";

interface DataPoint {
    date: Date;
    unemployment: number;
    division: string;
}

const LineChartMultiple: React.FC<{ data?: DataPoint[] }> = ({ data = dataFake }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const voronoi = false; // Set true nếu muốn hiện lưới Voronoi

    useEffect(() => {
        if (!svgRef.current) return;

        const parsedData: DataPoint[] = data.map((d: any) => ({
            ...d,
            date: new Date(d.date),
            unemployment: +d.unemployment,
        }));

        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 30;

        const x = d3.scaleUtc()
            .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.unemployment) || 0])
            .nice()
            .range([height - marginBottom, marginTop]);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 14px sans-serif;");

        svg.selectAll("*").remove();

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
            .attr("font-size", "27px")
            .call(g => g.selectAll("text").attr("fill", "white"))
            .call(g => g.selectAll("line").attr("stroke", "white"));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .attr("font-size", "27px")
            .call(g => g.select(".domain").remove())
            .call(!voronoi ? g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1)
                .attr("stroke", "white") : () => { })
            .call(g => g.selectAll("text").attr("fill", "white"))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", -10)
                .attr("fill", "white")
                .attr("font-size", "30px")
                .attr("text-anchor", "start")
                .text("↑ Unemployment (%)"));

        const points = parsedData.map(d => [x(d.date), y(d.unemployment), d.division] as [number, number, string]);

        if (voronoi) {
            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("d", d3.Delaunay
                    .from(points, d => d[0], d => d[1])
                    .voronoi([0, 0, width, height])
                    .render());
        }

        const groups = d3.groups(points, d => d[2]);

        const line = d3.line<[number, number]>()
            .defined(d => !isNaN(d[0]) && !isNaN(d[1]));

        const path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#00d3fe")
            .attr("stroke-width", 10)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(groups.map(([_, pts]) => pts))
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", d => line(d.map(([x, y]) => [x, y]))!);

        const dot = svg.append("g")
            .attr("display", "none");

        dot.append("circle")
            .attr("r", 15)
            .attr("fill", "#00d3fe")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5);

        dot.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -16)
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .attr("fill", "#000")
            .attr("font-size", "32px")
            .attr("font-weight", "bold")
            .attr("paint-order", "stroke")
            .attr("stroke-linejoin", "round")
            .style("text-shadow", "0 0 2px white");

        svg
            .on("pointerenter", pointerentered)
            .on("pointermove", pointermoved)
            .on("pointerleave", pointerleft)
            .on("touchstart", (event: any) => event.preventDefault());

        function pointermoved(event: any) {
            const [xm, ym] = d3.pointer(event);
            const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym))!;
            const [xPos, yPos, k] = points[i];
            path.style("stroke", (_, j) => groups[j][0] === k ? null : "#ddd");
            path.filter((_, j) => groups[j][0] === k).raise();
            dot.attr("transform", `translate(${xPos},${yPos})`);
            dot.select("text").text(k);

            svgRef.current?.dispatchEvent(new CustomEvent("input", {
                detail: parsedData[i],
                bubbles: true,
                cancelable: true,
            }));
        }

        function pointerentered() {
            path.style("mix-blend-mode", null).style("stroke", "#ddd");
            dot.attr("display", null);
        }

        function pointerleft() {
            path.style("mix-blend-mode", "multiply").style("stroke", null);
            dot.attr("display", "none");
            svgRef.current?.dispatchEvent(new CustomEvent("input", {
                detail: null,
                bubbles: true,
                cancelable: true,
            }));
        }
    }, [data]);

    return <svg ref={svgRef} />;
};

export default LineChartMultiple;
