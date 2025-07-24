import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface BarDatum {
    name: string;
    value: number;
}

interface PieDatum {
    name: string;
    value: number;
}

interface SparklineDatum {
    value: number;
}

interface ChartOverlayProps {
    x: number;
    y: number;
    barData?: BarDatum[];
    pieData?: PieDatum[];
    sparklineData?: SparklineDatum[];
    title?: string;
}

const sampleBarData: BarDatum[] = [
    { name: "A", value: 30 },
    { name: "B", value: 80 },
    { name: "C", value: 45 },
    { name: "D", value: 65 }
];

const samplePieData: PieDatum[] = [
    { name: "Desktop", value: 45 },
    { name: "Mobile", value: 35 },
    { name: "Tablet", value: 20 }
];

const sampleSparklineData: SparklineDatum[] = [
    { value: 5 },
    { value: 10 },
    { value: 8 },
    { value: 12 },
    { value: 6 },
    { value: 15 },
    { value: 18 },
    { value: 14 },
    { value: 22 },
    { value: 25 }
];

const ChartOverlay: React.FC<ChartOverlayProps> = ({
    x,
    y,
    barData = sampleBarData,
    pieData = samplePieData,
    sparklineData = sampleSparklineData,
    title = "Analytics Dashboard"
}) => {
    const barRef = useRef<SVGSVGElement>(null);
    const pieRef = useRef<SVGSVGElement>(null);
    const sparklineRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!barRef.current) return;
        const svg = d3.select(barRef.current);
        svg.selectAll("*").remove();

        // === THIẾT LẬP KÍCH THƯỚC VÀ MARGIN ===
        const width = 140;
        const height = 110;
        const margin = { top: 15, right: 15, bottom: 25, left: 25 };

        // === TẠO GRADIENT CHO CÁC THANH BAR ===
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "barGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", height) // Bắt đầu từ dưới
            .attr("x2", 0).attr("y2", 0);     // Kết thúc ở trên

        // Màu gradient từ xanh dương đến tím
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#667eea");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#764ba2");

        // === THIẾT LẬP SCALES ===
        // Scale cho trục X (các nhãn)
        const xScale = d3.scaleBand()
            .domain(barData.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.3); // Khoảng cách giữa các thanh

        // Scale cho trục Y (các giá trị)
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(barData, d => d.value)!])
            .nice() // Làm tròn giá trị max
            .range([height - margin.bottom, margin.top]);

        svg.attr("width", width).attr("height", height);

        // === TẠO HIỆU ỨNG GLOW ===
        const filter = defs.append("filter")
            .attr("id", "glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "3")
            .attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // === TẠO CÁC THANH BAR VỚI ANIMATION ===
        const bars = svg.selectAll("rect")
            .data(barData)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.name)!)
            .attr("y", height - margin.bottom) // Bắt đầu từ đáy
            .attr("width", xScale.bandwidth())
            .attr("height", 0) // Chiều cao bắt đầu = 0
            .attr("fill", "url(#barGradient)") // Áp dụng gradient
            .attr("rx", 4) // Bo góc
            .attr("ry", 4)
            .style("filter", "url(#glow)"); // Áp dụng hiệu ứng glow

        // === ANIMATION CHO CÁC THANH BAR ===
        bars.transition()
            .duration(1000) // Thời gian animation
            .delay((_, i) => i * 200) // Delay khác nhau cho từng thanh
            .attr("y", d => yScale(d.value)) // Vị trí Y cuối cùng
            .attr("height", d => height - margin.bottom - yScale(d.value)); // Chiều cao cuối cùng

        // === THÊM NHÃN GIÁ TRỊ TRÊN MỖI THANH ===
        svg.selectAll("text")
            .data(barData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.name)! + xScale.bandwidth() / 2) // Giữa thanh
            .attr("y", d => yScale(d.value) - 5) // Phía trên thanh
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", "#4a5568")
            .text(d => d.value)
            .style("opacity", 0) // Bắt đầu trong suốt
            .transition()
            .duration(1000)
            .delay((_, i) => i * 200 + 800) // Xuất hiện sau khi thanh bar hoàn thành
            .style("opacity", 1);

    }, [barData]);

    useEffect(() => {
        if (!pieRef.current) return;
        const svg = d3.select(pieRef.current);
        svg.selectAll("*").remove();

        // === THIẾT LẬP KÍCH THƯỚC ===
        const width = 120;
        const height = 110;
        const radius = Math.min(width, height) / 2 - 10;

        // === TẠO GRADIENT CHO CÁC PHẦN PIE ===
        const defs = svg.append("defs");
        const colors = [
            { start: "#667eea", end: "#764ba2" },
            { start: "#f093fb", end: "#f5576c" },
            { start: "#4facfe", end: "#00f2fe" }
        ];

        // Tạo gradient cho từng phần của pie chart
        colors.forEach((color, i) => {
            const gradient = defs.append("linearGradient")
                .attr("id", `pieGradient${i}`)
                .attr("gradientUnits", "userSpaceOnUse");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color.start);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color.end);
        });

        // === THIẾT LẬP PIE CHART ===
        const pie = d3.pie<PieDatum>()
            .value(d => d.value)
            .sort(null); // Giữ nguyên thứ tự data

        // Tạo arc cho pie chart đầy đủ (không có lỗ giữa)
        const arc = d3.arc<d3.PieArcDatum<PieDatum>>()
            .innerRadius(0) // Bắt đầu từ tâm = pie chart đầy đủ
            .outerRadius(radius);

        // === TẠO CONTAINER CHO PIE CHART ===
        const g = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`); // Đặt tâm ở giữa

        const pieDataReady = pie(pieData);

        // === TẠO CÁC PHẦN PIE ===
        g.selectAll("path")
            .data(pieDataReady)
            .enter()
            .append("path")
            .attr("fill", (d, i) => `url(#pieGradient${i})`) // Áp dụng gradient
            .attr("stroke", "#fff") // Viền trắng
            .attr("stroke-width", 2)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))") // Hiệu ứng bóng
            .attr("d", arc) // Vẽ ngay lập tức để thấy được biểu đồ
            .each(function (_) {
                // Khởi tạo từ góc 0 để tạo hiệu ứng animation
                const current = { startAngle: 0, endAngle: 0 };
                d3.select(this).datum(current);
            });

        // === THÊM LABELS CHO TỪNG PHẦN ===
        const labels = g.selectAll("text")
            .data(pieDataReady)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`) // Đặt ở giữa mỗi phần
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", "#fff")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)") // Đổ bóng chữ
            .text(d => `${d.data.value}%`)
            .style("opacity", 0); // Bắt đầu trong suốt

        // Animation cho labels
        labels.transition()
            .duration(1000)
            .delay((d, i) => i * 300 + 1000) // Xuất hiện sau khi pie chart hoàn thành
            .style("opacity", 1);

    }, [pieData]);

    useEffect(() => {
        if (!sparklineRef.current) return;
        const svg = d3.select(sparklineRef.current);
        svg.selectAll("*").remove();

        // === THIẾT LẬP KÍCH THƯỚC ===
        const width = 120;
        const height = 50;
        const padding = 5;

        // === TẠO GRADIENT CHO AREA CHART ===
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "sparklineGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", 0)     // Bắt đầu từ trên
            .attr("x2", 0).attr("y2", height); // Kết thúc ở dưới

        // Tạo gradient từ xanh lá đậm đến trong suốt
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0.8);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0.1);

        // === THIẾT LẬP SCALES ===
        // Scale cho trục X (chỉ số các điểm)
        const xScale = d3.scaleLinear()
            .domain([0, sparklineData.length - 1])
            .range([padding, width - padding]);

        // Scale cho trục Y (giá trị)
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(sparklineData, d => d.value)!])
            .range([height - padding, padding]);

        // === TẠO CÁC HÀNG SỐ VẼ ===
        // Hàm vẽ đường line
        const line = d3.line<SparklineDatum>()
            .x((_, i) => xScale(i))
            .y(d => yScale(d.value))
            .curve(d3.curveCardinal); // Đường cong mượt

        // Hàm vẽ area (vùng dưới đường line)
        const area = d3.area<SparklineDatum>()
            .x((_, i) => xScale(i))
            .y0(height - padding) // Đáy area
            .y1(d => yScale(d.value)) // Đỉnh area
            .curve(d3.curveCardinal);

        svg.attr("width", width).attr("height", height);

        // === VẼ AREA CHART ===
        const path = svg.append("path")
            .datum(sparklineData)
            .attr("fill", "url(#sparklineGradient)")
            .attr("d", area);

        // === VẼ ĐƯỜNG LINE ===
        svg.append("path")
            .datum(sparklineData)
            .attr("fill", "none")
            .attr("stroke", "#10b981")
            .attr("stroke-width", 2)
            .attr("d", line)
            .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))");

        // === THÊM CÁC ĐIỂM DATA ===
        svg.selectAll("circle")
            .data(sparklineData)
            .enter()
            .append("circle")
            .attr("cx", (_, i) => xScale(i))
            .attr("cy", d => yScale(d.value))
            .attr("r", 2)
            .attr("fill", "#10b981")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .style("opacity", 0) // Bắt đầu trong suốt
            .transition()
            .duration(1000)
            .delay((d, i) => i * 100) // Delay khác nhau cho từng điểm
            .style("opacity", 1);

        // === ANIMATION CHO AREA VÀ LINE ===
        const totalLength = (svg.select("path").node() as SVGPathElement).getTotalLength();

        // Tạo hiệu ứng vẽ từ trái sang phải
        svg.selectAll("path")
            .style("stroke-dasharray", totalLength + " " + totalLength)
            .style("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .style("stroke-dashoffset", 0);

    }, [sparklineData]);

    return (
        <div
            style={{
            position: "absolute",
            left: x,
            top: y,
            background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
            border: "1.5px solid #3b4252",
            padding: 18,
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,255,255,0.08)",
            backdropFilter: "blur(14px)",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            minWidth: 440,
            overflow: "hidden"
            }}
        >
            {/* Techy animated background */}
            <svg
            width="100%"
            height="100%"
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 0,
                pointerEvents: "none",
                filter: "blur(1.5px)"
            }}
            >
            <defs>
                <linearGradient id="techLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00ffe7" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7f5fff" stopOpacity="0.10" />
                </linearGradient>
                <radialGradient id="techGlow" cx="0.7" cy="0.2" r="1">
                <stop offset="0%" stopColor="#00ffe7" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#232526" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* Diagonal lines */}
            <g>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#techGlow)" />
                <line x1="30" y1="0" x2="440" y2="110" stroke="url(#techLine)" strokeWidth="1.5" />
                <line x1="0" y1="40" x2="420" y2="150" stroke="url(#techLine)" strokeWidth="1" />
                <line x1="80" y1="0" x2="520" y2="180" stroke="url(#techLine)" strokeWidth="1" />
                <line x1="0" y1="100" x2="420" y2="220" stroke="url(#techLine)" strokeWidth="1" />
            </g>
            {/* Dots */}
            <circle cx="60" cy="30" r="2.5" fill="#00ffe7" opacity="0.22" />
            <circle cx="380" cy="80" r="2" fill="#7f5fff" opacity="0.18" />
            <circle cx="200" cy="120" r="1.5" fill="#00ffe7" opacity="0.13" />
            <circle cx="320" cy="40" r="2" fill="#7f5fff" opacity="0.16" />
            </svg>
            <div style={{ position: "relative", zIndex: 1 }}>
            {title && (
                <div style={{
                fontWeight: 700,
                marginBottom: 14,
                fontSize: 16,
                color: "#e0eaff",
                textAlign: "center",
                letterSpacing: 0.3,
                textShadow: "0 1px 8px #00ffe7, 0 0px 1px #232526"
                }}>
                {title}
                </div>
            )}
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 22,
                alignItems: "end",
                justifyItems: "center"
                }}
            >
                <div style={{ textAlign: "center" }}>
                <svg ref={barRef} />
                <div style={{
                    fontSize: 11,
                    color: "#a5b4fc",
                    marginTop: 7,
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    textShadow: "0 1px 6px #00ffe7"
                }}>
                    Bar Chart
                </div>
                </div>
                <div style={{ textAlign: "center" }}>
                <svg ref={pieRef} />
                <div style={{
                    fontSize: 11,
                    color: "#a5b4fc",
                    marginTop: 7,
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    textShadow: "0 1px 6px #7f5fff"
                }}>
                    Pie Chart
                </div>
                </div>
                <div style={{ textAlign: "center" }}>
                <svg ref={sparklineRef} />
                <div style={{
                    fontSize: 11,
                    color: "#5eead4",
                    marginTop: 7,
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    textShadow: "0 1px 6px #00ffe7"
                }}>
                    Trend Line
                </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ChartOverlay;