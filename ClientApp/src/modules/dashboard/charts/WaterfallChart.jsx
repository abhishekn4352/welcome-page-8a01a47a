import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart as RechartsComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, AXIS_PROPS, CHART_MARGINS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData, aggregateChartData } from './services/chartDataService';

const WaterfallChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const formatted = cleaned.map((item, i) => {
            const value = parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0);
            return {
              name: item[config.xAxis] || `Item ${i}`,
              value: value,
              range: [0, value],
            };
          });

          // Calculate cumulative values
          let cumulative = 0;
          const withCumulative = formatted.map(item => {
            const start = cumulative;
            const end = cumulative + item.value;
            cumulative = end;
            return { ...item, range: [start, end] };
          });

          setData(withCumulative);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const formatted = cleaned.map((item, i) => {
        const value = parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0);
        return {
          name: item[config.xAxis] || `Item ${i}`,
          value: value,
          range: [0, value],
        };
      });

      let cumulative = 0;
      const withCumulative = formatted.map(item => {
        const start = cumulative;
        const end = cumulative + item.value;
        cumulative = end;
        return { ...item, range: [start, end] };
      });

      setData(withCumulative);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  return (
    <svg viewBox="0 0 500 350" style={{ width: '100%', height: '100%', background: 'hsl(var(--card))' }}>
      <defs>
        {CHART_COLORS.map((color, i) => (
          <linearGradient key={i} id={`waterfallGrad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        ))}
      </defs>

      {/* Y-axis */}
      <line x1="60" y1="20" x2="60" y2="320" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* X-axis */}
      <line x1="60" y1="320" x2="490" y2="320" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* Bars */}
      {data.map((item, i) => {
        const barWidth = (430 / data.length) * 0.85;
        const barX = 60 + (i * (430 / data.length)) + (430 / data.length - barWidth) / 2;
        const maxRange = Math.max(...data.map(d => d.range[1]));
        const barHeight = (item.range[1] - item.range[0]) / maxRange * 280;
        const barY = 320 - barHeight;

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={`url(#waterfallGrad-${i % CHART_COLORS.length})`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              rx="4"
            />

            {/* Connector Line (if not last) */}
            {i < data.length - 1 && (
              <line
                x1={barX + barWidth}
                y1={barY}
                x2={60 + ((i + 1) * (430 / data.length))}
                y2={320 - ((data[i + 1].range[1] - data[i + 1].range[0]) / maxRange * 280)}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            )}

            {/* Label */}
            <text
              x={barX + barWidth / 2}
              y="335"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="hsl(var(--foreground))"
            >
              {item.name.substring(0, 8)}
            </text>

            {/* Value */}
            <text
              x={barX + barWidth / 2}
              y={barY - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="hsl(var(--foreground))"
            >
              {formatNumber(item.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default WaterfallChart;
