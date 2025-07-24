import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  PolarAreaController,
  Tooltip,
  Legend,
} from 'chart.js';
import { LabelTitleComponent } from '../../../LabelTitle';

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
              'rgba(0, 128, 192, 0.7)',     // Deep Teal
              'rgba(90, 200, 90, 0.7)',     // Olive Green
              'rgba(100, 116, 139, 0.7)',   // Slate Gray
              'rgba(55, 65, 81, 0.7)',      // Dark Graphite
              'rgba(245, 218, 51, 0.7)',    // Cyber Yellow
            ],
            borderColor: [
              'rgba(0, 128, 192, 1)',
              'rgba(90, 200, 90, 1)',
              'rgba(100, 116, 139, 1)',
              'rgba(55, 65, 81, 1)',
              'rgba(245, 218, 51, 1)',
            ],
            hoverBackgroundColor: [
              'rgba(0, 128, 192, 0.9)',
              'rgba(90, 200, 90, 0.9)',
              'rgba(100, 116, 139, 0.9)',
              'rgba(55, 65, 81, 0.9)',
              'rgba(245, 218, 51, 0.9)',
            ],
            borderWidth: 2,
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
    <div className="relative h-45  mt-8">
      <canvas ref={canvasRef} style={{ height: '260px' }}></canvas>
    </div>
  );
};

export default Modern3DPolarChart;