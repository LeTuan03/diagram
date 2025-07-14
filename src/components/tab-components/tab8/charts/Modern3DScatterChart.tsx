import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, ScatterController, Tooltip, Legend);

const Modern3DScatterChart: React.FC = () => {
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

    // Generate scatter data
    const generateScatterData = (count: number, color: string) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'High Performance',
            data: generateScatterData(30, 'blue'),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            pointRadius: 8,
            pointHoverRadius: 12,
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(59, 130, 246, 0.9)',
          },
          {
            label: 'Medium Performance',
            data: generateScatterData(40, 'green'),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(34, 197, 94, 0.9)',
          },
          {
            label: 'Low Performance',
            data: generateScatterData(20, 'orange'),
            backgroundColor: 'rgba(251, 146, 60, 0.8)',
            borderColor: 'rgb(251, 146, 60)',
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(251, 146, 60, 0.9)',
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
              label: (context) => `${context.dataset.label}: (${context.parsed.x.toFixed(1)}, ${context.parsed.y.toFixed(1)})`,
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Efficiency Score',
              color: 'rgba(255, 255, 255, 0.8)',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quality Score',
              color: 'rgba(255, 255, 255, 0.8)',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
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

export default Modern3DScatterChart;