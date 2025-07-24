import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend);

const ModernDoughnutChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
        datasets: [
          {
            data: [45, 35, 15, 5], 
            backgroundColor: [
              'rgba(0, 128, 192, 0.9)',     // Deep Teal Blue (Desktop)
              'rgba(90, 200, 90, 0.9)',     // Olive Green (Mobile)
              'rgba(100, 116, 139, 0.9)',   // Steel Gray Blue (Tablet)
              'rgba(38, 70, 83, 0.9)',      // Graphite Blue-Green (Other)
            ],
            borderColor: [
              'rgba(0, 128, 192, 1)',
              'rgba(90, 200, 90, 1)',
              'rgba(100, 116, 139, 1)',
              'rgba(38, 70, 83, 1)',
            ],
            hoverBackgroundColor: [
              'rgba(0, 128, 192, 1)',
              'rgba(90, 200, 90, 1)',
              'rgba(100, 116, 139, 1)',
              'rgba(38, 70, 83, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 15,
            spacing: 5,
            hoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              padding: 20,
              font: {
                size: 13,
                weight: 'bold',
              },
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels && data.datasets.length > 0) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${value}%`,
                      fillStyle: data.datasets[0].backgroundColor![i],
                      strokeStyle: data.datasets[0].borderColor![i],
                      lineWidth: 3,
                      pointStyle: 'circle',
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            titleColor: '#fff',
            bodyColor: '#fff',
            cornerRadius: 15,
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            padding: 1,
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`,
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2500,
          easing: 'easeInOutQuart',
        },
        elements: {
          arc: {
            borderWidth: 2,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-45 flex items-center justify-center mt-8">
      <canvas ref={canvasRef} style={{ height: '250px', width: '250px' }}></canvas>
      <div className="absolute inset-0 rounded-lg"></div>
    </div>
  );
};

export default ModernDoughnutChart;