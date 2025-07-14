import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import mapModule from "highcharts/modules/map.js";
import TinhTest_v2 from "../tab5/geoData/TinhTest_v2.json";
import Phuongxa8TinhNamBo_WGS84_v2 from "../tab5/geoData/phuongxa8TinhNamBo_WGS84_v2.json";
import { FaMapMarkerAlt, FaTimes, FaUser } from "react-icons/fa";

mapModule(Highcharts);

const Tab7: React.FC = () => {
  const chartRef = useRef<any>(null);
  const [zoomRatio, setZoomRatio] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;

    const updateZoomRatio = () => {
      if (chart.mapView && chart.mapView.zoom != null) {
        const ratio = parseFloat(chart.mapView.zoom.toFixed(2));
        setZoomRatio(ratio);
      }
    };

    updateZoomRatio();
    Highcharts.addEvent(chart, "redraw", updateZoomRatio);
    return () => {
      Highcharts.removeEvent(chart, "redraw", updateZoomRatio);
    };
  }, []);

  const useDetailedMap = zoomRatio !== null && zoomRatio > 9;
  const joinKey = useDetailedMap ? "Ten" : "TenTinh";
  const currentMap: any = useDetailedMap ? Phuongxa8TinhNamBo_WGS84_v2 : TinhTest_v2;

  const currentData = currentMap.features.map((feature: any, index: number) => ({
    [joinKey]: feature.properties?.[joinKey],
    code: index,
    value: Math.floor(Math.random() * 100),
  }));

  const options: Highcharts.Options = {
    chart: {
      map: currentMap as any,
      backgroundColor: "#1e293b",
      height: 800,
      events: {
        click: () => setSelectedPoint(null),
      },
    },
    title: undefined,
    mapNavigation: {
      enabled: true,
      enableDoubleClickZoomTo: false,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: 0,
      minColor: "#E8F5E8",
      maxColor: "#4CAF50",
    },
    tooltip: {
      enabled: false,
    },
    series: [
      {
        type: "map",
        name: "",
        data: currentData,
        joinBy: joinKey,
        states: {
          hover: {
            color: "#FFEB3B",
            borderColor: "#FF9800",
            borderWidth: 2,
          },
          select: {
            color: "#FF5722",
          },
        },
        dataLabels: {
          enabled: false,
          format: `{point.${joinKey}}`,
          style: {
            fontSize: "10px",
            fontWeight: "normal",
          },
        },
        borderColor: "#333",
        borderWidth: 0.5,
        allowPointSelect: true,
        cursor: "pointer",
        point: {
          events: {
            click: function (this: any, e: any) {
            //   e.originalEvent.stopPropagation();
              setSelectedPoint({
                name: this?.[joinKey] || "Unknown",
                value: this?.value || 0,
                code: this?.code,
                x: e?.chartX,
                y: e?.chartY,
              });
            },
          },
        },
      },
    ],
  };

  return (
    <div style={{ position: "relative" }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType="mapChart"
        options={options}
        containerProps={{ style: { width: "100%" } }}
        ref={chartRef}
      />
      {selectedPoint && (
        <div
          style={{
            position: "absolute",
            top: selectedPoint.y + 20,
            left: selectedPoint.x,
            zIndex: 1000,
            background: "rgba(30,41,59,0.98)",
            color: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
            padding: "18px 24px",
            minWidth: 180,
            fontFamily: "Inter, sans-serif",
            border: "1px solid #334155",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt color="#6C63FF" />
            <span className="font-semibold text-lg">{selectedPoint.name}</span>
            <button
              className="ml-auto text-slate-400 hover:text-red-400"
              onClick={(e) => {
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
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <FaUser color="#00b894" />
            <span>
              Giá trị: <b>{selectedPoint.value}</b>
            </span>
          </div>
          <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
            <span>
              Mã: <b>{selectedPoint.code}</b>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tab7;
