import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  ShowChart as ChartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { useThemeMode } from '@/theme/ThemeProvider';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Dashboard', path: '/home', icon: <DashboardIcon /> },
  { id: 'dashboards', label: 'Analytics', path: '/dashboards', icon: <BarChartIcon /> },
  { id: 'forms', label: 'Dynamic Forms', path: '/dynamic-forms', icon: <DescriptionIcon /> },
  { id: 'charts', label: 'Chart Library', path: '/charts', icon: <ChartIcon /> },
];

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeMode();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';
  const userInitial = username.charAt(0).toUpperCase();

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Glassmorphism styles for header
  const glassStyles = {
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  };

  const drawerWidth = sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Glassmorphism Header */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...glassStyles,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.primary' }}>
              {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <IconButton onClick={toggleFullscreen} sx={{ color: 'text.secondary' }}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.secondary' }}>
                <Badge badgeContent={3} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            ...glassStyles,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Administrator
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Collapsible Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            bgcolor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {/* Logo */}
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            px: sidebarOpen ? 3 : 0,
            minHeight: 64,
          }}
        >
          <motion.div
            initial={false}
            animate={{ width: sidebarOpen ? 'auto' : 40 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.25rem',
                flexShrink: 0,
              }}
            >
              S
            </Box>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography variant="h6" fontWeight={700} noWrap>
                    SureOps
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Toolbar>

        <Divider sx={{ mx: 2 }} />

        {/* Navigation */}
        <List sx={{ px: 1, pt: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/home' && location.pathname.startsWith(item.path));

            return (
              <Tooltip 
                key={item.id} 
                title={!sidebarOpen ? item.label : ''} 
                placement="right"
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, mode === 'dark' ? 0.16 : 0.08),
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 24,
                        borderRadius: '0 4px 4px 0',
                        bgcolor: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'text.primary' : 'text.secondary',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminLayout;
