import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

const data = [
  { id: "US", name: "United States", threatened: 10, updated: 15 },
  { id: "CN", name: "China", threatened: 40, updated: 35 },
  { id: "VN", name: "Vietnam", threatened: 50, updated: 45 },
  { id: "KH", name: "Cambodia", threatened: 55, updated: 49 },
  { id: "EU", name: "European Union", threatened: 30, updated: 20 },
  { id: "BD", name: "Bangladesh", threatened: 38, updated: 37 },
  { id: "LK", name: "Sri Lanka", threatened: 48, updated: 44 },
  { id: "IN", name: "India", threatened: 25, updated: 26 }
];

// Tạo theme riêng
function createCustomTheme(root: am5.Root) {
  const theme = am5.Theme.new(root);
  theme.rule("InterfaceColors").setAll({
    primaryButton: am5.color(0xc83830),
    primaryButtonHover: am5.Color.lighten(am5.color(0xc83830), 0.2),
    primaryButtonDown: am5.Color.lighten(am5.color(0xc83830), -0.2),
    primaryButtonActive: am5.color(0xd9cec8)
  });
  theme.rule("Label").setAll({ fontSize: "0.8em" });
  return theme;
}

// Tạo polygon series
function createPolygonSeries(root: am5.Root, chart: am5map.MapChart, valueField: string) {
  const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      valueField,
      calculateAggregates: true,
      exclude: ["AQ"]
    })
  );
  polygonSeries.data.setAll(data);
  polygonSeries.set("heatRules", [
    {
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xd3a29f),
      max: am5.color(0x6f0600),
      key: "fill"
    }
  ]);
  polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}: {value}%",
    stroke: am5.color(0xffffff),
    strokeWidth: 0.5,
    interactive: true
  });
  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0xff6600)
  });
  return polygonSeries;
}

// Tạo heat legend
function createHeatLegend(root: am5.Root, chart: am5map.MapChart) {
  const heatLegend = chart.children.push(
    am5.HeatLegend.new(root, {
      orientation: "vertical",
      startColor: am5.color(0xd3a29f),
      endColor: am5.color(0x6f0600),
      startText: "Lowest",
      endText: "Highest",
      stepCount: 8,
      x: am5.p100,
      centerX: am5.p100,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20
    })
  );
  heatLegend.startLabel.setAll({
    fontSize: 12,
    fill: heatLegend.get("startColor")
  });
  heatLegend.endLabel.setAll({
    fontSize: 12,
    fill: heatLegend.get("endColor")
  });
  return heatLegend;
}

const ReciprocalTariffsMap = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;
    const root = am5.Root.new(chartRef.current);

    // Ẩn watermark amCharts 5
    root._logo?.set("forceHidden", true);

    root.setThemes([am5themes_Animated.new(root), createCustomTheme(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, { projection: am5map.geoMercator() })
    );

    // Thêm lưới kinh tuyến, vĩ tuyến
    const graticuleSeries = chart.series.unshift(
      am5map.GraticuleSeries.new(root, { step: 10 })
    );
    graticuleSeries.mapLines.template.set("strokeOpacity", 0.05);

    // Polygon series và heat legend
    let polygonSeries = createPolygonSeries(root, chart, "threatened");
    let heatLegend = createHeatLegend(root, chart);

    polygonSeries.mapPolygons.template.events.on("pointerover", function (ev) {
      const dataItem = ev.target.dataItem;
      const valueField = polygonSeries.get("valueField");
      let value: number | undefined = undefined;
      if (typeof valueField === "string") {
        const dataContext = dataItem?.dataContext as { [key: string]: any } | undefined;
        value = dataContext?.[valueField];
      }
      if (typeof value === "number") {
        heatLegend.showValue(value);
      }
    });

    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });

    // Switch projection
    const cont = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: am5.percent(15),
        centerX: 0,
        y: am5.percent(100),
        dy: -40
      })
    );
    cont.children.push(am5.Label.new(root, { centerY: am5.p50, text: "Map" }));
    const switchButton = cont.children.push(
      am5.Button.new(root, {
        themeTags: ["switch"],
        centerY: am5.p50,
        icon: am5.Circle.new(root, { themeTags: ["icon"] })
      })
    );
    cont.children.push(am5.Label.new(root, { centerY: am5.p50, text: "Globe" }));

    switchButton.on("active", () => {
      if (!switchButton.get("active")) {
        chart.set("projection", am5map.geoMercator());
        chart.set("panY", "translateY");
        chart.set("rotationY", 0);
        polygonSeries.set("exclude", ["AQ"]);
      } else {
        chart.set("projection", am5map.geoOrthographic());
        chart.set("panY", "rotateY");
        chart.set("panX", "rotateX");
        polygonSeries.set("exclude", []);
        chart.animate({
          key: "rotationX",
          to: (chart.get("rotationX") ?? 0) + 360,
          duration: 15000,
          easing: am5.ease.inOut(am5.ease.cubic)
        });
      }
    });

    // Switch dữ liệu
    const cont2 = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: am5.percent(85),
        centerX: am5.p100,
        y: am5.percent(100),
        dy: -40
      })
    );
    cont2.children.push(am5.Label.new(root, { centerY: am5.p50, text: "Threatened" }));
    const switchButton2 = cont2.children.push(
      am5.Button.new(root, {
        themeTags: ["switch"],
        centerY: am5.p50,
        icon: am5.Circle.new(root, { themeTags: ["icon"] })
      })
    );
    cont2.children.push(am5.Label.new(root, { centerY: am5.p50, text: "Updated" }));

    switchButton2.on("active", () => {
      const field = switchButton2.get("active") ? "updated" : "threatened";
      polygonSeries.set("valueField", field);
      polygonSeries.data.setAll(data);
    });

    return () => {
      root.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default ReciprocalTariffsMap;
