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
import ResizableChartWidget from '@/components/charts/ResizableChartWidget';
import BubbleChart from '@/components/charts/BubbleChart';
import PolarAreaChart from '@/components/charts/PolarAreaChart';
import TimelineChart from '@/components/charts/TimelineChart';
import WaterfallChart from '@/components/charts/WaterfallChart';
import FinancialChart from '@/components/charts/FinancialChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import MapChart from '@/components/charts/MapChart';
import TodoChart from '@/components/charts/TodoChart';
import {
  generateBubbleData,
  generatePieData,
  generateTimelineData,
  generateWaterfallData,
  generateFinancialData,
  generateHeatmapData,
  generateTodoData,
} from '@/components/charts/mockData';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter,
  ComposedChart,
  Treemap,
  FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

// Color palette
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#3b82f6', '#f59e0b'];

// Mock data generators
const lineData = [
  { name: 'Jan', revenue: 4000, profit: 2400, users: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398, users: 2210 },
  { name: 'Mar', revenue: 2000, profit: 9800, users: 2290 },
  { name: 'Apr', revenue: 2780, profit: 3908, users: 2000 },
  { name: 'May', revenue: 1890, profit: 4800, users: 2181 },
  { name: 'Jun', revenue: 2390, profit: 3800, users: 2500 },
  { name: 'Jul', revenue: 3490, profit: 4300, users: 2100 },
  { name: 'Aug', revenue: 4200, profit: 5200, users: 2800 },
];

const pieData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'Other', value: 100 },
];

const radarData = [
  { subject: 'Sales', A: 120, B: 110, fullMark: 150 },
  { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
  { subject: 'Development', A: 86, B: 130, fullMark: 150 },
  { subject: 'Support', A: 99, B: 100, fullMark: 150 },
  { subject: 'Admin', A: 85, B: 90, fullMark: 150 },
  { subject: 'HR', A: 65, B: 85, fullMark: 150 },
];

const scatterData = [
  { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 },
  { x: 200, y: 350, z: 300 }, { x: 180, y: 220, z: 350 },
];

const treemapData = [
  { name: 'Product A', size: 2400, fill: '#6366f1' },
  { name: 'Product B', size: 4567, fill: '#8b5cf6' },
  { name: 'Product C', size: 1398, fill: '#ec4899' },
  { name: 'Product D', size: 9800, fill: '#f97316' },
  { name: 'Product E', size: 3908, fill: '#10b981' },
  { name: 'Product F', size: 4800, fill: '#06b6d4' },
];

const funnelData = [
  { value: 100, name: 'Visitors', fill: '#6366f1' },
  { value: 80, name: 'Leads', fill: '#8b5cf6' },
  { value: 50, name: 'Qualified', fill: '#ec4899' },
  { value: 30, name: 'Proposals', fill: '#f97316' },
  { value: 20, name: 'Negotiations', fill: '#10b981' },
  { value: 10, name: 'Closed Won', fill: '#06b6d4' },
];

const gaugeData = [
  { name: 'Progress', value: 75, fill: '#6366f1' },
];

const heatmapData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  ...Object.fromEntries(
    Array.from({ length: 24 }, (_, h) => [`h${h}`, Math.floor(Math.random() * 100)])
  ),
}));

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const axisStyle = { 
  fontSize: 11, 
  fill: 'hsl(var(--muted-foreground))' 
};

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
    'Resizable Widgets',
    'All-Edge Handles',
    'Smooth Animations',
    'Theme Aware',
    'Responsive',
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Chart Showcase
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          All chart types with dummy data • Drag edges or corners to resize
        </Typography>
        
        {/* Feature Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {chartFeatures.map((feature) => (
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
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Line & Area" />
          <Tab label="Bar Charts" />
          <Tab label="Pie & Radar" />
          <Tab label="Scatter & Treemap" />
          <Tab label="Funnel & Gauge" />
          <Tab label="Bubble & Polar" />
          <Tab label="Financial & Waterfall" />
          <Tab label="Heatmap & Timeline" />
          <Tab label="Map & Todo" />
        </Tabs>
      </Box>

      {/* Tab 0: Line & Area Charts */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Line Chart - Revenue Trend" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Area Chart - User Growth" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#colorProfit)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ResizableChartWidget title="Stacked Area Chart" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="profit" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 1: Bar Charts */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Bar Chart - Sales Comparison" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Stacked Bar Chart" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="revenue" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="profit" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="users" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ResizableChartWidget title="Horizontal Bar Chart" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis dataKey="name" type="category" tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <ResizableChartWidget title="Composed Chart (Bar + Line)" initialWidth={520} initialHeight={320}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="profit" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 2: Pie & Radar */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Pie Chart - Market Share" initialWidth={400} initialHeight={350}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Doughnut Chart" initialWidth={400} initialHeight={350}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ResizableChartWidget title="Radar Chart - Performance" initialWidth={400} initialHeight={350}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <Radar name="Team A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Team B" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} strokeWidth={2} />
                  <Legend />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 3: Scatter & Treemap */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Scatter Chart - Distribution" initialWidth={520} initialHeight={350}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" dataKey="x" name="X Value" tick={axisStyle} stroke="hsl(var(--border))" />
                  <YAxis type="number" dataKey="y" name="Y Value" tick={axisStyle} stroke="hsl(var(--border))" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
                  <Scatter name="Data Points" data={scatterData} fill="#6366f1">
                    {scatterData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Treemap - Product Distribution" initialWidth={520} initialHeight={350}>
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="hsl(var(--card))"
                  fill="#6366f1"
                >
                  {treemapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 4: Funnel & Gauge */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Funnel Chart - Conversion" initialWidth={450} initialHeight={400}>
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList position="right" fill="hsl(var(--foreground))" fontSize={11} />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Gauge Chart - Progress (75%)" initialWidth={350} initialHeight={280}>
              <div className="flex items-center justify-center h-full">
                <div className="relative">
                  <svg width="200" height="120" viewBox="0 0 200 120">
                    {/* Background arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.75)}
                    />
                    {/* Value text */}
                    <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="32" fontWeight="700">
                      75%
                    </text>
                    <text x="100" y="110" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">
                      Completion Rate
                    </text>
                  </svg>
                </div>
              </div>
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ResizableChartWidget title="Multi Gauge - KPIs" initialWidth={500} initialHeight={280}>
              <div className="flex items-center justify-around h-full p-4">
                {[
                  { label: 'Sales', value: 85, color: '#6366f1' },
                  { label: 'Growth', value: 62, color: '#10b981' },
                  { label: 'Retention', value: 91, color: '#f97316' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <svg width="100" height="60" viewBox="0 0 100 60">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 * (1 - item.value / 100)}
                      />
                      <text x="50" y="48" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="700">
                        {item.value}%
                      </text>
                    </svg>
                    <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 5: Bubble & Polar */}
      <TabPanel value={tabValue} index={5}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget initialWidth={520} initialHeight={350}>
              <BubbleChart data={generateBubbleData()} config={{ title: 'Bubble Chart' }} />
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget initialWidth={450} initialHeight={350}>
              <PolarAreaChart data={generatePieData()} config={{ title: 'Polar Area Chart' }} />
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 6: Financial & Waterfall */}
      <TabPanel value={tabValue} index={6}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget initialWidth={600} initialHeight={350}>
              <FinancialChart data={generateFinancialData()} config={{ title: 'Financial Chart - Stock Price' }} />
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget initialWidth={520} initialHeight={350}>
              <WaterfallChart data={generateWaterfallData()} config={{ title: 'Waterfall Chart - Cash Flow' }} />
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 7: Heatmap & Timeline */}
      <TabPanel value={tabValue} index={7}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Heatmap Chart - Activity" initialWidth={700} initialHeight={350}>
              <HeatmapChart data={generateHeatmapData()} noWrapper />
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Timeline Chart" initialWidth={600} initialHeight={350}>
              <TimelineChart data={generateTimelineData()} noWrapper />
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>

      {/* Tab 8: Map & Todo */}
      <TabPanel value={tabValue} index={8}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ResizableChartWidget title="Map Chart - Geographic Data" initialWidth={600} initialHeight={400}>
              <MapChart noWrapper />
            </ResizableChartWidget>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResizableChartWidget title="Todo Chart - Task Progress" initialWidth={450} initialHeight={350}>
              <TodoChart data={generateTodoData()} noWrapper />
            </ResizableChartWidget>
          </motion.div>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default ChartShowcase;
