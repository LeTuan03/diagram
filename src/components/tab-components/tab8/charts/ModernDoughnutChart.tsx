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
              'rgba(59, 130, 246, 0.9)',
              'rgba(34, 197, 94, 0.9)',
              'rgba(251, 146, 60, 0.9)',
              'rgba(168, 85, 247, 0.9)',
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(34, 197, 94)',
              'rgb(251, 146, 60)',
              'rgb(168, 85, 247)',
            ],
            borderWidth: 4,
            hoverOffset: 15,
            spacing: 5,
            hoverBorderWidth: 6,
            hoverBackgroundColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(34, 197, 94, 1)',
              'rgba(251, 146, 60, 1)',
              'rgba(168, 85, 247, 1)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              padding: 20,
              font: {
                size: 13,
                weight: 'bold',
              },
              generateLabels: function(chart) {
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
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
            padding: 12,
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
            borderWidth: 4,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowOffsetY: 8,
          },
        },
      },
    });

    // Add custom shadow effect
    const originalDraw = chartInstanceRef.current.draw;
    chartInstanceRef.current.draw = function() {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      originalDraw.call(this);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-80 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-full p-6">
          <p className="text-4xl font-bold text-white mb-1">100%</p>
          <p className="text-slate-300 text-sm font-medium">Total Users</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-lg"></div>
    </div>
  );
};

export default ModernDoughnutChart;