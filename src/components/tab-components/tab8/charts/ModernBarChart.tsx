import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { LabelTitleComponent } from '../../../LabelTitle';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const ModernBarChart: React.FC = () => {
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

    // Create advanced 3D gradients
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(0, 128, 192, 1)');         // deep tech teal
    gradient1.addColorStop(0.5, 'rgba(0, 128, 192, 0.6)');
    gradient1.addColorStop(1, 'rgba(0, 128, 192, 0.2)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(90, 200, 90, 1)');          // deep soft green
    gradient2.addColorStop(0.5, 'rgba(90, 200, 90, 0.6)');
    gradient2.addColorStop(1, 'rgba(90, 200, 90, 0.2)');


    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Sales',
            data: [65000, 89000, 73000, 95000],
            backgroundColor: gradient1,
            borderColor: 'rgba(0, 128, 192, 1)',   
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: 'Target',
            data: [70000, 85000, 78000, 92000],
            backgroundColor: gradient2,
            borderColor: 'rgba(90, 200, 90, 1)',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              padding: 20,
              font: {
                size: 13,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(34, 197, 94, 0.8)',
            borderWidth: 1,
            cornerRadius: 5,
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            callbacks: {
              label: (context) => `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              display: false,
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 12,
                weight: 'bold',
              },
              callback: function (value) {
                return '$' + (value as number).toLocaleString();
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
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
        elements: {
          bar: {
            borderSkipped: false,
          },
        },
      },
    });

    // Add custom shadow effect
    const originalDraw = chartInstanceRef.current.draw;
    chartInstanceRef.current.draw = function () {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
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
    <div className="relative ">
      <canvas ref={canvasRef} style={{ height: '260px' }}></canvas>
      <div className="absolute inset-0"></div>
    </div>
  );
};

export default ModernBarChart;