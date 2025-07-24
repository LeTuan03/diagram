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

const ModernAreaChart: React.FC = () => {
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

    // Create gradients for area chart
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(0, 128, 192, 0.6)');
    gradient1.addColorStop(0.5, 'rgba(0, 128, 192, 0.3)');
    gradient1.addColorStop(1, 'rgba(0, 128, 192, 0.05)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(90, 200, 90, 0.6)');
    gradient2.addColorStop(0.5, 'rgba(90, 200, 90, 0.3)');
    gradient2.addColorStop(1, 'rgba(90, 200, 90, 0.05)');

    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, 'rgba(100, 116, 139, 0.6)');  // slate-500
    gradient3.addColorStop(0.5, 'rgba(100, 116, 139, 0.3)');
    gradient3.addColorStop(1, 'rgba(100, 116, 139, 0.05)');


    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [
          {
            label: 'Desktop Users',
            data: [1200, 800, 1600, 2400, 2800, 2200, 1800],
            backgroundColor: gradient1,
            borderWidth: 2,
            borderColor: 'rgba(0, 128, 192, 1)',
            pointBackgroundColor: 'rgba(0, 128, 192, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Mobile Users',
            data: [800, 1200, 2000, 1800, 2400, 2600, 2200],
            backgroundColor: gradient2,
            borderWidth: 2,
            borderColor: 'rgba(90, 200, 90, 1)',
            pointBackgroundColor: 'rgba(90, 200, 90, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Tablet Users',
            data: [400, 600, 800, 1200, 1000, 1400, 1100],
            backgroundColor: gradient3,
            borderWidth: 2,
            borderColor: 'rgba(100, 116, 139, 1)',
            pointBackgroundColor: 'rgba(100, 116, 139, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
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
            display: true,
            position: 'top',
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
            displayColors: true,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()} users`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              callback: function (value) {
                return (value as number).toLocaleString();
              },
            },
          },
          x: {
            display: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 2500,
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
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ height: '260px' }}></canvas>
    </div>
  );
};

export default ModernAreaChart;