import React from 'react';
import { Box, Typography, Card, Button, useTheme, alpha, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ChartIcon from '@mui/icons-material/ShowChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const DashboardHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

  const quickActions = [
    { 
      label: 'Dashboards', 
      icon: <BarChartIcon />, 
      path: '/dashboards', 
      color: theme.palette.primary.main,
      description: 'View and manage your analytics dashboards'
    },
    { 
      label: 'Forms', 
      icon: <DescriptionIcon />, 
      path: '/dynamic-forms', 
      color: theme.palette.secondary.main,
      description: 'Create and customize dynamic forms'
    },
    { 
      label: 'Charts', 
      icon: <ChartIcon />, 
      path: '/charts', 
      color: theme.palette.success.main,
      description: 'Explore our comprehensive chart library'
    },
  ];

  const features = [
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Built with modern technologies for optimal performance',
      color: theme.palette.primary.main,
    },
    {
      icon: <TipsAndUpdatesIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Analytics',
      description: 'Gain insights from your data with intelligent tools',
      color: theme.palette.warning.main,
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security',
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              margin: '0 auto 1.5rem',
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            👋
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome back, {username}!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Here's what's happening with your data today.
          </Typography>
        </motion.div>
      </Box>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} md={4} key={action.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(action.color, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(action.color, 0.05)} 0%, ${alpha(action.color, 0.02)} 100%)`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 40px ${alpha(action.color, 0.2)}`,
                      borderColor: action.color,
                    },
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(action.color, 0.1),
                      color: action.color,
                      mb: 2,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {action.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Why Choose Our Platform
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(feature.color, 0.15)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(feature.color, 0.1),
                      color: feature.color,
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default DashboardHome;
