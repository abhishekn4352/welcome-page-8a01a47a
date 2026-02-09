import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from 'recharts';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { CustomTooltip, ChartEmptyState } from './utils/ChartTooltip';
import { chartDataService, cleanChartData, aggregateChartData } from './services/chartDataService';

const RadarChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
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
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="name" style={{ fontSize: 12, fontWeight: 500 }} />
            <PolarRadiusAxis style={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
            
            {dataKeys.map((key, i) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                fillOpacity={0.35}
                dot={{ r: 4, fill: CHART_COLORS[i % CHART_COLORS.length] }}
                isAnimationActive
                animationDuration={1200}
              />
            ))}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChart;
