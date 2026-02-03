import { createTheme, ThemeOptions } from '@mui/material/styles';

// Slate + Purple color palette
const colors = {
  // Slate tones
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Purple/Violet accents
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  // Electric violet for highlights
  electric: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    glow: '#c4b5fd',
  },
};

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          // Dark mode palette
          primary: {
            main: colors.purple[500],
            light: colors.purple[400],
            dark: colors.purple[700],
            contrastText: '#ffffff',
          },
          secondary: {
            main: colors.electric.secondary,
            light: colors.electric.glow,
            dark: colors.purple[600],
            contrastText: '#ffffff',
          },
          background: {
            default: colors.slate[950],
            paper: colors.slate[900],
          },
          text: {
            primary: colors.slate[50],
            secondary: colors.slate[400],
            disabled: colors.slate[600],
          },
          divider: colors.slate[800],
          action: {
            active: colors.purple[400],
            hover: 'rgba(139, 92, 246, 0.08)',
            selected: 'rgba(139, 92, 246, 0.16)',
            disabled: colors.slate[700],
            disabledBackground: colors.slate[800],
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          info: {
            main: colors.purple[400],
            light: colors.purple[300],
            dark: colors.purple[600],
          },
        }
      : {
          // Light mode palette
          primary: {
            main: colors.purple[600],
            light: colors.purple[500],
            dark: colors.purple[800],
            contrastText: '#ffffff',
          },
          secondary: {
            main: colors.slate[600],
            light: colors.slate[500],
            dark: colors.slate[800],
            contrastText: '#ffffff',
          },
          background: {
            default: colors.slate[50],
            paper: '#ffffff',
          },
          text: {
            primary: colors.slate[900],
            secondary: colors.slate[600],
            disabled: colors.slate[400],
          },
          divider: colors.slate[200],
          action: {
            active: colors.purple[600],
            hover: 'rgba(139, 92, 246, 0.04)',
            selected: 'rgba(139, 92, 246, 0.08)',
            disabled: colors.slate[300],
            disabledBackground: colors.slate[100],
          },
          error: {
            main: '#dc2626',
            light: '#ef4444',
            dark: '#b91c1c',
          },
          warning: {
            main: '#d97706',
            light: '#f59e0b',
            dark: '#b45309',
          },
          success: {
            main: '#059669',
            light: '#10b981',
            dark: '#047857',
          },
          info: {
            main: colors.purple[600],
            light: colors.purple[500],
            dark: colors.purple[700],
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none' as const,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 2px 6px rgba(0, 0, 0, 0.12)',
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.16)',
    '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 6px 16px rgba(0, 0, 0, 0.18)',
    '0px 6px 8px rgba(0, 0, 0, 0.12), 0px 8px 20px rgba(0, 0, 0, 0.2)',
    '0px 8px 12px rgba(0, 0, 0, 0.14), 0px 12px 28px rgba(0, 0, 0, 0.22)',
    '0px 10px 16px rgba(0, 0, 0, 0.16), 0px 16px 32px rgba(0, 0, 0, 0.24)',
    '0px 12px 20px rgba(0, 0, 0, 0.18), 0px 20px 40px rgba(0, 0, 0, 0.26)',
    '0px 14px 24px rgba(0, 0, 0, 0.2), 0px 24px 48px rgba(0, 0, 0, 0.28)',
    '0px 16px 28px rgba(0, 0, 0, 0.22), 0px 28px 56px rgba(0, 0, 0, 0.3)',
    '0px 18px 32px rgba(0, 0, 0, 0.24), 0px 32px 64px rgba(0, 0, 0, 0.32)',
    '0px 20px 36px rgba(0, 0, 0, 0.26), 0px 36px 72px rgba(0, 0, 0, 0.34)',
    '0px 22px 40px rgba(0, 0, 0, 0.28), 0px 40px 80px rgba(0, 0, 0, 0.36)',
    '0px 24px 44px rgba(0, 0, 0, 0.3), 0px 44px 88px rgba(0, 0, 0, 0.38)',
    '0px 26px 48px rgba(0, 0, 0, 0.32), 0px 48px 96px rgba(0, 0, 0, 0.4)',
    '0px 28px 52px rgba(0, 0, 0, 0.34), 0px 52px 104px rgba(0, 0, 0, 0.42)',
    '0px 30px 56px rgba(0, 0, 0, 0.36), 0px 56px 112px rgba(0, 0, 0, 0.44)',
    '0px 32px 60px rgba(0, 0, 0, 0.38), 0px 60px 120px rgba(0, 0, 0, 0.46)',
    '0px 34px 64px rgba(0, 0, 0, 0.4), 0px 64px 128px rgba(0, 0, 0, 0.48)',
    '0px 36px 68px rgba(0, 0, 0, 0.42), 0px 68px 136px rgba(0, 0, 0, 0.5)',
    '0px 38px 72px rgba(0, 0, 0, 0.44), 0px 72px 144px rgba(0, 0, 0, 0.52)',
    '0px 40px 76px rgba(0, 0, 0, 0.46), 0px 76px 152px rgba(0, 0, 0, 0.54)',
    '0px 42px 80px rgba(0, 0, 0, 0.48), 0px 80px 160px rgba(0, 0, 0, 0.56)',
    '0px 44px 84px rgba(0, 0, 0, 0.5), 0px 84px 168px rgba(0, 0, 0, 0.58)',
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'dark' ? colors.slate[800] : colors.slate[100],
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'dark' 
              ? `linear-gradient(180deg, ${colors.purple[500]}, ${colors.purple[700]})`
              : `linear-gradient(180deg, ${colors.purple[400]}, ${colors.purple[600]})`,
            borderRadius: '10px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.purple[500]} 0%, ${colors.purple[700]} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.purple[400]} 0%, ${colors.purple[600]} 100%)`,
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? colors.slate[700] : colors.slate[300],
          '&:hover': {
            borderColor: colors.purple[500],
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: `1px solid ${mode === 'dark' ? colors.slate[800] : colors.slate[200]}`,
          boxShadow: mode === 'dark' 
            ? '0 4px 24px rgba(0, 0, 0, 0.4)' 
            : '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.32)'
            : '0 1px 4px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'dark' ? colors.slate[800] : colors.slate[200]}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${mode === 'dark' ? colors.slate[800] : colors.slate[200]}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(139, 92, 246, 0.16)' 
              : 'rgba(139, 92, 246, 0.08)',
            '&:hover': {
              backgroundColor: mode === 'dark'
                ? 'rgba(139, 92, 246, 0.24)'
                : 'rgba(139, 92, 246, 0.12)',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.purple[500],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.purple[500],
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
        filled: {
          backgroundColor: mode === 'dark' 
            ? 'rgba(139, 92, 246, 0.2)' 
            : 'rgba(139, 92, 246, 0.1)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'dark' ? colors.slate[800] : colors.slate[900],
          borderRadius: '6px',
          fontSize: '0.75rem',
          padding: '8px 12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: mode === 'dark'
              ? 'rgba(139, 92, 246, 0.12)'
              : 'rgba(139, 92, 246, 0.08)',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: colors.purple[500],
            '& + .MuiSwitch-track': {
              backgroundColor: colors.purple[500],
            },
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));

export { colors };
