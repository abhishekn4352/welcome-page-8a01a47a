import React, { useState, useCallback } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from 'recharts';
import { Box, Card, CardContent, CardHeader, IconButton, Typography, alpha, useTheme, Fade, Chip, Menu, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Chart color palette matching theme
const CHART_COLORS = [
  '#8b5cf6', // Primary purple
  '#a78bfa', // Light purple
  '#c4b5fd', // Glow purple
  '#6366f1', // Indigo
  '#818cf8', // Light indigo
  '#10b981', // Success green
  '#f59e0b', // Warning amber
  '#ef4444', // Error red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
];

interface ChartDataPoint {
  name: string;
  value?: number;
  value2?: number;
  [key: string]: any;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'area' | 'pie';
  title?: string;
  subtitle?: string;
  dataKeys?: string[];
  height?: number;
  showBrush?: boolean;
  showZoom?: boolean;
  onRefresh?: () => void;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 1.5,
        boxShadow: theme.shadows[8],
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((entry: any, index: number) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: entry.color,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {entry.name}:
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Custom legend component
const CustomLegend = ({ payload, visibleKeys, onToggle }: any) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
      {payload?.map((entry: any, index: number) => (
        <Chip
          key={index}
          label={entry.value}
          size="small"
          variant={visibleKeys.includes(entry.dataKey) ? 'filled' : 'outlined'}
          onClick={() => onToggle(entry.dataKey)}
          sx={{
            cursor: 'pointer',
            bgcolor: visibleKeys.includes(entry.dataKey) 
              ? alpha(entry.color, 0.2) 
              : 'transparent',
            borderColor: entry.color,
            color: visibleKeys.includes(entry.dataKey) 
              ? theme.palette.text.primary 
              : theme.palette.text.secondary,
            '&:hover': {
              bgcolor: alpha(entry.color, 0.3),
            },
            '& .MuiChip-label': {
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            },
          }}
          icon={
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: entry.color,
                ml: 0.5,
              }}
            />
          }
        />
      ))}
    </Box>
  );
};

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type,
  title = 'Chart',
  subtitle,
  dataKeys = ['value'],
  height = 300,
  showBrush = true,
  showZoom = true,
  onRefresh,
}) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(dataKeys);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleLegendToggle = useCallback((dataKey: string) => {
    setVisibleKeys((prev) =>
      prev.includes(dataKey)
        ? prev.filter((k) => k !== dataKey)
        : [...prev, dataKey]
    );
  }, []);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  const chartHeight = isFullscreen ? window.innerHeight - 200 : height * zoomLevel;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: showBrush ? 50 : 20 },
    };

    const gridAndAxis = (
      <>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={alpha(theme.palette.divider, 0.5)}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          axisLine={{ stroke: theme.palette.divider }}
          tickLine={{ stroke: theme.palette.divider }}
        />
        <YAxis
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          axisLine={{ stroke: theme.palette.divider }}
          tickLine={{ stroke: theme.palette.divider }}
        />
        <Tooltip content={<CustomTooltip />} />
        {showBrush && data.length > 10 && (
          <Brush
            dataKey="name"
            height={30}
            stroke={theme.palette.primary.main}
            fill={alpha(theme.palette.primary.main, 0.1)}
          />
        )}
      </>
    );

    switch (type) {
      case 'line':
        return (
          <RechartsLineChart {...commonProps}>
            {gridAndAxis}
            {dataKeys.map((key, index) =>
              visibleKeys.includes(key) && (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[index % CHART_COLORS.length], r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: theme.palette.background.paper }}
                  animationDuration={800}
                />
              )
            )}
            <Legend
              content={(props) => (
                <CustomLegend {...props} visibleKeys={visibleKeys} onToggle={handleLegendToggle} />
              )}
            />
          </RechartsLineChart>
        );

      case 'bar':
        return (
          <RechartsBarChart {...commonProps}>
            {gridAndAxis}
            {dataKeys.map((key, index) =>
              visibleKeys.includes(key) && (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              )
            )}
            <Legend
              content={(props) => (
                <CustomLegend {...props} visibleKeys={visibleKeys} onToggle={handleLegendToggle} />
              )}
            />
          </RechartsBarChart>
        );

      case 'area':
        return (
          <RechartsAreaChart {...commonProps}>
            <defs>
              {dataKeys.map((key, index) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {gridAndAxis}
            {dataKeys.map((key, index) =>
              visibleKeys.includes(key) && (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  fill={`url(#gradient-${key})`}
                  strokeWidth={2}
                  animationDuration={800}
                />
              )
            )}
            <Legend
              content={(props) => (
                <CustomLegend {...props} visibleKeys={visibleKeys} onToggle={handleLegendToggle} />
              )}
            />
          </RechartsAreaChart>
        );

      case 'pie':
        return (
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RechartsPieChart>
        );

      default:
        return null;
    }
  };

  const cardContent = (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          borderRadius: 0,
        }),
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        action={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {showZoom && (
              <>
                <IconButton size="small" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleZoomIn} disabled={zoomLevel >= 2}>
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </>
            )}
            {onRefresh && (
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </Box>
        }
        sx={{
          pb: 0,
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />
      <CardContent sx={{ flex: 1, pt: 1 }}>
        <Box sx={{ height: chartHeight, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  return isFullscreen ? (
    <Fade in={isFullscreen}>
      {cardContent}
    </Fade>
  ) : (
    cardContent
  );
};

export default InteractiveChart;
export { CHART_COLORS };
