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
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Save as SaveIcon,
  Add as AddIcon,
  ShowChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
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
          mb: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            value={dashboard.name}
            onChange={(e) => setDashboard({ ...dashboard, name: e.target.value })}
            variant="standard"
            placeholder="Dashboard Name"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Add Line Chart">
              <IconButton
                onClick={() => addWidget('line_chart')}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <LineChartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Bar Chart">
              <IconButton
                onClick={() => addWidget('bar_chart')}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <BarChartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Pie Chart">
              <IconButton
                onClick={() => addWidget('pie_chart')}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <PieChartIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              {saving ? 'Saving...' : 'Save'}
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
          p: 2,
        }}
      >
        {ResponsiveGridLayout ? (
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
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    '&:active': { cursor: 'grabbing' },
                  }}
                />
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
