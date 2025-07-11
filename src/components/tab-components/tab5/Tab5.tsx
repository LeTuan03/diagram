import React, { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
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

const Tab5: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
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
    return zoomLevel > 1 ? phuongXaGeojson : tinhGeojson;
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
    const svg = document.querySelector("svg");
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = selectedProvince.coordinates[0];
    pt.y = selectedProvince.coordinates[1];
    // Not using pt.matrixTransform here, so fallback to center
    setTooltipPos({ x: 400, y: 120 });
  }, [selectedProvince]);

  // Handle tooltip position for point
  useEffect(() => {
    if (!selectedPoint) return setTooltipPos(null);
    setTooltipPos({ x: 400, y: 180 });
  }, [selectedPoint]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 font-sans relative">
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
                          console.log(geo);

                          setSelectedProvince({
                            name:
                              geo.properties?.Ten ||
                              geo.properties?.TenTinh ||
                              "Không rõ",
                            coordinates: centroid,
                            population: geo.properties?.DanSo || "Không rõ",
                          });
                        }}
                        onMouseEnter={() => setHoveredGeo(geo.rsmKey)}
                        onMouseLeave={() => setHoveredGeo(null)}
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
          </ZoomableGroup>
        </ComposableMap>
        {/* Floating Tooltip for Province */}
        {selectedProvince && tooltipPos && (
          <div
            style={{
              ...tooltipStyle,
              left: tooltipPos.x + 120,
              top: tooltipPos.y + 40,
              opacity: 1,
            }}
            onClick={() => setSelectedProvince(null)}
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
              left: tooltipPos.x + 160,
              top: tooltipPos.y + 60,
              opacity: 1,
            }}
            onClick={() => setSelectedPoint(null)}
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
    </div>
  );
};

export default Tab5;
