import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dataFake from "./data/data.json";

interface HierarchicalDatum {
    name: string;
    value?: number;
    children?: HierarchicalDatum[];
}

interface HierarchicalBarChartProps {
    data?: HierarchicalDatum;
    width?: number;
    height?: number;
    autoHeight?: boolean;
}

const HierarchicalBarChart = ({
    data = dataFake,
    width = 800,
    height = 400,
    autoHeight = false
}: HierarchicalBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const marginTop = 50;
    const marginRight = 30;
    const marginBottom = 0;
    const marginLeft = 120;
    const barStep = 40;
    const barPadding = 10 / barStep;
    const duration = 750;

    useEffect(() => {
        const chartData: HierarchicalDatum = data || {
            name: 'Root',
            children: [
                {
                    name: 'Category A',
                    children: [
                        { name: 'Item A1', value: 100 },
                        { name: 'Item A2', value: 80 },
                        { name: 'Item A3', value: 60 },
                    ],
                },
                {
                    name: 'Category B',
                    children: [
                        { name: 'Item B1', value: 120 },
                        { name: 'Item B2', value: 90 },
                        { name: 'Item B3', value: 70 },
                        { name: 'Item B4', value: 50 },
                    ],
                },
                {
                    name: 'Category C',
                    children: [
                        { name: 'Item C1', value: 110 },
                        { name: 'Item C2', value: 85 },
                    ],
                },
            ],
        };

        const svg = d3.select(svgRef.current as SVGSVGElement);
        svg.selectAll('*').remove();

        const root = d3
            .hierarchy(chartData)
            .sum((d) => d.value || 0)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        let nodeIndex = 0;
        root.each((d: any) => {
            d.index = nodeIndex++;
        });

        let chartHeight = height;
        if (autoHeight) {
            let maxChildren = 1;
            root.each((d) => {
                if (d.children) maxChildren = Math.max(maxChildren, d.children.length);
            });
            chartHeight = maxChildren * barStep + marginTop + marginBottom;
        }

        const x = d3.scaleLinear().range([marginLeft, width - marginRight]);
        const modernColors = [
            '#10b981', // Emerald
            '#00BFFF', // Cyan
            '#f59e0b', // Amber
            '#ef4444', // Red
            '#ec4899', // Pink (có hơi hồng, không tím)
            '#84cc16', // Lime
            '#3b82f6', // Blue
            '#f43f5e', // Rose
            '#22c55e', // Green
            '#eab308'  // Yellow
        ];
        const color = (depth: number) => modernColors[depth % modernColors.length];
        const translate = (x: number, y: number) => `translate(${x},${y})`;

        const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
            g
                .attr('class', 'x-axis')
                .attr('transform', translate(0, marginTop))
                .call(d3.axisTop(x).ticks(width / 80, 's') as any)
                .selectAll('text')
                .attr('font-size', '20px')
                .attr('fill', '#ffffff');

        const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
            g
                .attr('class', 'y-axis')
                .attr('transform', translate(marginLeft, 0))
                .call((g2: any) =>
                    g2
                        .append('line')
                        .attr('y1', marginTop)
                        .attr('y2', chartHeight - marginBottom)
                );

        // --- Tooltip ---
        let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = d3.select("body").select(".hierarchical-bar-tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body")
                .append("div")
                .attr("class", "hierarchical-bar-tooltip")
                .style("position", "fixed")
                .style("z-index", "9999")
                .style("pointer-events", "none")
                .style("background", "rgba(255, 255, 255, 0.97)")
                .style("color", "#fff")
                .style("padding", "0px 12px 5px")
                .style("border-radius", "5px")
                .style("font-size", "14px")
                .style("opacity", 0)
                .style("transition", "opacity 0.2s");
        }

        const bar = (
            svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
            down: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, d: d3.HierarchyNode<HierarchicalDatum>) => void,
            d: d3.HierarchyNode<HierarchicalDatum>,
            selector: string
        ) => {
            const g = svg
                .insert('g', selector)
                .attr('class', 'enter')
                .attr('transform', translate(0, marginTop + barStep * barPadding))
                .attr('text-anchor', 'end')
                .style('font', '10px sans-serif');

            const barElements = g
                .selectAll<SVGGElement, d3.HierarchyNode<HierarchicalDatum>>('g')
                .data(d.children || [])
                .join('g')
                .attr('cursor', (d) => (!d.children ? null : 'pointer'))
                .on('click', (_event, d) => down(svg, d));

            barElements
                .append('text')
                .attr('x', marginLeft - 6)
                .attr('y', barStep * (1 - barPadding) / 2)
                .attr('dy', '.35em')
                .attr('font-size', '20px')
                .attr('fill', '#ffffff')
                .text((d) => d.data.name);

            barElements
                .append('path')
                .attr('d', (d) => {
                    const barWidth = x(d.value || 0) - x(0);
                    const barHeight = barStep * (1 - barPadding);
                    const radius = 12;
                    const startX = x(0);

                    // Tạo path với border-radius chỉ ở bên phải
                    return `
            M ${startX} 0
            L ${startX + barWidth - radius} 0
            Q ${startX + barWidth} 0 ${startX + barWidth} ${radius}
            L ${startX + barWidth} ${barHeight - radius}
            Q ${startX + barWidth} ${barHeight} ${startX + barWidth - radius} ${barHeight}
            L ${startX} ${barHeight}
            Z
          `;
                })
                .attr('fill', (d) => color(d.depth))
                .style('opacity', 0.9)
                .on('mouseenter', function (event, d) {
                    d3.select(this).style('opacity', 1).style('filter', 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))');
                    // --- Sửa vị trí tooltip: dùng clientX/clientY để đúng vị trí chuột ---
                    tooltip
                        .html(`
                <div>
                    <p class="text-black font-bold">${d.data.name}</p>
                    ${typeof d.value === "number" ? `<p class="text-black">Giá trị: <b>${d.value}</b></p>` : ""}
                    ${d.children ? `<p class="text-xs text-blue-400">Nhấp để xem chi tiết</p>` : ""}
                </div>
                `)
                        .style("left", (event.clientX + 15) + "px")
                        .style("top", (event.clientY - 15) + "px")
                        .style("opacity", 1);
                })
                .on('mousemove', function (event) {
                    tooltip
                        .style("left", (event.clientX + 15) + "px")
                        .style("top", (event.clientY - 15) + "px");
                })
                .on('mouseleave', function () {
                    d3.select(this).style('opacity', 0.9).style('filter', 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.1))');
                    tooltip.style("opacity", 0);
                });

            return g;
        };

        const stack = (i: number) => {
            let value = 0;
            return (d: d3.HierarchyNode<HierarchicalDatum>) => {
                const t = translate(x(value) - x(0), barStep * i);
                value += d.value || 0;
                return t;
            };
        };

        const stagger = () => {
            let value = 0;
            return (d: d3.HierarchyNode<HierarchicalDatum>, i: number) => {
                const t = translate(x(value) - x(0), barStep * i);
                value += d.value || 0;
                return t;
            };
        };

        const down = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, d: d3.HierarchyNode<HierarchicalDatum>) => {
            if (!d.children || d3.active(svg.node())) return;
            svg.select('.background').datum(d);

            // Update x domain BEFORE rendering bars, so the value reflects correctly
            x.domain([0, d3.max((d.children || []).map((c) => c.value || 0))!]);
            const transition1 = svg.transition().duration(duration);
            const transition2 = svg.transition().duration(duration);

            svg.selectAll<SVGGElement, unknown>('.x-axis').transition(transition2 as any).call(xAxis as any);

            const exit = svg.selectAll<SVGGElement, unknown>('.enter').attr('class', 'exit');

            exit.selectAll('path').attr('fill-opacity', function (p: any) {
                return p === d ? 0 : null;
            });

            exit.transition(transition1 as any).attr('fill-opacity', 0).remove();

            const enter = bar(svg, down, d, '.y-axis').attr('fill-opacity', 0);

            enter.transition(transition1 as any).attr('fill-opacity', 1);
            enter.selectAll<SVGGElement, d3.HierarchyNode<HierarchicalDatum>>('g')
                .attr('transform', stack((d as any).index))
                .transition(transition1 as any)
                .attr('transform', stagger() as any);

            enter.selectAll<SVGGElement, d3.HierarchyNode<HierarchicalDatum>>('g')
                .transition(transition2 as any)
                .attr('transform', (_: any, i: number) => translate(0, barStep * i));
        };


        const up = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, d: d3.HierarchyNode<HierarchicalDatum>) => {
            if (!d.parent || !svg.selectAll('.exit').empty()) return;
            svg.select('.background').datum(d.parent);
            const transition1 = svg.transition().duration(duration);
            const transition2 = svg.transition().duration(duration);
            const exit = svg.selectAll<SVGGElement, unknown>('.enter').attr('class', 'exit');

            x.domain([0, d3.max((d.parent?.children || []).map((c) => c.value || 0))!]);
            svg.selectAll<SVGGElement, unknown>('.x-axis').transition(transition1 as any).call(xAxis as any);
            exit.selectAll<SVGGElement, d3.HierarchyNode<HierarchicalDatum>>('g')
                .transition(transition1 as any)
                .attr('transform', stagger() as any);
            exit.selectAll<SVGGElement, d3.HierarchyNode<HierarchicalDatum>>('g')
                .transition(transition2 as any)
                .attr('transform', stack((d as any).index) as any);
            exit.selectAll('path')
                .transition(transition1 as any)
                .attr('d', (d: any) => {
                    const barWidth = x(d.value || 0) - x(0);
                    const barHeight = barStep * (1 - barPadding);
                    const radius = 12;
                    const startX = x(0);

                    return `
            M ${startX} 0
            L ${startX + barWidth - radius} 0
            Q ${startX + barWidth} 0 ${startX + barWidth} ${radius}
            L ${startX + barWidth} ${barHeight - radius}
            Q ${startX + barWidth} ${barHeight} ${startX + barWidth - radius} ${barHeight}
            L ${startX} ${barHeight}
            Z
          `;
                })
                .attr('fill', (d: any) => color(d.depth))
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1.5);

            exit.transition(transition2 as any).attr('fill-opacity', 0).remove();
            const enter = bar(svg, down, d.parent as d3.HierarchyNode<HierarchicalDatum>, '.exit').attr('fill-opacity', 0);
            enter.selectAll<SVGGElement, d3.HierarchyNode<HierarchicalDatum>>('g')
                .attr('transform', (_: any, i: number) => translate(0, barStep * i));
            enter.transition(transition2 as any).attr('fill-opacity', 1);
        };

        svg
            .attr('viewBox', [0, 0, width, chartHeight].toString())
            .attr('width', width)
            .attr('height', chartHeight)
            .style('max-width', '100%')
            .style('height', 'auto');

        x.domain([0, root.value || 0]);

        svg.append('rect')
            .attr('class', 'background')
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .attr('width', width)
            .attr('height', chartHeight)
            .attr('cursor', 'pointer')
            .on('click', function (_, d) {
                up(svg, d as d3.HierarchyNode<HierarchicalDatum>);
            });

        svg.append('g').call(xAxis as any);
        svg.append('g').call(yAxis as any);
        down(svg, root);

        // Cleanup tooltip on unmount
        return () => {
            tooltip.remove();
        };
    }, [data, width, height, autoHeight]);

    return (
        <svg ref={svgRef} />
    );
};

export default HierarchicalBarChart;