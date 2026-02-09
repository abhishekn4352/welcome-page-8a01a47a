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

const ScatterChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          setData(cleaned);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      setData(cleaned);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const xKey = config.xAxis || 'x';
  const yKey = Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis || 'y';

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} />
            <XAxis dataKey={xKey} tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <YAxis dataKey={yKey} tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            
            <Scatter
              name="Data Points"
              data={data}
              fill={CHART_COLORS[0]}
              isAnimationActive
              animationDuration={1200}
            />
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterChart;
