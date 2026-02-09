import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { CHART_COLORS, GRADIENT_COLORS, AXIS_PROPS, CHART_MARGINS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData, aggregateChartData } from './services/chartDataService';

const LineChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      setError(null);
      
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          if (cleaned.length > 0) {
            const valueKeys = Array.isArray(config.yAxis) 
              ? config.yAxis 
              : [config.yAxis || 'value'];
            
            const aggregated = aggregateChartData(cleaned, config.xAxis, valueKeys);
            setData(aggregated);
            setDataKeys(valueKeys);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching chart data:', err);
          setError('Failed to load data');
          setLoading(false);
        });
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      if (cleaned.length > 0) {
        const firstItem = cleaned[0];
        const keys = Object.keys(firstItem);
        const nameKey = config.xAxis || keys.find(k => k === 'name');
        const valueKeys = Array.isArray(config.yAxis) 
          ? config.yAxis 
          : keys.filter(k => k !== nameKey && typeof firstItem[k] === 'number');

        if (nameKey && valueKeys.length) {
          const aggregated = aggregateChartData(cleaned, nameKey, valueKeys);
          setData(aggregated);
          setDataKeys(valueKeys);
        }
      }
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (error) return <ChartEmptyState message={error} />;
  if (!data.length || !dataKeys.length) return <ChartEmptyState message="No data to display" />;

  const lineStrokeWidth = dataKeys.length > 3 ? 2 : 2.5;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          {GRADIENT_COLORS.map(([start, end], i) => (
            <linearGradient key={i} id={`lineGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={start} stopOpacity={0.3} />
              <stop offset="100%" stopColor={end} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={CHART_MARGINS.large}>
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} vertical={false} />
            <XAxis
              dataKey="name"
              tick={AXIS_PROPS.tick}
              axisLine={false}
              tickLine={false}
              style={{ fontSize: 12 }}
              label={{
                value: config?.xAxisLabel || 'Time',
                position: 'insideBottom',
                offset: -10,
                style: { fontSize: 13, fontWeight: 600, fill: 'hsl(var(--foreground))' },
              }}
            />

            <YAxis
              width={40}
              tick={AXIS_PROPS.tick}
              tickFormatter={formatNumber}
              axisLine={false}
              tickLine={false}
              label={{
                value: config?.yAxisLabel || 'Value',
                angle: -90,
                position: 'insideLeft',
                offset: -12,
                style: { fontSize: 13, fontWeight: 600, fill: 'hsl(var(--foreground))' },
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={true} />

            {dataKeys.length > 1 && (
              <Legend
                verticalAlign="top"
                height={26}
                wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
              />
            )}

            {dataKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={lineStrokeWidth}
                dot={{ r: 3.5, fill: CHART_COLORS[i % CHART_COLORS.length] }}
                activeDot={{ r: 5.5, fill: CHART_COLORS[i % CHART_COLORS.length], filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
                animationBegin={i * 100}
                name={key}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {dataKeys.length > 1 && (
        <div className="text-xs text-muted-foreground text-right pr-4 py-2 border-t border-border/30">
          Multiple series
        </div>
      )}
    </div>
  );
};

export default LineChart;
