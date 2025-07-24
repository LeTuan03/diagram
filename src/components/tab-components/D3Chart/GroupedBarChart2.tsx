import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GroupedBarChartProps {
    data?: RegionData[];
    width?: number;
    height?: number;
}

interface RegionData {
    id: string;
    name: string;
    cases: number;
    deaths: number;
    recoveries: number;
    population: number;
    coordinates: [number, number];
}

const regionData: RegionData[] = [
    { id: 'region1', name: 'Hà Nội', cases: 120, deaths: 8, recoveries: 100, population: 8000000, coordinates: [105.8342, 21.0278] },
    { id: 'region2', name: 'TP.HCM', cases: 150, deaths: 12, recoveries: 130, population: 9000000, coordinates: [106.6297, 10.8231] },
    { id: 'region3', name: 'Đà Nẵng', cases: 45, deaths: 3, recoveries: 40, population: 1500000, coordinates: [108.2208, 16.0544] },
    { id: 'region4', name: 'Hải Phòng', cases: 60, deaths: 4, recoveries: 50, population: 2000000, coordinates: [106.6881, 20.8449] },
    { id: 'region5', name: 'Cần Thơ', cases: 35, deaths: 2, recoveries: 30, population: 1200000, coordinates: [105.7467, 10.0452] },
    { id: 'region6', name: 'Huế', cases: 25, deaths: 1, recoveries: 22, population: 400000, coordinates: [107.5909, 16.4637] },
];

const GroupedBarChart2: React.FC<GroupedBarChartProps> = ({ data = regionData, width = 400, height = 300 }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 80, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const keys = ['cases', 'recoveries', 'deaths'];
        const colors = ['#3B82F6', '#10B981', '#EF4444'];

        const x0 = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, innerWidth])
            .padding(0.1);

        const x1 = d3.scaleBand()
            .domain(keys)
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.cases, d.recoveries, d.deaths)) || 0])
            .range([innerHeight, 0]);

        // Add X axis
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x0))
            .selectAll('text')
            .style('font-size', '11px')
            .style('fill', '#fff')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        // Add Y axis
        g.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#fff');

        // Create tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'bar-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000');

        // Add bars
        const regionGroups = g.selectAll('.region-group')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'region-group')
            .attr('transform', d => `translate(${x0(d.name)},0)`);

        keys.forEach((key, keyIndex) => {
            regionGroups.selectAll(`.bar-${key}`)
                .data(d => [d])
                .enter()
                .append('rect')
                .attr('class', `bar-${key}`)
                .attr('x', x1(key) || 0)
                .attr('width', x1.bandwidth())
                .attr('y', innerHeight)
                .attr('height', 0)
                .attr('fill', colors[keyIndex])
                .style('cursor', 'pointer')
                .on('mouseover', function (_, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0.8);

                    const labels = { cases: 'Số ca', recoveries: 'Hồi phục', deaths: 'Tử vong' };
                    tooltip.style('visibility', 'visible')
                        .html(`
              <div style="font-weight: bold;">${d.name}</div>
              <div>${labels[key as keyof typeof labels]}: ${d[key as keyof RegionData].toLocaleString()}</div>
            `);
                })
                .on('mousemove', function (event) {
                    tooltip.style('top', (event.pageY - 10) + 'px')
                        .style('left', (event.pageX + 10) + 'px');
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 1);
                    tooltip.style('visibility', 'hidden');
                })
                .transition()
                .delay((_, i) => i * 100 + keyIndex * 200)
                .duration(800)
                .ease(d3.easeElastic)
                .attr('y', d => y(d[key as keyof RegionData] as number))
                .attr('height', d => innerHeight - y(d[key as keyof RegionData] as number));
        });
        return () => {
            tooltip.remove();
        };
    }, [data, width, height]);

    return (
        <svg ref={svgRef} width={width} height={height}></svg>
    );
};

export default GroupedBarChart2;