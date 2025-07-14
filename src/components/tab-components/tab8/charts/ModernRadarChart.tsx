import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  Filler,
  Tooltip,
  Legend
);

const ModernRadarChart: React.FC = () => {
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

    // Create gradient for radar chart
    const gradient1 = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
    gradient1.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient1.addColorStop(1, 'rgba(59, 130, 246, 0.1)');

    const gradient2 = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
    gradient2.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
    gradient2.addColorStop(1, 'rgba(34, 197, 94, 0.1)');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'radar',
      data: {
        labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Innovation'],
        datasets: [
          {
            label: 'Current Performance',
            data: [85, 92, 78, 88, 95, 82],
            backgroundColor: gradient1,
            borderColor: 'rgb(59, 130, 246)',
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
          },
          {
            label: 'Target Performance',
            data: [90, 85, 88, 92, 88, 90],
            backgroundColor: gradient2,
            borderColor: 'rgb(34, 197, 94)',
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
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
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.r}%`,
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              backdropColor: 'transparent',
              stepSize: 20,
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

export default ModernRadarChart;