import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, AXIS_PROPS, CHART_MARGINS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData } from './services/chartDataService';

const BubbleChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const formatted = cleaned.map(item => ({
            x: parseFloat(item[config.xAxis] || 0),
            y: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0),
            z: parseFloat(item[Array.isArray(config.yAxis) && config.yAxis[1] ? config.yAxis[1] : 'value'] || 10),
            name: item.name || `Point`,
          }));
          setData(formatted);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const formatted = cleaned.map(item => ({
        x: parseFloat(item[config.xAxis] || 0),
        y: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 0),
        z: parseFloat(item[Array.isArray(config.yAxis) && config.yAxis[1] ? config.yAxis[1] : 'value'] || 10),
        name: item.name || 'Point',
      }));
      setData(formatted);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} />
            <XAxis dataKey="x" tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <YAxis dataKey="y" tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            
            <Scatter
              name="Bubbles"
              data={data}
              fill={CHART_COLORS[0]}
              isAnimationActive
              animationDuration={1200}
            />
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground text-right px-4 py-2 border-t border-border/30">
        Bubble size represents the third dimension
      </div>
    </div>
  );
};

export default BubbleChart;
