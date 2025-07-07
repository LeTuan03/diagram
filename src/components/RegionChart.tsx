import React from 'react';
import { Chart } from 'react-google-charts';

interface RegionData {
  region: string;
  value: number;
}

interface RegionChartProps {
  data: RegionData[];
  title: string;
  region?: string;
}

export const RegionChart: React.FC<RegionChartProps> = ({ data, title, region = 'world' }) => {
  // Prepare data for Google GeoChart
  const chartData = [
    ['Region', 'Value'],
    ...data.map(item => [item.region, item.value])
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
    region: region,
    displayMode: 'regions',
    resolution: 'provinces',
    datalessRegionColor: 'rgba(59, 130, 246, 0.1)',
    defaultColor: 'rgba(59, 130, 246, 0.3)',
    colorAxis: {
      colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
      minValue: 0,
      maxValue: Math.max(...data.map(d => d.value))
    },
    legend: {
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      }
    },
    tooltip: {
      textStyle: {
        color: '#000000',
        fontSize: 12
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <div className="h-96">
        <Chart
          chartType="GeoChart"
          width="100%"
          height="100%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};