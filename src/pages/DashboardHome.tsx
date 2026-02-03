import React from 'react';
import { Box, Typography, Card, Grid, Button, useTheme, alpha, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  ShowChart as ChartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import InteractiveChart from '@/components/charts/InteractiveChart';

// Mock data for charts
const revenueData = [
  { name: 'Jan', value: 4000, value2: 2400 },
  { name: 'Feb', value: 3000, value2: 1398 },
  { name: 'Mar', value: 2000, value2: 9800 },
  { name: 'Apr', value: 2780, value2: 3908 },
  { name: 'May', value: 1890, value2: 4800 },
  { name: 'Jun', value: 2390, value2: 3800 },
  { name: 'Jul', value: 3490, value2: 4300 },
];

const trafficData = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, index }) => {
  const theme = useTheme();

  const changeColor = {
    positive: theme.palette.success.main,
    negative: theme.palette.error.main,
    neutral: theme.palette.text.secondary,
  }[changeType];

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      sx={{
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          <Chip
            label={change}
            size="small"
            sx={{
              mt: 1,
              bgcolor: alpha(changeColor, 0.1),
              color: changeColor,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  );
};

const DashboardHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

  const stats: Omit<StatCardProps, 'index'>[] = [
    { title: 'Total Revenue', value: '$45,231', change: '+20.1%', changeType: 'positive', icon: <TrendingUpIcon /> },
    { title: 'Active Users', value: '2,350', change: '+15.3%', changeType: 'positive', icon: <PeopleIcon /> },
    { title: 'Data Points', value: '12.5M', change: '+8.2%', changeType: 'positive', icon: <StorageIcon /> },
    { title: 'Performance', value: '99.9%', change: '0%', changeType: 'neutral', icon: <SpeedIcon /> },
  ];

  const quickActions = [
    { label: 'Analytics', icon: <BarChartIcon />, path: '/dashboards', color: theme.palette.primary.main },
    { label: 'Forms', icon: <DescriptionIcon />, path: '/dynamic-forms', color: theme.palette.secondary.main },
    { label: 'Charts', icon: <ChartIcon />, path: '/charts', color: theme.palette.success.main },
  ];

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {username}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your data today.
          </Typography>
        </motion.div>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard {...stat} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <InteractiveChart
            data={revenueData}
            type="area"
            title="Revenue Overview"
            subtitle="Monthly revenue comparison"
            dataKeys={['value', 'value2']}
            height={350}
            showBrush
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <InteractiveChart
            data={trafficData}
            type="bar"
            title="Weekly Traffic"
            subtitle="Visitor statistics"
            dataKeys={['value']}
            height={350}
            showBrush={false}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outlined"
                startIcon={action.icon}
                onClick={() => navigate(action.path)}
                sx={{
                  borderColor: alpha(action.color, 0.3),
                  color: action.color,
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: alpha(action.color, 0.08),
                  },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default DashboardHome;
