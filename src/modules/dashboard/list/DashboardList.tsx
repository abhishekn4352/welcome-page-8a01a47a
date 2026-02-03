import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useDashboardList } from './useDashboardList';

const DashboardList: React.FC = () => {
  const theme = useTheme();
  const { dashboards, loading, error, navigate, handleDelete } = useDashboardList();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Dashboards
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your analytics dashboards
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboards/new')}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        >
          New Dashboard
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {dashboards.map((dashboard, index) => (
            <Grid item xs={12} sm={6} lg={4} key={dashboard.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
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
                  onClick={() => navigate(`/dashboards/${dashboard.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <DashboardIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {dashboard.dashboard_name || dashboard.name || 'Untitled Dashboard'}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {dashboard.dashboard_description || dashboard.description || 'No description available.'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboards/${dashboard.id}`);
                        }}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboards/edit/${dashboard.id}`);
                        }}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.1) },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(dashboard.id);
                        }}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {dashboards.length === 0 && !error && (
          <Grid item xs={12}>
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                border: `2px dashed ${theme.palette.divider}`,
                bgcolor: 'transparent',
              }}
            >
              <DashboardIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No dashboards yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first dashboard to start visualizing your data
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/dashboards/new')}
              >
                Create one now →
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardList;
