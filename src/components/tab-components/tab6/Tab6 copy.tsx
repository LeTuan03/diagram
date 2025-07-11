import React, { useMemo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
import phuongXaGeojson from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";

// Tạo danh sách các địa điểm mẫu từ geojson (lấy centroid và tên)
const getMarkersFromGeojson = (geojson: any) => {
    if (!geojson || !geojson.features) return [];
    return geojson.features.map((feature: any, idx: number) => {
        // Lấy centroid đơn giản cho Polygon/MultiPolygon
        let coordinates = [0, 0];
        if (feature.geometry.type === "Point") {
            coordinates = feature.geometry.coordinates;
        } else if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
            // Tính centroid đơn giản
            const coords = feature.geometry.type === "Polygon"
                ? feature.geometry.coordinates[0]
                : feature.geometry.coordinates[0][0];
            const lon = coords.reduce((sum: number, c: any) => sum + c[0], 0) / coords.length;
            const lat = coords.reduce((sum: number, c: any) => sum + c[1], 0) / coords.length;
            coordinates = [lon, lat];
        }
        return {
            name: feature.properties?.Ten || feature.properties?.TenTinh || `Địa điểm ${idx + 1}`,
            coordinates,
            description: feature.properties?.DanSo
                ? `Dân số: ${feature.properties.DanSo}`
                : ""
        };
    });
};

const Tab6 = () => {
    const [zoomLevel, setZoomLevel] = useState(1);

    // Chọn geojson phù hợp theo zoomLevel
    const displayGeoJSON = useMemo(() => {
        return zoomLevel > 2 ? phuongXaGeojson : tinhGeojson;
    }, [zoomLevel]);

    // Lấy danh sách marker từ geojson hiện tại
    const markers = useMemo(() => getMarkersFromGeojson(displayGeoJSON), [displayGeoJSON]);

    // Tính center mặc định (lấy từ geojson đầu tiên nếu có)
    const defaultCenter: [number, number] =
        markers.length > 0 ? markers[0].coordinates : [106.660172, 10.762622];

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
                        <g
                            className="pulse-marker"
                            fill="none"
                            stroke="#FF5533"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            transform="translate(-12, -24)"
                        >
                            <circle cx="12" cy="10" r="3" />
                            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                        </g>

                        <text
                            y={-18}
                            textAnchor="middle"
                            style={{
                                fontFamily: "system-ui",
                                fill: "#222",
                                fontWeight: "bold",
                                fontSize: 13,
                                textShadow: "0 1px 4px #fff8"
                            }}
                        >
                            {name}
                        </text>
                        <text
                            y={16}
                            textAnchor="middle"
                            style={{
                                fontFamily: "system-ui",
                                fill: "#888",
                                fontSize: 11
                            }}
                        >
                            {`[${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`}
                        </text>
                        {/* Tooltip đơn giản */}
                        <title>
                            {name}
                            {description ? `\n${description}` : ""}
                        </title>
                    </Marker>
                ))}
            </ZoomableGroup>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            transform: translateY(0px);
                            opacity: 1;
                        }
                        50% {
                            transform: translateY(-10px);
                            opacity: 0.6;
                        }
                        }

                        @keyframes draw {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }

                    .pulse-marker {
                        animation: pulse 1.6s infinite ease-in-out;
                    }

                    .pulse-marker path {
                        stroke-dasharray: 100;
                        stroke-dashoffset: 100;
                        animation: draw 2s ease forwards;
                    }
                `}
            </style>
        </ComposableMap>
    );
};

export default Tab6;
