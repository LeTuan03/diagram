import React from 'react';
import { Chart } from 'react-google-charts';

interface GooglePieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
}

export const GooglePieChart: React.FC<GooglePieChartProps> = ({ data, title }) => {
  const chartData = [
    ['Category', 'Value'],
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
    pieHole: 0.4,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    legend: {
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      },
      position: 'bottom'
    },
    pieSliceTextStyle: {
      color: '#ffffff',
      fontSize: 12
    },
    tooltip: {
      textStyle: {
        color: '#000000',
        fontSize: 12
      }
    }
  };

  return (
    <div className=" backdrop-blur-sm rounded-xl p-6">
      <div className="h-80">
        <Chart
          chartType="PieChart"
          width="100%"
          height="100%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};