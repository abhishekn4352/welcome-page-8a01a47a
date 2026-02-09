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

const FinancialChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const formatted = cleaned.map(item => ({
            name: item[config.xAxis] || 'Unknown',
            open: parseFloat(item.open || item.value || 0),
            close: parseFloat(item.close || item.value || 0),
            high: parseFloat(item.high || item.value || 0),
            low: parseFloat(item.low || 0),
          }));
          setData(formatted);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const formatted = cleaned.map(item => ({
        name: item[config.xAxis] || 'Unknown',
        open: parseFloat(item.open || item.value || 0),
        close: parseFloat(item.close || item.value || 0),
        high: parseFloat(item.high || item.value || 0),
        low: parseFloat(item.low || 0),
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
          <RechartsComposedChart data={data} margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} vertical={false} />
            <XAxis dataKey="name" tick={AXIS_PROPS.tick} axisLine={false} tickLine={false} />
            <YAxis width={40} tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend verticalAlign="top" height={26} />
            
            <Bar dataKey="open" fill={CHART_COLORS[0]} name="Open" isAnimationActive animationDuration={1200} />
            <Bar dataKey="close" fill={CHART_COLORS[1]} name="Close" isAnimationActive animationDuration={1200} />
            <Line dataKey="high" stroke={CHART_COLORS[2]} strokeWidth={2} dot={{ r: 3 }} name="High" isAnimationActive animationDuration={1200} />
            <Line dataKey="low" stroke={CHART_COLORS[3]} strokeWidth={2} dot={{ r: 3 }} name="Low" isAnimationActive animationDuration={1200} />
          </RechartsComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground text-right px-4 py-2 border-t border-border/30">
        OHLC Financial Data
      </div>
    </div>
  );
};

export default FinancialChart;
