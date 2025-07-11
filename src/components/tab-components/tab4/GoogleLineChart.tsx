import React from 'react';
import { Chart } from 'react-google-charts';

interface GoogleLineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
}

export const GoogleLineChart: React.FC<GoogleLineChartProps> = ({ data, title }) => {
  const chartData = [
    ['Month', 'Value'],
    ...data.map(item => [item.name, item.value])
  ];

  const options = {
    title: title,
    titleTextStyle: {
      color: '#ffffff',
      fontSize: 18,
      fontName: 'Arial',
      bold: true
    },
    backgroundColor: 'transparent',
    hAxis: {
      textStyle: {
        color: '#ffffff'
      },
      titleTextStyle: {
        color: '#ffffff'
      },
      gridlines: {
        color: 'rgba(59, 130, 246, 0.2)'
      }
    },
    vAxis: {
      textStyle: {
        color: '#ffffff'
      },
      titleTextStyle: {
        color: '#ffffff'
      },
      gridlines: {
        color: 'rgba(59, 130, 246, 0.2)'
      }
    },
    legend: {
      textStyle: {
        color: '#ffffff'
      }
    },
    colors: ['#3b82f6'],
    lineWidth: 3,
    pointSize: 5,
    curveType: 'function'
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
      <div className="h-80">
        <Chart
          chartType="LineChart"
          width="100%"
          height="100%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};