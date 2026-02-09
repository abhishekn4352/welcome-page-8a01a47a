import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
    DashboardCustomize,
    Description,
    Person,
    TrendingUp,
} from '@mui/icons-material';

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const quickLinks = [
        {
            title: 'Manage Profile',
            description: 'Update your personal information and settings',
            icon: <Person sx={{ fontSize: 40 }} />,
            path: '/profile',
            color: theme.palette.primary.main,
        },
        {
            title: 'Dashboards',
            description: 'Create and manage your analytics dashboards',
            icon: <DashboardCustomize sx={{ fontSize: 40 }} />,
            path: '/dashboards',
            color: theme.palette.secondary.main,
        },
        {
            title: 'Dynamic Forms',
            description: 'Build and customize interactive forms',
            icon: <Description sx={{ fontSize: 40 }} />,
            path: '/dynamic-forms',
            color: theme.palette.success.main,
        },
        {
            title: 'Chart Showcase',
            description: 'Explore our comprehensive chart library',
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            path: '/charts',
            color: theme.palette.info.main,
        },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6, px: 3 }}>
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ textAlign: 'center', mb: 6 }}>
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
                        You have successfully logged in. Choose an action below to get started.
                    </Typography>
                </Box>
            </motion.div>

            {/* Quick Links Grid */}
            <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
                {quickLinks.map((link, index) => (
                    <Grid item xs={12} sm={6} md={3} key={link.title}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    border: `1px solid ${alpha(link.color, 0.2)}`,
                                    background: `linear-gradient(135deg, ${alpha(link.color, 0.05)} 0%, ${alpha(link.color, 0.02)} 100%)`,
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 12px 40px ${alpha(link.color, 0.2)}`,
                                        borderColor: link.color,
                                    },
                                }}
                                onClick={() => navigate(link.path)}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: alpha(link.color, 0.1),
                                        color: link.color,
                                        mb: 2,
                                    }}
                                >
                                    {link.icon}
                                </Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    {link.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {link.description}
                                </Typography>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Dashboard;
        </div>
    );
};

export default Dashboard;
