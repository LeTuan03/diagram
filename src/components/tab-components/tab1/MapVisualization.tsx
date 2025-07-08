import React from 'react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
  value: number;
  label: string;
}

interface MapVisualizationProps {
  dataPoints: DataPoint[];
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ dataPoints }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
      <h3 className="text-white text-lg font-semibold mb-4">Regional Data Distribution</h3>
      <div className="relative w-full h-80 bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg overflow-hidden">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Simulated map outline */}
          <path
            d="M 200 100 Q 250 80 300 100 Q 350 120 400 100 Q 450 80 500 100 Q 550 120 600 100 L 600 300 Q 550 280 500 300 Q 450 320 400 300 Q 350 280 300 300 Q 250 320 200 300 Z"
            fill="rgba(59, 130, 246, 0.2)"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {dataPoints.map((point) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={Math.max(8, point.value / 10)}
                fill="rgba(239, 68, 68, 0.8)"
                stroke="rgba(239, 68, 68, 1)"
                strokeWidth="2"
                className="animate-pulse cursor-pointer hover:fill-red-400 transition-colors"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={Math.max(12, point.value / 8)}
                fill="none"
                stroke="rgba(239, 68, 68, 0.3)"
                strokeWidth="1"
                className="animate-ping"
              />
              <text
                x={point.x}
                y={point.y - Math.max(15, point.value / 8)}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                className="font-medium"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};