import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


const ColumnsChart: React.FC = () => {
    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
             height: 220,
        },
        title: undefined,
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
            crosshair: true,
            accessibility: {
                description: 'Countries'
            },
             labels: {
                style: {
                    color: '#ffffff',
                    fontSize: '14px'
                }
            },
        },
        yAxis: {
            min: 0,
            title:undefined,
             labels: {
                style: {
                    color: '#ffffff',
                    fontSize: '14px'
                }
            },
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: 'var(--highcharts-background-color, #ffffff)',
            shadow: true,
            // label:
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: 'Corn',
                type: 'column',
                data: [387749, 280000, 129000, 64300, 54000, 34300]
            },
            {
                name: 'Wheat',
                type: 'column',
                data: [45321, 140000, 10000, 140500, 19500, 113500]
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

export default ColumnsChart;
