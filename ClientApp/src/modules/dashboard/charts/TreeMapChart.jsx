import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  Treemap as RechartsTreemap,
  Tooltip,
} from 'recharts';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData } from './services/chartDataService';

const TreeMapChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const formatted = cleaned.map((item, i) => ({
            name: item[config.xAxis] || `Item ${i}`,
            value: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0),
            fill: CHART_COLORS[i % CHART_COLORS.length],
          }));
          setData(formatted);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const formatted = cleaned.map((item, i) => ({
        name: item[config.xAxis] || `Item ${i}`,
        value: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0),
        fill: CHART_COLORS[i % CHART_COLORS.length],
      }));
      setData(formatted);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const CustomizedContent = (props) => {
    const { x, y, width, height, name, value } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={props.fill || CHART_COLORS[0]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={2}
          rx={4}
        />
        {width > 40 && height > 40 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontWeight="600"
              fontSize="12"
              dy=".3em"
            >
              {name?.substring(0, 12)}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="11"
              dy=".3em"
            >
              {formatNumber(value)}
            </text>
          </>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      return (
        <div style={{ background: 'hsl(var(--popover))', padding: '8px 12px', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: 12 }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'hsl(var(--popover-foreground))' }}>{payload[0].payload.name}</p>
          <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>{formatNumber(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            data={data}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--border))"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreeMapChart;
