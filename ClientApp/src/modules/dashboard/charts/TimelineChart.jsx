import React, { useState, useEffect } from 'react';
import { ChartEmptyState } from './utils/ChartTooltip';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { chartDataService, cleanChartData } from './services/chartDataService';

const TimelineChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          const formatted = cleaned.map((item, i) => ({
            date: item[config.xAxis] || `Event ${i}`,
            duration: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 10),
            category: item.category || 'Default',
          }));
          setData(formatted);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      const formatted = cleaned.map((item, i) => ({
        date: item[config.xAxis] || `Event ${i}`,
        duration: parseFloat(item[Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis] || 10),
        category: item.category || 'Default',
      }));
      setData(formatted);
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const maxDuration = Math.max(...data.map(d => d.duration));

  return (
    <div className="w-full h-full overflow-auto flex flex-col p-4" style={{ background: 'hsl(var(--card))' }}>
      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        {/* Vertical Line */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, rgba(0,210,255,0.6) 0%, rgba(255,0,255,0.3) 100%)',
          }}
        />

        {/* Timeline Items */}
        {data.map((item, i) => (
          <div key={i} style={{ marginBottom: 24, position: 'relative' }}>
            {/* Timeline Dot */}
            <div
              style={{
                position: 'absolute',
                left: -30,
                top: 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: CHART_COLORS[i % CHART_COLORS.length],
                border: '3px solid hsl(var(--card))',
                boxShadow: '0 0 12px rgba(0,210,255,0.6)',
              }}
            />

            {/* Content */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 4 }}>
                {item.date}
              </div>
              <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginBottom: 8 }}>
                {item.category}
              </div>

              {/* Duration Bar */}
              <div
                style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(item.duration / maxDuration) * 100}%`,
                    background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`,
                    transition: 'width 0.6s ease-out',
                  }}
                />
              </div>

              <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 6, textAlign: 'right' }}>
                {formatNumber(item.duration)} units
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineChart;
