import React, { useState, useEffect } from 'react';
import { ChartEmptyState } from './utils/ChartTooltip';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { chartDataService, cleanChartData } from './services/chartDataService';

const FunnelChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const formatted = cleaned.map((item, i) => ({
            name: item[config.xAxis] || `Stage ${i}`,
            value: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0),
          }));
          setData(formatted.sort((a, b) => b.value - a.value));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const formatted = cleaned.map((item, i) => ({
        name: item[config.xAxis] || `Stage ${i}`,
        value: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0),
      }));
      setData(formatted.sort((a, b) => b.value - a.value));
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const maxValue = Math.max(...data.map(d => d.value));
  const funnelHeight = 300;
  const elementHeight = funnelHeight / data.length;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center" style={{ background: 'hsl(var(--card))' }}>
      <svg width="100%" height="100%" viewBox="0 0 500 350" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <defs>
          {CHART_COLORS.map((color, i) => (
            <linearGradient key={i} id={`funnelGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {data.map((item, i) => {
          const width = (item.value / maxValue) * 380;
          const y = 25 + i * elementHeight;
          const x = (500 - width) / 2;
          const percentage = ((item.value / maxValue) * 100).toFixed(1);

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={width}
                height={elementHeight - 4}
                fill={`url(#funnelGrad-${i % CHART_COLORS.length})`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                rx="4"
              />
              <text x="20" y={y + elementHeight / 2 + 5} fontSize="12" fontWeight="600" fill="hsl(var(--foreground))">
                {item.name}
              </text>
              <text
                x={x + width - 50}
                y={y + elementHeight / 2 + 5}
                fontSize="12"
                fontWeight="600"
                fill="hsl(var(--foreground))"
                textAnchor="end"
              >
                {formatNumber(item.value)} ({percentage}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FunnelChart;
