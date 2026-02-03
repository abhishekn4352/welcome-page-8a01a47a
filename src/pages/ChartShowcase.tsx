import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
} from '@mui/icons-material';
import InteractiveChart from '@/components/charts/InteractiveChart';
import ResizableWidget from '@/components/charts/ResizableWidget';
import {
  UnifiedChart,
  generateMockData,
  generatePieData,
  ChartType,
} from '@/components/charts';

// Chart configurations
const chartConfigs: { type: 'line' | 'bar' | 'area' | 'pie'; label: string; dataKeys: string[] }[] = [
  { type: 'line', label: 'Revenue Trend', dataKeys: ['value', 'value2'] },
  { type: 'bar', label: 'Sales Comparison', dataKeys: ['value', 'value2'] },
  { type: 'area', label: 'Traffic Analysis', dataKeys: ['value'] },
  { type: 'pie', label: 'Market Share', dataKeys: ['value'] },
  { type: 'line', label: 'User Growth', dataKeys: ['value'] },
  { type: 'bar', label: 'Performance Metrics', dataKeys: ['value', 'value2'] },
];

// Sample data generation
const generateSampleData = () => [
  { name: 'Jan', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'Feb', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'Mar', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'Apr', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'May', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'Jun', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'Jul', value: Math.random() * 5000, value2: Math.random() * 3000 },
  { name: 'Aug', value: Math.random() * 5000, value2: Math.random() * 3000 },
];

const generatePieSampleData = () => [
  { name: 'Product A', value: Math.random() * 100 },
  { name: 'Product B', value: Math.random() * 100 },
  { name: 'Product C', value: Math.random() * 100 },
  { name: 'Product D', value: Math.random() * 100 },
  { name: 'Product E', value: Math.random() * 100 },
];

const ChartShowcase: React.FC = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [timeRange, setTimeRange] = useState('30d');
  const [widgetSizes, setWidgetSizes] = useState<Record<string, { width: number; height: number }>>({});

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'grid' | 'list' | null) => {
    if (newView) setViewMode(newView);
  };

  const handleWidgetResize = (id: string, width: number, height: number) => {
    setWidgetSizes(prev => ({ ...prev, [id]: { width, height } }));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Chart Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Interactive, resizable charts with zoom, brush, and legend controls
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="grid">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ListViewIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Feature Chips */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {['Interactive Tooltips', 'Zoom Controls', 'Brush Selector', 'Legend Toggle', 'Fullscreen Mode', 'Resizable'].map((feature) => (
          <Chip
            key={feature}
            label={feature}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {chartConfigs.map((config, index) => (
          <Grid
            item
            xs={12}
            md={viewMode === 'list' ? 12 : 6}
            lg={viewMode === 'list' ? 12 : 4}
            key={`${config.type}-${index}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <InteractiveChart
                data={config.type === 'pie' ? generatePieSampleData() : generateSampleData()}
                type={config.type}
                title={config.label}
                subtitle={`Data for ${timeRange}`}
                dataKeys={config.dataKeys}
                height={viewMode === 'list' ? 400 : 280}
                showBrush={config.type !== 'pie'}
                showZoom={config.type !== 'pie'}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Resizable Widgets Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Resizable Widgets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag the corners to resize these chart widgets
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {['resizable-1', 'resizable-2'].map((id, index) => (
            <ResizableWidget
              key={id}
              id={id}
              initialWidth={450}
              initialHeight={320}
              minWidth={300}
              minHeight={200}
              onResize={handleWidgetResize}
            >
              <InteractiveChart
                data={generateSampleData()}
                type={index === 0 ? 'area' : 'bar'}
                title={index === 0 ? 'Resizable Area Chart' : 'Resizable Bar Chart'}
                dataKeys={['value', 'value2']}
                height={(widgetSizes[id]?.height || 320) - 80}
                showBrush
              />
            </ResizableWidget>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChartShowcase;
