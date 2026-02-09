/**
 * Shared Chart Constants and Colors
 * Admin theme with cyan/magenta color scheme
 */

export const CHART_COLORS = [
  'hsl(190, 100%, 50%)', // Cyan - Primary
  'hsl(300, 100%, 50%)', // Magenta - Accent
  'hsl(142, 71%, 45%)',  // Emerald/Green
  'hsl(38, 92%, 50%)',   // Amber/Gold
  'hsl(221, 83%, 53%)',  // Blue
  'hsl(262, 83%, 58%)',  // Violet
  'hsl(0, 84%, 60%)',    // Red
  'hsl(186, 100%, 40%)', // Teal
];

export const GRADIENT_COLORS = [
  ['#3b82f6', '#60a5fa'],    // Bright Blue
  ['#10b981', '#34d399'],    // Emerald Green
  ['#f59e0b', '#fbbf24'],    // Amber Orange
  ['#8b5cf6', '#a78bfa'],    // Purple
  ['#ec4899', '#f472b6'],    // Pink
  ['#06b6d4', '#22d3ee'],    // Cyan
  ['#ef4444', '#f87171'],    // Red
  ['#14b8a6', '#2dd4bf'],    // Teal
];

export const AXIS_PROPS = {
  tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: '500' },
  axisLine: { stroke: 'hsl(var(--border))', strokeWidth: 1.5 },
  tickLine: { stroke: 'hsl(var(--border))', strokeWidth: 1 },
  tickMargin: 12,
  stroke: 'hsl(var(--border))',
};

export const GRID_PROPS = {
  strokeDasharray: '5 5',
  vertical: false,
  stroke: 'hsl(var(--border))',
  opacity: 0.3
};

export const CHART_MARGINS = {
  default: { top: 20, right: 30, left: 30, bottom: 30 },
  large: { top: 25, right: 30, left: 30, bottom: 35 },
  small: { top: 10, right: 10, bottom: 10, left: 10 },
};

export const formatNumber = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value;
};

export const validateChartData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.filter(item => item !== null && item !== undefined);
};
