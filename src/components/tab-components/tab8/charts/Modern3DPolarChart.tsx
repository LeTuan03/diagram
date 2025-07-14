import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  PolarAreaController,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, PolarAreaController, Tooltip, Legend);

const Modern3DPolarChart: React.FC = () => {
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
      type: 'polarArea',
      data: {
        labels: ['Marketing', 'Development', 'Sales', 'Support', 'Operations'],
        datasets: [
          {
            data: [40, 30, 25, 35, 20],
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(34, 197, 94, 0.7)',
              'rgba(251, 146, 60, 0.7)',
              'rgba(168, 85, 247, 0.7)',
              'rgba(236, 72, 153, 0.7)',
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(34, 197, 94)',
              'rgb(251, 146, 60)',
              'rgb(168, 85, 247)',
              'rgb(236, 72, 153)',
            ],
            borderWidth: 3,
            hoverBackgroundColor: [
              'rgba(59, 130, 246, 0.9)',
              'rgba(34, 197, 94, 0.9)',
              'rgba(251, 146, 60, 0.9)',
              'rgba(168, 85, 247, 0.9)',
              'rgba(236, 72, 153, 0.9)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            cornerRadius: 10,
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed.r}%`,
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 50,
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              backdropColor: 'transparent',
              stepSize: 10,
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
              circular: true,
            },
            angleLines: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
            pointLabels: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart',
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
    <div className="relative h-80">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default Modern3DPolarChart;