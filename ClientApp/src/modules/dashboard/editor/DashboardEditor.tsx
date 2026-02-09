import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Save as SaveIcon,
  Add as AddIcon,
  ShowChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  DragIndicator as DragIcon,
  GridView as GridIcon,
} from '@mui/icons-material';
import * as ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetRenderer from './components/WidgetRenderer';
import { useDashboardEditor } from './useDashboardEditor';

// Grid Layout setup
// @ts-ignore
const RGL = ReactGridLayout.default || ReactGridLayout;
// @ts-ignore
const WidthProvider = ReactGridLayout.WidthProvider || RGL?.WidthProvider;
// @ts-ignore
const Responsive = ReactGridLayout.Responsive || RGL?.Responsive;

const ResponsiveGridLayout = WidthProvider ? WidthProvider(Responsive) : null;

const DashboardEditor: React.FC = () => {
  const theme = useTheme();
  const {
    dashboard,
    setDashboard,
    loading,
    saving,
    handleLayoutChange,
    addWidget,
    handleSave
  } = useDashboardEditor();

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Loading editor...</Typography>
      </Box>
    );
  }

  if (!dashboard) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Dashboard not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      {/* Toolbar */}
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
              }}
            >
              <GridIcon />
            </Box>
            <Box>
              <TextField
                value={dashboard.name}
                onChange={(e) => setDashboard({ ...dashboard, name: e.target.value })}
                variant="standard"
                placeholder="Dashboard Name"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '1.25rem',
                    fontWeight: 700,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {dashboard.items.length} widget{dashboard.items.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mr: 1 }}>
              Add Widget:
            </Typography>
            <Tooltip title="Add Line Chart">
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
                onClick={() => addWidget('line_chart')}
              >
                <LineChartIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              </Paper>
            </Tooltip>
            <Tooltip title="Add Bar Chart">
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.secondary.main,
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.2)}`,
                  },
                }}
                onClick={() => addWidget('bar_chart')}
              >
                <BarChartIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
              </Paper>
            </Tooltip>
            <Tooltip title="Add Pie Chart">
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.success.main,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.2)}`,
                  },
                }}
                onClick={() => addWidget('pie_chart')}
              >
                <PieChartIcon sx={{ fontSize: 20, color: 'success.main' }} />
              </Paper>
            </Tooltip>

            <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                px: 3,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              {saving ? 'Saving...' : 'Save Dashboard'}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Grid Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: alpha(theme.palette.background.default, 0.5),
          borderRadius: 2,
          p: 3,
          border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        {dashboard.items.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 400,
            }}
          >
            <Box
              component={motion.div}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                mb: 3,
              }}
            >
              <GridIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.5 }} />
            </Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Your canvas awaits
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, textAlign: 'center' }}>
              Start building your dashboard by adding widgets from the toolbar above
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip
                icon={<LineChartIcon />}
                label="Line Chart"
                onClick={() => addWidget('line_chart')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                }}
              />
              <Chip
                icon={<BarChartIcon />}
                label="Bar Chart"
                onClick={() => addWidget('bar_chart')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.1) },
                }}
              />
              <Chip
                icon={<PieChartIcon />}
                label="Pie Chart"
                onClick={() => addWidget('pie_chart')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.1) },
                }}
              />
            </Box>
          </Box>
        ) : ResponsiveGridLayout ? (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: dashboard.items.map(item => ({ ...item, i: item.id.toString() })) }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".drag-handle"
          >
            {dashboard.items.map((item) => (
              <Card
                key={item.id}
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                  '&:hover .drag-handle': {
                    opacity: 1,
                  },
                }}
              >
                {/* Drag Handle */}
                <Box
                  className="drag-handle"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 32,
                    cursor: 'grab',
                    zIndex: 10,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:active': { cursor: 'grabbing' },
                  }}
                >
                  <DragIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Box>
                <CardContent sx={{ height: '100%', pt: 4 }}>
                  <WidgetRenderer widget={item} />
                </CardContent>
              </Card>
            ))}
          </ResponsiveGridLayout>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              Error loading Grid Layout library. Please check console.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardEditor;
