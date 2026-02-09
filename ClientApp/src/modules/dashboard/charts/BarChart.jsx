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

/**
 * Bar Chart Component
 * Displays categorical data using rectangular bars with gradients
 * 
 * @component
 * @param {Object} config - Chart configuration
 * @param {Array} config.data - Chart data points
 * @param {string} config.xAxis - X-axis field name
 * @param {string|string[]} config.yAxis - Y-axis field name(s)
 * @param {string} config.xAxisLabel - X-axis label
 * @param {string} config.yAxisLabel - Y-axis label
 * @param {number} width - Chart width
 * @param {number} height - Chart height
 * @param {Object} globalFilters - Applied filters
 * @example
 * <BarChart 
 *   config={{ data: [...], xAxis: 'name', yAxis: 'value' }}
 *   width={500}
 *   height={350}
 * />
 */
const BarChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from backend if API endpoint provided
  useEffect(() => {
    if (config.table) {
      setLoading(true);
      setError(null);
      
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          if (cleaned.length > 0) {
            const firstItem = cleaned[0];
            const keys = Object.keys(firstItem);
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
      // Use provided data
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

  if (loading) {
    return <ChartEmptyState message="Loading chart data..." />;
  }

  if (error) {
    return <ChartEmptyState message={error} />;
  }

  if (!data.length || !dataKeys.length) {
    return <ChartEmptyState message="No data to display" />;
  }

  // Generate gradient definitions
  const gradPrefix = `barGrad-${config?.id || Math.random().toString(36).slice(2)}`;
  const barSize = data.length <= 6 ? 32 : 22;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      {/* SVG Gradients */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          {GRADIENT_COLORS.map(([start, end], i) => (
            <linearGradient key={i} id={`${gradPrefix}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={start} stopOpacity={0.95} />
              <stop offset="100%" stopColor={end} stopOpacity={0.85} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={CHART_MARGINS.large} barCategoryGap="14%">
            <CartesianGrid strokeDasharray="6 6" opacity={0.25} vertical={false} />
            
            <XAxis
              dataKey="name"
              tick={AXIS_PROPS.tick}
              angle={data.length > 6 ? -30 : 0}
              textAnchor={data.length > 6 ? 'end' : 'middle'}
              height={data.length > 6 ? 56 : 32}
              tickMargin={6}
              axisLine={false}
              tickLine={false}
              label={{
                value: config?.xAxisLabel || 'Categories',
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

            <Tooltip content={<CustomTooltip />} cursor={false} />

            {dataKeys.length > 1 && (
              <Legend
                verticalAlign="top"
                height={26}
                wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
              />
            )}

            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                barSize={barSize}
                radius={[10, 10, 0, 0]}
                fill={`url(#${gradPrefix}-${i % GRADIENT_COLORS.length})`}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={1.5}
                opacity={0.95}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
                animationBegin={i * 100}
                name={key}
                activeBar={{
                  opacity: 1,
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25)) brightness(1.05)',
                }}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      {dataKeys.length > 1 && (
        <div className="text-xs text-muted-foreground text-right pr-4 py-2 border-t border-border/30">
          Aggregated values
        </div>
      )}
    </div>
  );
};

export default BarChart;
