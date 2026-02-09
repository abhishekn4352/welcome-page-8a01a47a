import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, GRADIENT_COLORS, AXIS_PROPS, CHART_MARGINS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData, aggregateChartData } from './services/chartDataService';

const StackedBarChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
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
          <RechartsBarChart data={data} margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} vertical={false} />
            <XAxis dataKey="name" tick={AXIS_PROPS.tick} axisLine={false} tickLine={false} />
            <YAxis width={40} tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend verticalAlign="top" height={26} />
            
            {dataKeys.map((key, i) => (
              <Bar key={key} dataKey={key} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} name={key} isAnimationActive animationDuration={1200} />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;
