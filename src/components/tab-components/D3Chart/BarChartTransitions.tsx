import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChartTransitions = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [chart, setChart] = useState<{ update: (order: any) => void } | null>(null);
    const [sortOrder, setSortOrder] = useState('alphabetical');

    // Sample data similar to the alphabet frequency data
    const originalData = [
        { letter: 'A', frequency: 0.08167 },
        { letter: 'B', frequency: 0.01492 },
        { letter: 'C', frequency: 0.02782 },
        { letter: 'D', frequency: 0.04253 },
        { letter: 'E', frequency: 0.12702 },
        { letter: 'F', frequency: 0.02228 },
        { letter: 'G', frequency: 0.02015 },
        { letter: 'H', frequency: 0.06094 },
        { letter: 'I', frequency: 0.06966 },
        { letter: 'J', frequency: 0.00153 },
        { letter: 'K', frequency: 0.00772 },
        { letter: 'L', frequency: 0.04025 },
        { letter: 'M', frequency: 0.02406 },
        { letter: 'N', frequency: 0.06749 },
        { letter: 'O', frequency: 0.07507 },
        { letter: 'P', frequency: 0.01929 },
        { letter: 'Q', frequency: 0.00095 },
        { letter: 'R', frequency: 0.05987 },
        { letter: 'S', frequency: 0.06327 },
        { letter: 'T', frequency: 0.09056 },
        { letter: 'U', frequency: 0.02758 },
        { letter: 'V', frequency: 0.00978 },
        { letter: 'W', frequency: 0.02360 },
        { letter: 'X', frequency: 0.00150 },
        { letter: 'Y', frequency: 0.01974 },
        { letter: 'Z', frequency: 0.00074 }
    ];

    useEffect(() => {
        setData([...originalData]);
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);

        // Chart dimensions
        const width = 640;
        const height = 400;
        const marginTop = 40;
        const marginRight = 0;
        const marginBottom = 0;
        const marginLeft = 40;

        // Clear previous content
        svg.selectAll('*').remove();

        // Set up SVG
        svg
            .attr('viewBox', [0, 0, width, height])
            .attr('style', `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`);

        // Declare scales
        const x = d3.scaleBand()
            .domain(data.map(d => d.letter))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.frequency)]).nice()
            .range([height - marginBottom, marginTop]);

        // Create axis generators
        const xAxis = d3.axisBottom(x).tickSizeOuter(0);

        // Create bars
        svg.append('g')
            .attr('fill', 'steelblue')
            .selectAll<SVGRectElement, any>('rect')
            .data(data)
            .join('rect')
            .style('mix-blend-mode', 'multiply')
            .attr('x', d => x(d.letter)!)
            .attr('y', d => y(d.frequency))
            .attr('height', d => y(0) - y(d.frequency))
            .attr('width', x.bandwidth());

        // Create axes
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - marginBottom})`)
            .call(xAxis)
            .attr('color', 'white')
            .attr('font-size', '16px');

        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickFormat((y: any) => (y * 100).toFixed()))
            .call(g => g.select('.domain').remove())
            .attr('color', 'white')
            .attr('font-size', '16px');

        // Create chart object with update function
        const chartObject = {
            update(order: (a: any, b: any) => number) {
                const sortedData = [...data].sort(order);
                x.domain(sortedData.map(d => d.letter));

                const t: any = svg.transition()
                    .duration(750);

                svg.selectAll<SVGRectElement, any>('rect')
                    .data(sortedData, d => d.letter)
                    .order()
                    .transition(t)
                    .delay((_, i) => i * 20)
                    .attr('x', d => x(d.letter)!);

                // Only update the x-axis, not all <g>
                svg.select<SVGGElement>('.x-axis')
                    .transition(t)
                    .call(xAxis)
                    .selectAll('.tick')
                    .delay((_, i) => i * 20);
            }
        };

        setChart(chartObject);

    }, [data]);

    // Handle sort order change
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newOrder = event.target.value;
        setSortOrder(newOrder);

        if (chart) {
            switch (newOrder) {
                case 'alphabetical':
                    chart.update((a: any, b: any) => a.letter.localeCompare(b.letter));
                    break;
                case 'frequency-desc':
                    chart.update((a: any, b: any) => b.frequency - a.frequency);
                    break;
                case 'frequency-asc':
                    chart.update((a: any, b: any) => a.frequency - b.frequency);
                    break;
                case 'random':
                    chart.update(() => Math.random() - 0.5);
                    break;
                default:
                    chart.update((a: any, b: any) => a.letter.localeCompare(b.letter));
            }
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-0 right-[-10px] z-10 m-4">
                <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="w-[17px] h-[20px] px-1 py-1"
                >
                    <option value="alphabetical" className='text-xs'>(A → Z)</option>
                    <option value="frequency-desc" className='text-xs'>(High → Low)</option>
                    <option value="frequency-asc" className='text-xs'>(Low → High)</option>
                    <option value="random" className='text-xs'>Random</option>
                </select>
            </div>
            <svg ref={svgRef} className="w-full"></svg>
        </div>
    );
};

export default BarChartTransitions;