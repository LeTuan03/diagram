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
    gradient1.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
    gradient1.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)');
    gradient1.addColorStop(1, 'rgba(147, 51, 234, 0.05)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(34, 197, 94, 0.6)');
    gradient2.addColorStop(0.5, 'rgba(16, 185, 129, 0.4)');
    gradient2.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, 'rgba(251, 146, 60, 0.6)');
    gradient3.addColorStop(0.5, 'rgba(245, 101, 101, 0.4)');
    gradient3.addColorStop(1, 'rgba(245, 101, 101, 0.05)');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [
          {
            label: 'Desktop Users',
            data: [1200, 800, 1600, 2400, 2800, 2200, 1800],
            backgroundColor: gradient1,
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 3,
            pointBackgroundColor: 'rgb(59, 130, 246)',
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
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 3,
            pointBackgroundColor: 'rgb(34, 197, 94)',
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
            borderColor: 'rgb(251, 146, 60)',
            borderWidth: 3,
            pointBackgroundColor: 'rgb(251, 146, 60)',
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
              callback: function(value) {
                return (value as number).toLocaleString();
              },
            },
          },
          x: {
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
    <div className="relative h-80">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default ModernAreaChart;