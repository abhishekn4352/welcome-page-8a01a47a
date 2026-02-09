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

const ComposedChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const valueKeys = Array.isArray(config.yAxis) ? config.yAxis : [config.yAxis || 'value'];
          const aggregated = aggregateChartData(cleaned, config.xAxis, valueKeys);
          setData(aggregated);
          setDataKeys(valueKeys);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const valueKeys = Array.isArray(config.yAxis) ? config.yAxis : [config.yAxis || 'value'];
      const aggregated = aggregateChartData(cleaned, config.xAxis, valueKeys);
      setData(aggregated);
      setDataKeys(valueKeys);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsComposedChart data={data} margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} vertical={false} />
            <XAxis dataKey="name" tick={AXIS_PROPS.tick} axisLine={false} tickLine={false} />
            <YAxis width={40} tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend verticalAlign="top" height={26} />
            
            {dataKeys.map((key, i) =>
              i === 0 ? (
                <Bar key={key} dataKey={key} fill={CHART_COLORS[i]} name={key} isAnimationActive animationDuration={1200} />
              ) : (
                <Line key={key} dataKey={key} stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} name={key} isAnimationActive animationDuration={1200} />
              )
            )}
          </RechartsComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComposedChart;
