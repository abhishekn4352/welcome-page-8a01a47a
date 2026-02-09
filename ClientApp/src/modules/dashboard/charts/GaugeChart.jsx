import React, { useState, useEffect } from 'react';
import { ChartEmptyState } from './utils/ChartTooltip';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { chartDataService, cleanChartData } from './services/chartDataService';

const GaugeChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          if (cleaned.length > 0) {
            const value = parseFloat(cleaned[0][Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0);
            const max = parseFloat(config.max || 100);
            setData({ value, max, label: cleaned[0][config.xAxis] || 'Gauge' });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data && config.data.length > 0) {
      const value = parseFloat(config.data[0][Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0);
      const max = parseFloat(config.max || 100);
      setData({ value, max, label: config.data[0][config.xAxis] || 'Gauge' });
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data) return <ChartEmptyState message="No data to display" />;

  const percentage = (data.value / data.max) * 100;
  const angle = (percentage / 100) * 180 - 90;
  const color = percentage > 75 ? '#10b981' : percentage > 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center" style={{ background: 'hsl(var(--card))' }}>
      <svg width="280" height="200" viewBox="0 0 280 200" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        {/* Gauge Arc Background */}
        <path
          d="M 40 160 A 120 120 0 0 1 240 160"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Gauge Arc Progress */}
        <path
          d="M 40 160 A 120 120 0 0 1 240 160"
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 376.99} 376.99`}
          style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
        />

        {/* Gauge Needle */}
        <g transform={`rotate(${angle} 140 160)`}>
          <circle cx="140" cy="160" r="6" fill={color} />
          <line x1="140" y1="160" x2="140" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Center Circle */}
        <circle cx="140" cy="160" r="8" fill="hsl(var(--card))" stroke={color} strokeWidth="2" />

        {/* Value Text */}
        <text x="140" y="185" textAnchor="middle" fontSize="20" fontWeight="700" fill="hsl(var(--foreground))">
          {formatNumber(data.value)}
        </text>
        <text x="140" y="200" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">
          of {formatNumber(data.max)}
        </text>
      </svg>

      <div className="text-center mt-4">
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'hsl(var(--foreground))' }}>{data.label}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default GaugeChart;
