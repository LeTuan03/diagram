import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import type { GeoJSON } from "geojson";

const geoJSON: GeoJSON = am5geodata_continentsLow as unknown as GeoJSON;

interface ChartDataContext {
    title: string;
    data: {
        width: number;
        height: number;
        title: string;
        pieData: { category: string; value: number }[];
    };
}

const MapWithPieCharts = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!chartRef.current) return;

        const root = am5.Root.new(chartRef.current);

        // Ẩn watermark
        root._logo?.set("forceHidden", true);

        root.setThemes([am5themes_Animated.new(root)]);

        // Create MapChart
        const map = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "none",
                projection: am5map.geoNaturalEarth1()
            })
        );

        // Polygon series
        map.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: geoJSON,
                exclude: ["antarctica"],
                fill: am5.color(0xbbbbbb)
            })
        );

        // Point series (for pie charts)
        const pointSeries = map.series.push(
            am5map.MapPointSeries.new(root, {})
        );

        // Add pie chart bullets
        pointSeries.bullets.push((root, series, dataItem) => {
            const chartData = (dataItem.dataContext as ChartDataContext).data;

            const pieChart = root.container.children.push(am5percent.PieChart.new(root, {
                width: chartData.width,
                height: chartData.height,
                radius: am5.p100,
                centerX: am5.p50,
                centerY: am5.p50
            }));

            const pieSeries = pieChart.series.push(am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category"
            }));

            pieSeries.labels.template.set("forceHidden", true);
            pieSeries.ticks.template.set("forceHidden", true);
            pieSeries.data.setAll(chartData.pieData);

            return am5.Bullet.new(root, {
                sprite: pieChart
            });
        });

        // Add label bullets
        pointSeries.bullets.push((root, series, dataItem) => {
            const chartData = (dataItem.dataContext as ChartDataContext).data;

            return am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                    text: chartData.title,
                    centerX: am5.p50,
                    centerY: am5.p100,
                    dy: chartData.height * -0.5
                })
            });
        });

        // Data
        const charts = [
            {
                title: "North America",
                latitude: 39.563353,
                longitude: -99.316406,
                width: 100,
                height: 100,
                pieData: [
                    { category: "Category #1", value: 1200 },
                    { category: "Category #2", value: 500 },
                    { category: "Category #3", value: 765 },
                    { category: "Category #4", value: 260 }
                ]
            },
            {
                title: "Europe",
                latitude: 50.896104,
                longitude: 19.160156,
                width: 50,
                height: 50,
                pieData: [
                    { category: "Category #1", value: 200 },
                    { category: "Category #2", value: 600 },
                    { category: "Category #3", value: 350 }
                ]
            },
            {
                title: "Asia",
                latitude: 47.212106,
                longitude: 103.183594,
                width: 80,
                height: 80,
                pieData: [
                    { category: "Category #1", value: 352 },
                    { category: "Category #2", value: 266 },
                    { category: "Category #3", value: 512 },
                    { category: "Category #4", value: 199 }
                ]
            },
            {
                title: "Africa",
                latitude: 11.081385,
                longitude: 21.621094,
                width: 50,
                height: 50,
                pieData: [
                    { category: "Category #1", value: 200 },
                    { category: "Category #2", value: 300 },
                    { category: "Category #3", value: 599 },
                    { category: "Category #4", value: 512 }
                ]
            }
        ];

        // Push data to pointSeries
        charts.forEach(chart => {
            pointSeries.data.push({
                geometry: {
                    type: "Point",
                    coordinates: [chart.longitude, chart.latitude]
                },
                title: chart.title,
                data: chart
            });
        });

        // Cleanup
        return () => {
            root.dispose();
        };
    }, []);

    return <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default MapWithPieCharts;
