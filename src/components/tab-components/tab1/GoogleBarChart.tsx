import React from 'react';
import { Chart } from 'react-google-charts';

interface GoogleBarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
}

export const GoogleBarChart: React.FC<GoogleBarChartProps> = ({ data, title }) => {
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
    bar: {
      groupWidth: '75%'
    }
  };

  return (
    <div className=" backdrop-blur-sm  rounded-xl p-6">
      <div className="h-80">
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="100%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};