import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import WidgetNode from '@/modules/dashboard/canvas/components/WidgetNode';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ChartShowcase: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const chartFeatures = [
    'Interactive Tooltips',
    'Responsive Design',
    'Theme Aware',
    'Multiple Chart Types',
    'Real-time Data',
    'Customizable',
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
        px: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Chart Showcase
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Explore interactive visualizations powered by Recharts with smart data handling
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {chartFeatures.map((feature) => (
            <Chip
              key={feature}
              label={feature}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
            },
          }}
        >
          <Tab label="Basic Charts" />
          <Tab label="Advanced Charts" />
          <Tab label="Specialized Charts" />
          <Tab label="New Chart Types" />
        </Tabs>
      </Box>

      {/* Tab 0: Basic Charts */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
          gap: 3,
          mb: 4
        }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-line-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-linechart',
                  title: 'Line Chart - Revenue Trend',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value',
                    xAxisLabel: 'Month',
                    yAxisLabel: 'Revenue ($)',
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.secondary.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.secondary.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-bar-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-barchart',
                  title: 'Bar Chart - Regional Sales',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value',
                    xAxisLabel: 'Region',
                    yAxisLabel: 'Sales ($K)',
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.success.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-pie-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-piechart',
                  title: 'Pie Chart - Customer Distribution',
                  disableHandles: true,
                  config: {
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.info.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-area-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-areachart',
                  title: 'Area Chart - Sales Comparison',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'uv',
                    xAxisLabel: 'Month',
                    yAxisLabel: 'Sales',
                  },
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 1: Advanced Charts */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
          gap: 3,
          mb: 4
        }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.secondary.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.secondary.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-scatter-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-scatterchart',
                  title: 'Scatter Chart - Data Distribution',
                  disableHandles: true,
                  config: {
                    xAxisLabel: 'X Axis Value',
                    yAxisLabel: 'Y Axis Value',
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.info.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-stacked-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-stackedbarchart',
                  title: 'Stacked Bar Chart - Product Sales by Quarter',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxes: ['product1', 'product2', 'product3'],
                    xAxisLabel: 'Quarter',
                    yAxisLabel: 'Sales ($K)',
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.success.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-horizontal-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-horizontalbarchart',
                  title: 'Horizontal Bar Chart - Regional Sales',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value',
                    xAxisLabel: 'Sales ($K)',
                    yAxisLabel: 'Region',
                  },
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 2: Specialized Charts */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
          gap: 3,
          mb: 4
        }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.warning.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.warning.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-radar-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-radarchart',
                  title: 'Radar Chart - Team Performance Analysis',
                  disableHandles: true,
                  config: {
                    xAxis: 'subject',
                    yAxes: ['value', 'performance'],
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.secondary.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.secondary.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-bubble-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-bubblechart',
                  title: 'Bubble Chart - Multi-Dimensional Data',
                  disableHandles: true,
                  config: {
                    xAxisLabel: 'X Dimension',
                    yAxisLabel: 'Y Dimension',
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.info.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-polar-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-polararechart',
                  title: 'Polar Area Chart - Product Performance',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value',
                    yAxisLabel: 'Score',
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.success.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-heatmap-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-heatmapchart',
                  title: 'Heatmap Chart - Intensity Distribution',
                  disableHandles: true,
                  config: {
                    xAxisLabel: 'X Position',
                    yAxisLabel: 'Y Position',
                  },
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 3: New Chart Types */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
          gap: 3,
          mb: 4
        }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-waterfall-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-waterfallchart',
                  title: 'Waterfall Chart - Cumulative Changes',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value'
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.warning.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.warning.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-funnel-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-funnelchart',
                  title: 'Funnel Chart - Conversion Stages',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value'
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.error.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.error.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-gauge-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-gaugechart',
                  title: 'Gauge Chart - Performance Metric',
                  disableHandles: true,
                  config: {
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.info.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-treemap-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-treemapchart',
                  title: 'TreeMap Chart - Hierarchical Data',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxis: 'value'
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.success.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-timeline-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-timelinechart',
                  title: 'Timeline Chart - Project Gantt',
                  disableHandles: true,
                  config: {
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <Box sx={{ 
              width: '100%', 
              height: 380,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.secondary.main, 0.1)}`,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme => `0 8px 30px ${alpha(theme.palette.secondary.main, 0.2)}`,
              }
            }}>
              <WidgetNode
                id="showcase-stackedarea-1"
                isConnectable={false}
                isSelected={false}
                width="100%"
                height={380}
                data={{
                  widgetType: 'widget-stackedareachart',
                  title: 'Stacked Area Chart - Revenue Segments',
                  disableHandles: true,
                  config: {
                    xAxis: 'name',
                    yAxes: ['product1', 'product2', 'product3']
                  },
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </TabPanel>
    </Box>
    );
};

export default ChartShowcase;