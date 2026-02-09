import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, GRADIENT_COLORS, AXIS_PROPS, CHART_MARGINS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData, aggregateChartData } from './services/chartDataService';

const AreaChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        .catch(err => {
          setError('Failed to load data');
          setLoading(false);
        });
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      if (cleaned.length > 0) {
        const firstItem = cleaned[0];
        const keys = Object.keys(firstItem);
        const nameKey = config.xAxis || 'name';
        const valueKeys = Array.isArray(config.yAxis) ? config.yAxis : keys.filter(k => k !== nameKey && typeof firstItem[k] === 'number');
        const aggregated = aggregateChartData(cleaned, nameKey, valueKeys);
        setData(aggregated);
        setDataKeys(valueKeys);
      }
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (error) return <ChartEmptyState message={error} />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const gradPrefix = `areaGrad-${config?.id || Math.random().toString(36).slice(2)}`;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          {GRADIENT_COLORS.map(([start, end], i) => (
            <linearGradient key={i} id={`${gradPrefix}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={start} stopOpacity={0.4} />
              <stop offset="100%" stopColor={end} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} vertical={false} />
            <XAxis dataKey="name" tick={AXIS_PROPS.tick} axisLine={false} tickLine={false} />
            <YAxis width={40} tick={AXIS_PROPS.tick} tickFormatter={formatNumber} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.length > 1 && <Legend verticalAlign="top" height={26} />}
            
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                fill={`url(#${gradPrefix}-${i % GRADIENT_COLORS.length})`}
                strokeWidth={2}
                isAnimationActive
                animationDuration={1200}
                name={key}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChart;
