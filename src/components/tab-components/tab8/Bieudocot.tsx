import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Nạp thêm module 3D & cylinder
import Highcharts3D from "highcharts/highcharts-3d";
import CylinderModule from "highcharts/modules/cylinder";

// Kích hoạt module
Highcharts3D(Highcharts);
CylinderModule(Highcharts);

const CylinderChart: React.FC = () => {
    const options: Highcharts.Options = {
        chart: {
            type: "cylinder",
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            },
            backgroundColor: 'transparent',
            height: 300
        },
        title: undefined,
        plotOptions: {
            cylinder: {
                depth: 25,
                colorByPoint: true,
                pointPadding: 0.2,
                borderWidth: 0,
            }
        },
        xAxis: {
            categories: ["A", "B", "C", "D"],
            labels: {
                skew3d: true,
                style: {
                    fontSize: "16px"
                }
            }
        },
        yAxis: {
            title: {
                text: "Số lượng",
                margin: 20,
            },
        },
        series: [
            {
                type: "cylinder",
                name: "Dữ liệu",
                data: [29, 71, 30]
            }
        ],
        credits: {
            enabled: false
        }
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    );
};

export default CylinderChart;
