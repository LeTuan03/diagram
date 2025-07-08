import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";

type MarkerData = {
  geometry: { type: "Point"; coordinates: [number, number] };
  title: string;
  value: number;
};

const MapWithPins = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);

    // Ẩn watermark
    root._logo?.set("forceHidden", true);

    root.setThemes([am5themes_Animated.new(root)]);

    const map = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "none",
        projection: am5map.geoNaturalEarth1(),
      })
    );

    // Lọc bỏ features null geometry
    const filteredGeoJSON = {
      ...am4geodata_continentsLow,
      features: am4geodata_continentsLow.features
        .filter((feature: any) => feature.geometry !== null)
        .map((feature: any) => ({
          ...feature,
          geometry: feature.geometry as Exclude<typeof feature.geometry, null>,
        })),
    };

    map.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: filteredGeoJSON as any,
        exclude: ["antarctica"],
        fill: am5.color(0xbbbbbb),
      })
    );

    // Point series
    const pointSeries = map.series.push(am5map.MapPointSeries.new(root, {}));
    const colorSet = am5.ColorSet.new(root, { step: 2 });

    pointSeries.bullets.push((root, series, dataItem) => {
      const { value, title } = dataItem.dataContext as MarkerData;

      const container = am5.Container.new(root, {});
      const color = colorSet.next();
      const radius = 15 + (value / 20) * 20;

      container.children.push(
        am5.Circle.new(root, {
          radius,
          fill: color,
          dy: -radius * 2,
        })
      );

      container.children.push(
        am5.Line.new(root, {
          stroke: color,
          height: -40,
          strokeGradient: am5.LinearGradient.new(root, {
            stops: [
              { opacity: 1 },
              { opacity: 1 },
              { opacity: 0 },
            ],
          }),
        })
      );

      container.children.push(
        am5.Label.new(root, {
          text: `${value}%`,
          fill: am5.color(0xffffff),
          fontWeight: "400",
          centerX: am5.p50,
          centerY: am5.p50,
          dy: -radius * 2,
        })
      );

      container.children.push(
        am5.Label.new(root, {
          text: title,
          fill: color,
          fontWeight: "500",
          fontSize: "1em",
          centerY: am5.p50,
          dy: -radius * 2,
          dx: radius,
        })
      );

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Dữ liệu điểm
    const rawData = [
      {
        title: "United States",
        latitude: 39.563353,
        longitude: -99.316406,
        value: 12,
      },
      {
        title: "European Union",
        latitude: 50.896104,
        longitude: 19.160156,
        value: 15,
      },
      {
        title: "Asia",
        latitude: 47.212106,
        longitude: 103.183594,
        value: 8,
      },
      {
        title: "Africa",
        latitude: 11.081385,
        longitude: 21.621094,
        value: 5,
      },
    ];

    rawData.forEach((d) => {
      pointSeries.data.push({
        geometry: {
          type: "Point",
          coordinates: [d.longitude, d.latitude],
        },
        title: d.title,
        value: d.value,
      });
    });

    return () => {
      root.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default MapWithPins;
