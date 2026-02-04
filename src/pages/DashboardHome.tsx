import React from 'react';
import { Box, Typography, Card, Button, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';

// Mock data for charts - removed unused
const revenueData = [];
const trafficData = [];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  index: number;
}

// Removed StatCard component - no longer needed

const DashboardHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

  // Removed stats array - no longer needed

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
      {/* Removed stat cards */}

      {/* Charts Row */}
      {/* Removed charts */}

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
