import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { LabelTitleComponent } from '../../../LabelTitle';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ModernLineChart: React.FC = () => {
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

    // Create advanced 3D-like gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 128, 192, 0.9)');      // Deep Teal
    gradient.addColorStop(0.4, 'rgba(90, 200, 90, 0.5)');     // Olive Green
    gradient.addColorStop(0.8, 'rgba(100, 116, 139, 0.25)');  // Steel Gray
    gradient.addColorStop(1, 'rgba(100, 116, 139, 0.05)');


    // Create shadow effect
    const shadowGradient = ctx.createLinearGradient(0, 350, 0, 400);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 38000, 42000, 45000],
            backgroundColor: gradient,
            borderWidth: 2, borderColor: 'rgba(0, 128, 192, 1)',
            pointBackgroundColor: 'rgba(0, 128, 192, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(59, 130, 246, 0.8)',
            borderWidth: 2,
            cornerRadius: 15,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            callbacks: {
              label: (context) => `Revenue: $${context.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            position: 'right',
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
              color: 'rgba(255, 255, 255, 0.05)',
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
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 3000,
          easing: 'easeInOutQuart',
        },
        elements: {
          point: {
            hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 4,
          },
        },
      },
    });

    // Add custom shadow effect
    const originalDraw = chartInstanceRef.current.draw;
    chartInstanceRef.current.draw = function () {
      ctx.shadowColor = 'rgba(0, 128, 192, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
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

export default ModernLineChart;