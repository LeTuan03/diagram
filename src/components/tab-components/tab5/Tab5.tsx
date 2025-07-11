import React, { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import dataFake from "./geoData/dataFake.json";
import phuongXaGeojson from "./geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "./geoData/TinhNamBo_WGS84_RanhTinh_v2.json";
import { geoCentroid } from "d3-geo";
import { FeatureCollection, Geometry } from "geojson";
import * as turf from "@turf/turf";
import Supercluster from "supercluster";
import { FaMapMarkerAlt, FaTimes, FaUser } from "react-icons/fa";

type Position = [number, number];

const COLORS = [
  "#6C63FF", "#00B894", "#0984E3", "#FD7272", "#FDCB6E", "#00CEC9", "#D35400"
];

const _markers = [
  {
    "TenTinh": "Cần Thơ", coordinates: [105.495437622000097, 10.325348854000039]
  },
  {
    "TenTinh": "Hồ Chí Minh", coordinates: [106.8466, 10.8634]
  },
  {
    "TenTinh": "An Giang", coordinates: [103.46894836400007, 9.256015778000071]
  },
  {
    "TenTinh": "Cà Mau", coordinates: [104.87905120800005, 8.381584167000023]
  },
  {
    "TenTinh": "Đồng Nai", coordinates: [107.206329346000075, 12.295455933000046]
  },
  {
    "TenTinh": "Đồng Tháp", coordinates: [105.433212280000049, 10.97314262400001]
  },
  {
    "TenTinh": "Tây Ninh", coordinates: [106.043205261000082, 11.778791428000035]
  },
  {
    "TenTinh": "Vĩnh Long", coordinates: [106.414848328000076, 10.326982498000026]
  },
];


const _markersScaled = [
  {
    "TenTinh": "Phường An Đông", coordinates: [106.674016107000057, 10.748681597000029]
  },
  {
    "TenTinh": "Phường An Hội Đông", coordinates: [106.663438494000047, 10.855518486000051]
  },
  {
    "TenTinh": "Phường An Hội Tây", coordinates: [106.640130133000071, 10.844348982000042]
  },
  {
    "TenTinh": "Phường An Khánh", coordinates: [106.750249515000064, 10.803396250000048]
  },
  {
    "TenTinh": "Phường An Lạc", coordinates: [106.611628149000069, 10.758104464000041]
  },
  {
    "TenTinh": "Phường An Nhơn", coordinates: [106.700556908000067, 10.828338429000041]
  },
  {
    "TenTinh": "Phường Tân Lộc", coordinates: [105.599334717000033, 10.239066124000033],
  },
  {
    "TenTinh": "Phường Trung Nhứt", coordinates: [105.515563965000069, 10.265884399000072],
  },
  {
    "TenTinh": "Xã Kế Sách", coordinates: [105.937863061000087, 9.816129570000044],
  },
  {
    "TenTinh": "Xã An Lạc Thôn", coordinates: [105.906036377000078, 9.931975365000028],
  },
  {
    "TenTinh": "Xã Phong Nẫm", coordinates: [105.998748779000039, 9.856869698000025],
  },
];

// Vị trí mẫu cho dân số (populations)
const _populations = [
  {
    name: "Trường học C",
    coordinates: [105.0297, 10.1808],
  },
  {
    name: "Khu dân cư D",
    coordinates: [105.7593, 9.7420],
  },
  {
    name: "Bệnh viện E",
    coordinates: [106.2937, 9.9944],
  }
];

const _populationsScaled = [
  {
    name: "Trường học D",
    coordinates: [103.9913, 10.2707],
  },
  {
    name: "Khu dân cư E",
    coordinates: [105.0177, 9.1522],
  },
  {
    name: "Bệnh viện F",
    coordinates: [105.7372, 9.3670],
  }
];

const Tab5: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(2);
  const [selectedProvince, setSelectedProvince] = useState<{
    name: string;
    coordinates: Position;
    population?: string;
  } | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null);
  const [blink, setBlink] = useState(true);

  // Blink effect for points
  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(interval);
  }, []);

  const displayGeoJSON = useMemo(() => {
    return zoomLevel > 2 ? phuongXaGeojson : tinhGeojson;
  }, [zoomLevel]);

  const displayMarkers = useMemo(() => {
    return zoomLevel > 2 ? _markersScaled : _markers;
  }, [zoomLevel]);

  const displayPopulations = useMemo(() => {
    return zoomLevel > 2 ? _populationsScaled : _populations;
  }, [zoomLevel]);

  // Tính center cho map
  const [initialCenter, setInitialCenter] = useState<[number, number] | null>(null);
  useEffect(() => {
    const fc = displayGeoJSON as FeatureCollection<Geometry>;
    const centerFeature = turf.center(fc);
    const center = centerFeature.geometry.coordinates as [number, number];
    setInitialCenter(center);
  }, [displayGeoJSON]);

  // Cluster points
  const cluster = useMemo(() => {
    const supercluster = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });
    const points = dataFake.map((p: any) => ({
      type: "Feature",
      properties: { ...p },
      geometry: {
        type: "Point",
        coordinates: p.coordinates,
      },
    }));
    supercluster.load(points as any);
    return supercluster;
  }, []);

  // Get clusters for current zoom
  const clusters = useMemo(() => {
    // Map zoomLevel (1-10) to supercluster zoom (0-16)
    const scZoom = Math.round((zoomLevel - 1) * 2);
    return cluster.getClusters(
      [102, 8, 108, 12], // bbox VN
      scZoom
    );
  }, [cluster, zoomLevel]);

  // Random color for each area
  const getAreaColor = (idx: number) => COLORS[idx % COLORS.length];

  // Tooltip floating style
  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 1000,
    background: "rgba(30,41,59,0.98)",
    color: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
    padding: "18px 24px",
    minWidth: 180,
    fontFamily: "Inter, sans-serif",
    pointerEvents: "auto",
    transition: "opacity 0.2s",
    border: "1px solid #334155",
  };

  // Calculate tooltip position
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Handle tooltip position for province
  useEffect(() => {
    if (!selectedProvince) return setTooltipPos(null);
    // Lấy vị trí chuột cuối cùng khi click vào province
    const handleClick = (e: MouseEvent) => {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("click", handleClick, { once: true });
    return () => window.removeEventListener("click", handleClick);
  }, [selectedProvince]);

  // Handle tooltip position for point
  useEffect(() => {
    if (!selectedPoint) return setTooltipPos(null);
    // Lấy vị trí chuột cuối cùng khi click vào point
    const handleClick = (e: MouseEvent) => {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("click", handleClick, { once: true });
    return () => window.removeEventListener("click", handleClick);
  }, [selectedPoint]);

  return (
    <div className="from-slate-900 via-slate-800 to-slate-900 p-2 font-sans relative h-full">
      <div className="flex items-center justify-center h-full w-full">
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
            center={initialCenter ?? undefined}
            zoom={zoomLevel}
            onMoveEnd={({ zoom }) => {
              const clamped = Math.min(Math.max(zoom, 1), 10);
              setZoomLevel(clamped);
            }}
            minZoom={1}
            maxZoom={10}
          // transitionDuration={350}
          >
            <Geographies geography={displayGeoJSON}>
              {({ geographies, projection }) => (
                <>
                  {geographies.map((geo, idx) => {
                    const centroid = geoCentroid(geo);
                    const isHovered = hoveredGeo === geo.rsmKey;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          setSelectedProvince({
                            name:
                              geo.properties?.Ten ||
                              geo.properties?.TenTinh ||
                              "Không rõ",
                            coordinates: centroid,
                            population: geo.properties?.DanSo || "Không rõ",
                          });
                        }}
                        // onMouseEnter={() => setHoveredGeo(geo.rsmKey)}
                        // onMouseLeave={() => setHoveredGeo(null)}
                        style={{
                          default: {
                            fill: getAreaColor(idx),
                            stroke: isHovered ? "#fff" : "#334155",
                            strokeWidth: isHovered ? 2 : 0.7,
                            outline: "none",
                            filter: isHovered
                              ? "drop-shadow(0 0 8px #6366f1cc)"
                              : "none",
                            transition: "all 0.2s",
                          },
                          hover: {
                            fill: "#6366f1",
                            stroke: "#fff",
                            strokeWidth: 2,
                            cursor: "pointer",
                            outline: "none",
                            filter: "drop-shadow(0 0 12px #6366f1cc)",
                          },
                          pressed: {
                            fill: "#6c5ce7",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })}

                  {/* Clustered points */}
                  {clusters.map((cluster: any) => {
                    const [x, y] = projection(cluster.geometry.coordinates) || [0, 0];
                    if (cluster.properties.cluster) {
                      // Cluster point
                      return (
                        <g key={`cluster-${cluster.id}`}>
                          <circle
                            cx={x}
                            cy={y}
                            r={Math.max(15, cluster.properties.point_count * 2)}
                            fill={`url(#clusterGradient)`}
                            stroke="#fff"
                            strokeWidth={2}
                            onClick={() => setZoomLevel((z) => Math.min(z + 2, 10))}
                            style={{
                              cursor: "pointer",
                              filter: blink
                                ? "drop-shadow(0 0 12px #fdcb6e99)"
                                : "drop-shadow(0 0 8px #e1705599)",
                              transform: blink ? "scale(1.08)" : "scale(1)",
                              transition: "all 0.2s",
                            }}
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            style={{
                              fill: "#222",
                              fontWeight: "bold",
                              fontSize: 15,
                              pointerEvents: "none",
                              textShadow: "0 1px 4px #fff8",
                            }}
                          >
                            {cluster.properties.point_count_abbreviated || "0"}
                          </text>
                        </g>
                      );
                    }
                    // Single point
                    return (
                      <g key={`point-${cluster.properties.id}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r={blink ? 10 : 7}
                          fill={`url(#pointGradient)`}
                          stroke="#fff"
                          strokeWidth={2}
                          onClick={() => setSelectedPoint({ ...cluster.properties, x, y })}
                          style={{
                            cursor: "pointer",
                            filter: blink
                              ? "drop-shadow(0 0 10px #00b894cc)"
                              : "drop-shadow(0 0 6px #d35400cc)",
                            transition: "all 0.2s",
                          }}
                        />
                        <FaMapMarkerAlt
                          x={x - 8}
                          y={y - 22}
                          color="#fff"
                          size={18}
                          style={{
                            position: "absolute",
                            pointerEvents: "none",
                            opacity: 0.7,
                          }}
                        />
                        <text
                          x={x}
                          y={y - 16}
                          textAnchor="middle"
                          style={{
                            fill: "#fff",
                            fontSize: `${Math.max(13 / zoomLevel, 9)}px`,
                            pointerEvents: "none",
                            textShadow: "0 1px 4px #0008",
                          }}
                        >
                          {cluster.properties.tong}
                        </text>
                        {/* Tooltip nổi 3D khi chọn */}
                        {selectedPoint && selectedPoint.id === cluster.properties.id && (
                          <foreignObject
                            x={x - 70}
                            y={y - 90}
                            width={140}
                            height={60}
                            style={{ pointerEvents: "none" }}
                          >
                            <div
                              style={{
                                background: "rgba(30,41,59,0.98)",
                                color: "#fff",
                                borderRadius: 14,
                                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37), 0 2px 8px #00b89488",
                                padding: "12px 18px",
                                minWidth: 100,
                                fontFamily: "Inter, sans-serif",
                                border: "1px solid #334155",
                                transform: "translateY(-10px) scale(1.05)",
                                pointerEvents: "auto",
                              }}
                            >
                              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                {selectedPoint.name || "Điểm"}
                              </div>
                              <div style={{ fontSize: 13, color: "#a3e635" }}>
                                Giá trị: <b>{selectedPoint.tong}</b>
                              </div>
                              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                                ID: {selectedPoint.id}
                              </div>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    );

                  })}

                  {/* Gradients */}
                  <defs>
                    <radialGradient id="clusterGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fdcb6e" stopOpacity="1" />
                      <stop offset="100%" stopColor="#e17055" stopOpacity="0.9" />
                    </radialGradient>
                    <radialGradient id="pointGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00b894" stopOpacity="1" />
                      <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0.9" />
                    </radialGradient>
                  </defs>
                </>
              )}
            </Geographies>

            {/* Hiển thị marker cho từng địa điểm từ geojson */}
            {displayMarkers.map(({ TenTinh, coordinates, description }, idx) => (
              <Marker key={TenTinh + idx} coordinates={coordinates}>
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

                <g transform="translate(0, -20)">
                  <rect
                    x={-(TenTinh.length * 4)}
                    y={-10}
                    width={TenTinh.length * 8}
                    height={13}
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
                      textAlign: "center",
                    }}
                  >
                    {TenTinh}
                  </text>
                </g>

                <title>
                  {TenTinh}
                </title>
              </Marker>
            ))}

            {/* Hiển thị marker populations cho từng địa điểm từ geojson */}
            {displayPopulations.map(({ name, coordinates }, idx) => (
              <Marker key={name + idx} coordinates={coordinates}>
                <g
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    const circle = e.currentTarget.querySelector('circle');
                    circle.setAttribute('r', '6');
                    circle.setAttribute('fill', '#00cec9');
                  }}
                  onMouseLeave={(e) => {
                    const circle = e.currentTarget.querySelector('circle');
                    circle.setAttribute('r', '5');
                    circle.setAttribute('fill', 'rgba(0, 184, 148, 0.65)');
                  }}
                >
                  {/* Marker Circle with shadow and smooth transition */}
                  <circle
                    cx={0}
                    cy={0}
                    r={5}
                    fill="rgba(0, 184, 148, 0.65)"
                    stroke="white"
                    strokeWidth={1.8}
                    style={{
                      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <title>{name}</title> {/* Tooltip */}
                  </circle>

                  {/* Coordinates Text */}
                  <text
                    x={0}
                    y={-10}
                    textAnchor="middle"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fill: '#fff',
                      fontWeight: 600,
                      fontSize: 6,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {`${coordinates[0].toFixed(2)},${coordinates[1].toFixed(2)}`}
                  </text>
                </g>
              </Marker>
            ))}

          </ZoomableGroup>
        </ComposableMap>
        {/* Floating Tooltip for Province */}
        {selectedProvince && tooltipPos && (
          <div
            style={{
              ...tooltipStyle,
              // left: tooltipPos.x + 120,
              top: tooltipPos.y + 40,
              opacity: 1,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaMapMarkerAlt color="#6C63FF" />
              <span className="font-semibold text-lg">{selectedProvince.name}</span>
              <button
                className="ml-auto text-slate-400 hover:text-red-400"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedProvince(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <FaMapMarkerAlt color="#00b894" />
              <span>
                Tọa độ: [{selectedProvince.coordinates[0].toFixed(4)}, {selectedProvince.coordinates[1].toFixed(4)}]
              </span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
              <FaUser color="#00b894" />
              <span>
                Số dân: <b>{selectedProvince?.population ?? "Không rõ"}</b>
              </span>
            </div>
            {/* <div className="text-xs text-slate-400 mt-1">Thông tin khu vực</div> */}
          </div>
        )}

        {/* Floating Tooltip for Point */}
        {selectedPoint && tooltipPos && (
          <div
            style={{
              ...tooltipStyle,
              // left: tooltipPos.x + 160,
              top: tooltipPos.y + 60,
              opacity: 1,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaMapMarkerAlt color="#00b894" />
              <span className="font-semibold text-base">{selectedPoint.name || "Điểm"}</span>
              <button
                className="ml-auto text-slate-400 hover:text-red-400"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedPoint(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="text-xs text-slate-300 mb-1">Giá trị: <b>{selectedPoint.tong}</b></div>
            <div className="text-xs text-slate-400">ID: {selectedPoint.id}</div>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default Tab5;
