import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


const BarChart: React.FC = () => {
    const options: Highcharts.Options = {
        chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            height: 220,
        },
          title: undefined,
        // subtitle: {
        //     text: ""
        // },
        xAxis: {
            categories: ['Africa', 'Usa', 'Asia'],
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#ffffff',
                    fontSize: '14px'
                }
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)',
                align: 'high',
                style: {
                    color: '#ffffff',
                    fontSize: '14px'
                }
            },
            labels: {
                overflow: 'justify',
                style: {
                    color: '#ffffff',
                    fontSize: '14px'
                }
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: 'millions'
        },
        plotOptions: {
            bar: {
                borderRadius: '50%',
                dataLabels: {
                    enabled: true
                },
                groupPadding: 0.1
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 0,
            floating: true,
            borderWidth: 1,
            backgroundColor: 'var(--highcharts-background-color, #ffffff)',
            shadow: true,
        },
        series: [
            {
                name: 'Year 1990',
                type: "bar",
                data: [632, 727, 3202]
            },
            {
                name: 'Year 2000',
                type: "bar",
                data: [814, 841, 3714]
            },
            // {
            //     name: 'Year 2021',
            //     type: "bar",
            //     data: [1393, 1031, 4695]
            // }
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

export default BarChart;
