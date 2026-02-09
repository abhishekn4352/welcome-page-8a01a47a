import React, { useState, useEffect } from 'react';
import { ChartEmptyState } from './utils/ChartTooltip';
import { CHART_COLORS, formatNumber } from './utils/chartConstants';
import { chartDataService, cleanChartData } from './services/chartDataService';

const HeatmapChart = ({ config = {}, width = 500, height = 350, globalFilters = {} }) => {
  const [data, setData] = useState([]);
  const [xCategories, setXCategories] = useState([]);
  const [yCategories, setYCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config.table) {
      setLoading(true);
      chartDataService.fetchChartData(config, globalFilters)
        .then(result => {
          const cleaned = cleanChartData(result);
          if (cleaned.length > 0) {
            const xCats = [...new Set(cleaned.map(item => item[config.xAxis]))];
            const yCats = [...new Set(cleaned.map(item => item[config.yAxis?.[0] || 'series']))];
            setXCategories(xCats);
            setYCategories(yCats);
            setData(cleaned);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (config.data) {
      const cleaned = cleanChartData(config.data);
      if (cleaned.length > 0) {
        const xCats = [...new Set(cleaned.map(item => item[config.xAxis]))];
        const yCats = [...new Set(cleaned.map(item => item[config.yAxis?.[0] || 'series']))];
        setXCategories(xCats);
        setYCategories(yCats);
        setData(cleaned);
      }
    }
  }, [config, globalFilters]);

  if (loading) return <ChartEmptyState message="Loading chart data..." />;
  if (!data.length) return <ChartEmptyState message="No data to display" />;

  const getColor = (value, max) => {
    const ratio = Math.min(Math.max(value / max, 0), 1);
    const hue = (1 - ratio) * 120; // Red (0) to Green (120)
    return `hsl(${hue}, 80%, 50%)`;
  };

  const maxValue = Math.max(...data.map(d => parseFloat(d.value || 0)));
  const cellSize = Math.min(400 / xCategories.length, 250 / yCategories.length);

  return (
    <div className="w-full h-full overflow-auto flex flex-col" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 p-4">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {yCategories.map((yVal) => (
            <div key={yVal} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ width: 80, fontSize: 11, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
                {yVal}
              </div>
              {xCategories.map((xVal) => {
                const dataPoint = data.find(
                  d => d[config.xAxis] === xVal && d[config.yAxis?.[0] || 'series'] === yVal
                );
                const value = dataPoint ? parseFloat(dataPoint.value || 0) : 0;
                return (
                  <div
                    key={`${xVal}-${yVal}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(value, maxValue),
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 600,
                      color: value > maxValue / 2 ? '#000' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title={`${xVal}, ${yVal}: ${formatNumber(value)}`}
                  >
                    {value > 0 ? formatNumber(value) : '-'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
