import React, { useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import geojsonData from "../tab5/geoData/phuongxa8TinhNamBo_WGS84.json";
import tinhGeojson from "../tab5/geoData/TinhNamBo_WGS84_RanhTinh_v2.json";
import tinh3Geojson from "../tab5/geoData/Tinh3.json";
import tinh6Geojson from "../tab5/geoData/Tinh6.json";
import ChartOverlay from './ChartOverlay';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface MapConfig {
  zoomScale: number;
  width: number;
  height: number;
}

interface BubbleLocationData {
  name: string;
  value: number;
  coordinates: [number, number];
}

interface FlowData {
  from: string;
  to: string;
  value: number;
}

interface ChartOverlayData {
  x: number;
  y: number;
  data: any[];
  type: 'bar' | 'pie' | 'sparkline';
  title: string;
}

interface GeoFeature {
  properties: {
    Ten?: string;
    TenTinh?: string;
  };
  chartData?: any[];
  chartType?: 'bar' | 'pie' | 'sparkline';
}

// ============================================================================
// CONSTANTS
// ============================================================================
const MAP_CONFIG: MapConfig = {
  zoomScale: 1.2,
  width: 700,
  height: 700,
};

const COLORS = {
  province: '#2a4d69',
  selected: '#fbbf24',
  bubble: '#4ade80',
  location: '#4CAF50',
  flow: '#3b82f6',
  icon: 'red',
  text: 'blue',
  white: '#fff',
} as const;

const CHART_OVERLAY_OFFSET = {
  x: -900,
  y: -500,
} as const;

const STROKE_WIDTH = {
  default: 0.5,
  hover: 2,
  ward: 0.3,
} as const;

// ============================================================================
// DATA
// ============================================================================
const bubbleDataLocation: BubbleLocationData[] = [
  { name: "Vị trí 1", value: 25, coordinates: [106.5, 10.5] },
  { name: "Vị trí 2", value: 18, coordinates: [105.8, 10.8] },
  { name: "Vị trí 3", value: 42, coordinates: [107.2, 11.1] },
  { name: "Vị trí 4", value: 33, coordinates: [106.0, 9.8] },
  { name: "Vị trí 5", value: 67, coordinates: [105.5, 10.2] }
];

const flows: FlowData[] = [
  { from: "Thành phố Hồ Chí Minh", to: "Tỉnh Đồng Nai", value: 50 },
  { from: "Tỉnh An Giang", to: "Tỉnh Cà Mau", value: 30 },
  { from: "Tỉnh Đồng Tháp", to: "Tỉnh Vĩnh Long", value: 40 },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getFeatureName = (feature: GeoFeature): string => {
  return feature.properties.Ten || feature.properties.TenTinh || 'Unknown';
};

const createProjection = (geojson: any, width: number, height: number) => {
  return d3.geoMercator().fitSize([width, height], geojson);
};

const createColorScales = (provinceCount: number, wardCount: number) => ({
  province: d3.scaleSequential(d3.interpolateBlues).domain([0, provinceCount]),
  ward: d3.scaleSequential(d3.interpolateBlues).domain([0, wardCount]),
});

// ============================================================================
// MAP RENDERING CLASS
// ============================================================================
class MapRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private projection: d3.GeoProjection;
  private path: d3.GeoPath;
  private colorScales: ReturnType<typeof createColorScales>;
  private selectedProvince: SVGPathElement | null = null;

  constructor(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    projection: d3.GeoProjection,
    colorScales: ReturnType<typeof createColorScales>
  ) {
    this.svg = svg;
    this.projection = projection;
    this.path = d3.geoPath().projection(projection);
    this.colorScales = colorScales;
  }

  setupArrowMarkers(): void {
    const defs = this.svg.append("defs");
    const arrowMarker = defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 36 36")
      .attr("refX", 18)
      .attr("refY", 18)
      .attr("markerWidth", 18)
      .attr("markerHeight", 18)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .style("fill", COLORS.flow);

    arrowMarker.append("path")
      .attr("d", "M0,0 L36,18 L0,36 L9,18 Z")
      .attr("stroke", "none")
      .attr("fill", COLORS.flow);
  }

  renderProvinceLayer(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    features: GeoFeature[],
    onMouseOver: (event: MouseEvent, d: GeoFeature) => void,
    onMouseOut: () => void
  ): void {
    const provinceLayer = container.append("g").attr("class", "province");

    provinceLayer.selectAll("path")
      .data(features.filter(d => d.properties.TenTinh))
      .enter()
      .append("path")
      .attr("d", this.path as any)
      .attr("fill", (_, i) => this.colorScales.province(i))
      .attr("stroke", COLORS.province)
      .attr("stroke-width", STROKE_WIDTH.default)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr('stroke-width', STROKE_WIDTH.hover);
        onMouseOver(event, d);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr('stroke-width', STROKE_WIDTH.default);
        onMouseOut();
      })
      .on("click", (event) => this.handleFeatureClick(event, this.colorScales.province))
      .attr("data-index", (_, i) => i)
      .append("title")
      .text(d => d.properties.TenTinh || '');
  }

  renderWardLayer(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    features: GeoFeature[],
    onMouseOver: (event: MouseEvent, d: GeoFeature) => void,
    onMouseOut: () => void
  ): void {
    const wardLayer = container.append("g").attr("class", "ward");

    wardLayer.selectAll("path")
      .data(features.filter(d => d.properties.Ten && d.properties.TenTinh))
      .enter()
      .append("path")
      .attr("d", this.path as any)
      .attr("fill", (_, i) => this.colorScales.ward(i))
      .attr("stroke", COLORS.province)
      .attr("stroke-width", STROKE_WIDTH.ward)
      .style("display", "none")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr('stroke-width', STROKE_WIDTH.hover);
        onMouseOver(event, d);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr('stroke-width', STROKE_WIDTH.default);
        onMouseOut();
      })
      .on("click", (event) => this.handleFeatureClick(event, this.colorScales.ward))
      .attr("data-index", (_, i) => i)
      .append("title")
      .text(d => `${d.properties.Ten}, ${d.properties.TenTinh}`);
  }

  private handleFeatureClick(
    event: Event, 
    colorScale: d3.ScaleSequential<string, never>
  ): void {
    if (this.selectedProvince) {
      const prevIndex = +(this.selectedProvince.getAttribute("data-index") || -1);
      if (prevIndex >= 0) {
        d3.select(this.selectedProvince).attr("fill", colorScale(prevIndex));
      }
    }

    d3.select(event.currentTarget as SVGPathElement).attr("fill", COLORS.selected);
    this.selectedProvince = event.currentTarget as SVGPathElement;
  }

  renderBubbles(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    features: GeoFeature[]
  ): void {
    container.selectAll(".bubble")
      .data(features)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", d => {
        const coords = this.projection(d3.geoCentroid(d as any));
        return coords?.[0] || 0;
      })
      .attr("cy", d => {
        const coords = this.projection(d3.geoCentroid(d as any));
        return coords?.[1] || 0;
      })
      .attr("r", 20)
      .attr("fill", COLORS.bubble)
      .attr("opacity", 0.8)
      .attr("stroke", COLORS.white)
      .attr("stroke-width", 1);
  }

  renderLocationIcons(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    features: GeoFeature[]
  ): void {
    const iconGroup = container.selectAll(".icon-group")
      .data(features)
      .enter()
      .append("g")
      .attr("class", "icon-group")
      .attr("transform", d => {
        const coords = this.projection(d3.geoCentroid(d as any));
        return coords ? `translate(${coords[0]}, ${coords[1]})` : "";
      });

    iconGroup.each(function() {
      const group = d3.select(this);
      
      // Create icon
      const icon = group
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", "25px")
        .attr("fill", COLORS.icon)
        .text("📍");

      // Create pulsing aura
      const aura = group
        .append("circle")
        .attr("r", 0)
        .attr("fill", COLORS.icon)
        .attr("opacity", 0.4);

      // Animation functions
      const createPulseAnimation = () => {
        aura
          .attr("r", 0)
          .attr("opacity", 0.4)
          .transition()
          .duration(1500)
          .ease(d3.easeCubicOut)
          .attr("r", 30)
          .attr("opacity", 0)
          .on("end", createPulseAnimation);
      };

      const createBounceAnimation = () => {
        icon
          .attr("transform", "translate(0, 0)")
          .transition()
          .duration(600)
          .ease(d3.easeQuadOut)
          .attr("transform", "translate(0, -10)")
          .transition()
          .duration(600)
          .ease(d3.easeBounceOut)
          .attr("transform", "translate(0, 0)")
          .on("end", createBounceAnimation);
      };

      createPulseAnimation();
      createBounceAnimation();
    });
  }

  renderProvinceLabels(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    features: GeoFeature[]
  ): void {
    container.selectAll(".province-label")
      .data(features)
      .enter()
      .append("text")
      .attr("class", "province-label")
      .attr("x", d => {
        const coords = this.projection(d3.geoCentroid(d as any));
        return coords?.[0] || 0;
      })
      .attr("y", d => {
        const coords = this.projection(d3.geoCentroid(d as any));
        return coords ? coords[1] + 4 : 0;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .text(d => d.properties.TenTinh || '');
  }

  renderLocationBubbles(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    bubbleData: BubbleLocationData[]
  ): void {
    // Render circles
    container.selectAll(".bubble-location")
      .data(bubbleData)
      .enter()
      .append("circle")
      .attr("class", "bubble-location")
      .attr("cx", d => {
        const coords = this.projection(d.coordinates);
        return coords?.[0] || 0;
      })
      .attr("cy", d => {
        const coords = this.projection(d.coordinates);
        return coords?.[1] || 0;
      })
      .attr("r", 10)
      .attr("fill", COLORS.location)
      .attr("opacity", 0.8)
      .attr("stroke", COLORS.white)
      .attr("stroke-width", 2)
      .append("title")
      .text(d => `${d.name}: ${d.value}`);

    // Render value labels
    container.selectAll(".bubble-location-label")
      .data(bubbleData)
      .enter()
      .append("text")
      .attr("class", "bubble-location-label")
      .attr("x", d => {
        const coords = this.projection(d.coordinates);
        return coords?.[0] || 0;
      })
      .attr("y", d => {
        const coords = this.projection(d.coordinates);
        return coords ? coords[1] + 3 : 0;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("fill", COLORS.white)
      .attr("pointer-events", "none")
      .text(d => d.value);
  }

  renderFlowLines(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    flowData: FlowData[],
    features: GeoFeature[]
  ): void {
    // Create centroids map
    const provinceCentroids = new Map<string, [number, number]>();
    features.forEach(feature => {
      const name = getFeatureName(feature);
      const coords = this.projection(d3.geoCentroid(feature as any));
      if (coords) {
        provinceCentroids.set(name, coords as [number, number]);
      }
    });

    // Render flow lines
    container.selectAll(".flow-line")
      .data(flowData)
      .enter()
      .append("path")
      .attr("class", "flow-line")
      .attr("d", d => {
        const from = provinceCentroids.get(d.from);
        const to = provinceCentroids.get(d.to);
        if (!from || !to) return "";

        const midX = (from[0] + to[0]) / 2;
        const midY = (from[1] + to[1]) / 2 - 40;

        return `M${from[0]},${from[1]} Q${midX},${midY} ${to[0]},${to[1]}`;
      })
      .attr("stroke", COLORS.flow)
      .attr("stroke-width", d => Math.max(1, d.value / 10))
      .attr("fill", "none")
      .attr("opacity", 0.9)
      .attr("marker-end", "url(#arrowhead)")
      .append("title")
      .text(d => `${d.from} → ${d.to}: ${d.value}`);
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const MapComponent: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [geojson, setGeojson] = useState<any>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [chartOverlay, setChartOverlay] = useState<ChartOverlayData | null>(null);

  // Memoized data selections
  const displayGeoJSON = useMemo(() => 
    currentZoom > MAP_CONFIG.zoomScale ? geojsonData : tinhGeojson, 
    [currentZoom]
  );

  const colorScales = useMemo(() => 
    createColorScales(
      geojson?.features?.length || 0,
      geojsonData?.features?.length || 0
    ),
    [geojson]
  );

  // Event handlers
  const handleMouseOver = useCallback((event: MouseEvent, d: GeoFeature) => {
    setChartOverlay({
      x: event.pageX + CHART_OVERLAY_OFFSET.x,
      y: event.pageY + CHART_OVERLAY_OFFSET.y,
      data: d.chartData || [],
      type: d.chartType || 'bar',
      title: getFeatureName(d)
    });
  }, []);

  const handleMouseOut = useCallback(() => {
    setChartOverlay(null);
  }, []);

  const handleZoom = useCallback((event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
    const svg = d3.select(svgRef.current);
    const mainGroup = svg.select('g');
    const zoomContainer = svg.select('.zoom-container');
    
    // Apply transform
    mainGroup.attr("transform", event.transform.toString());
    if (!zoomContainer.empty()) {
      zoomContainer.attr('transform', event.transform.toString());
    }

    const zoomLevel = event.transform.k;
    setCurrentZoom(zoomLevel);

    // Toggle layer visibility based on zoom level
    const wardLayer = svg.select('.ward');
    const provinceLayer = svg.select('.province');
    
    if (zoomLevel > MAP_CONFIG.zoomScale) {
      wardLayer.selectAll("path").style("display", "block");
      provinceLayer.selectAll("path").style("display", "none");
    } else {
      wardLayer.selectAll("path").style("display", "none");
      provinceLayer.selectAll("path").style("display", "block");
    }
  }, []);

  // Main rendering effect
  useLayoutEffect(() => {
    // Initialize with tinhGeojson if geojson is not set
    if (!geojson) {
      setGeojson(tinhGeojson);
      return;
    }

    const svg = d3.select(svgRef.current)
      .attr("width", MAP_CONFIG.width)
      .attr("height", MAP_CONFIG.height);

    // Clear previous renders
    svg.selectAll("g").remove();

    // Create projection and renderer
    const projection = createProjection(geojson, MAP_CONFIG.width, MAP_CONFIG.height);
    const renderer = new MapRenderer(svg, projection, colorScales);

    // Setup markers
    renderer.setupArrowMarkers();

    // Create main container group
    const mainGroup = svg.append("g");
    
    // Render map layers
    renderer.renderProvinceLayer(mainGroup, geojson.features || [], handleMouseOver, handleMouseOut);
    renderer.renderWardLayer(mainGroup, geojsonData.features || [], handleMouseOver, handleMouseOut);

    // Setup zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", handleZoom);
    svg.call(zoom);

    // Create zoom container for interactive elements
    const zoomContainer = svg.append("g").attr("class", "zoom-container");
    
    // Render interactive elements
    renderer.renderBubbles(zoomContainer, tinh6Geojson.features || []);
    renderer.renderLocationIcons(zoomContainer, tinh3Geojson.features || []);
    renderer.renderProvinceLabels(zoomContainer, tinhGeojson.features || []);
    renderer.renderLocationBubbles(zoomContainer, bubbleDataLocation);
    renderer.renderFlowLines(zoomContainer, flows, displayGeoJSON.features || []);

  }, [geojson, colorScales, handleMouseOver, handleMouseOut, handleZoom, displayGeoJSON]);

  return (
    <div>
      <svg ref={svgRef} />
      {chartOverlay && (
        <ChartOverlay
          x={chartOverlay.x}
          y={chartOverlay.y}
          title={chartOverlay.title}
        />
      )}
    </div>
  );
};

export default MapComponent;