import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData } from './services/chartDataService';

const PieChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      setError(null);
      
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const transformed = cleaned.map(item => ({
            name: item[config.xAxis] || 'Unknown',
            value: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis]) || 0,
          })).filter(item => item.value > 0);
          
          setData(transformed);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching chart data:', err);
          setError('Failed to load data');
          setLoading(false);
        });
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const transformed = cleaned.map(item => ({
        name: item[config.xAxis] || 'Unknown',
        value: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis]) || 0,
      })).filter(item => item.value > 0);
      
      setData(transformed);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (error) return <ChartEmptyState message={error} />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="45%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={0}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              animationBegin={0}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip formatter={val => formatNumber(val)} />}
              cursor={false}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: 11, fontWeight: 500 }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground text-right px-4 py-2 border-t border-border/30">
        Total: {formatNumber(total)}
      </div>
    </div>
  );
};

export default PieChart;
