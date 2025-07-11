import { useMemo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
import phuongXaGeojson from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";

// Danh sách các địa điểm mẫu
const markers = [
    {
        name: "Bệnh viện A",
        coordinates: [106.93732619000005, 11.355454453000069],
        description: "Bệnh viện A phục vụ khu vực phía Đông."
    },
    {
        name: "Cửa hàng B",
        coordinates: [106.700981, 10.776530],
        description: "Cửa hàng B nổi tiếng với các sản phẩm địa phương."
    }
];

const Tab6 = () => {
    const [zoomLevel, setZoomLevel] = useState(2);

    // Chọn geojson phù hợp theo zoomLevel
    const displayGeoJSON = useMemo(() => {
        return zoomLevel > 2 ? phuongXaGeojson : tinhGeojson;
    }, [zoomLevel]);

    // Tính center mặc định (có thể lấy từ geojson hoặc tự xác định)
    const defaultCenter: [number, number] = [106.660172, 10.762622];

    return (
        <ComposableMap
            projection="geoMercator"
            projectionConfig={{
                scale: 5000,
            }}
            width={800}
            height={400}
            style={{ width: "100%", height: "100%" }}
        >
            <ZoomableGroup
                center={defaultCenter}
                zoom={zoomLevel}
                onMoveEnd={({ zoom }) => {
                    const clamped = Math.min(Math.max(zoom, 1), 10);
                    setZoomLevel(clamped);
                }}
                minZoom={1}
                maxZoom={10}
                transitionDuration={350}
            >
                <Geographies geography={displayGeoJSON}>
                    {({ geographies }) =>
                        geographies.map((geo, idx) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={zoomLevel > 1 ? "#EAEAEC" : "#D6D6DA"}
                                stroke="#888"
                                style={{
                                    default: {
                                        outline: "none",
                                        transition: "all 0.2s"
                                    },
                                    hover: {
                                        fill: "#6366f1",
                                        cursor: "pointer",
                                        outline: "none"
                                    },
                                    pressed: {
                                        fill: "#6c5ce7",
                                        outline: "none"
                                    }
                                }}
                            />
                        ))
                    }
                </Geographies>
                {/* Hiển thị marker cho từng địa điểm từ geojson */}
                {markers.map(({ name, coordinates, description }, idx) => (
                    <Marker key={name + idx} coordinates={coordinates}>
                        {/* Marker rất nhỏ */}
                        <g transform="translate(-5, -10)" className="modern-marker">
                            <circle cx="6" cy="5" r="2" fill="#FF5533" opacity={0.85} />
                            <circle className="pulse-circle" cx="6" cy="5" r="2" />
                            <path
                                d="M6 11C8.7 9 10 7 10 5a4 4 0 1 0-8 0c0 2 1.3 4 4 6z"
                                fill="#FF5533"
                                stroke="white"
                                strokeWidth="0.6"
                                opacity={0.95}
                            />
                        </g>

                        {/* Label rất nhỏ */}
                        <g transform="translate(0, -20)">
                            <rect
                                x={-30}
                                y={-10}
                                width={60}
                                height={20}
                                rx={5}
                                ry={5}
                                fill="rgba(255, 255, 255, 0.85)"
                                stroke="#ddd"
                                strokeWidth={0.6}
                                filter="url(#shadow)"
                            />
                            <text
                                x={0}
                                y={-1}
                                textAnchor="middle"
                                style={{
                                    fontFamily: "Inter, system-ui",
                                    fill: "#111",
                                    fontWeight: 500,
                                    fontSize: 8,
                                }}
                            >
                                {name}
                            </text>
                            <text
                                x={0}
                                y={7}
                                textAnchor="middle"
                                style={{
                                    fontFamily: "Inter, system-ui",
                                    fill: "#666",
                                    fontSize: 7,
                                }}
                            >
                                {`[${coordinates[0].toFixed(3)}, ${coordinates[1].toFixed(3)}]`}
                            </text>
                        </g>

                        <title>
                            {name}
                            {description ? `\n${description}` : ""}
                        </title>
                    </Marker>
                ))}
            </ZoomableGroup>
            <style>
                {`
                    .pulse-circle {
                        fill: none;
                        stroke: #ff5533;
                        stroke-width: 2;
                        animation: pulse 2s infinite;
                        opacity: 0.5;
                    }

                    @keyframes pulse {
                        0% {
                            r: 5;
                            opacity: 0.8;
                        }
                        70% {
                            r: 12;
                            opacity: 0;
                        }
                        100% {
                            r: 5;
                            opacity: 0;
                        }
                    }
                `}
            </style>
        </ComposableMap>
    );
};

export default Tab6;
