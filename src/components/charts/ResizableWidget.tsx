import React, { useState, useRef, useCallback } from 'react';
import { Box, IconButton, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import {
  DragIndicator as DragIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

interface ResizableWidgetProps {
  id: string;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (id: string, width: number, height: number) => void;
  onRemove?: (id: string) => void;
  onFullscreen?: (id: string) => void;
  showControls?: boolean;
  isDraggable?: boolean;
}

const ResizableWidget: React.FC<ResizableWidgetProps> = ({
  id,
  children,
  initialWidth = 400,
  initialHeight = 300,
  minWidth = 200,
  minHeight = 150,
  maxWidth = 1200,
  maxHeight = 800,
  onResize,
  onRemove,
  onFullscreen,
  showControls = true,
  isDraggable = true,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (handle.includes('e')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (moveEvent.clientX - startX)));
      }
      if (handle.includes('w')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (moveEvent.clientX - startX)));
      }
      if (handle.includes('s')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (moveEvent.clientY - startY)));
      }
      if (handle.includes('n')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (moveEvent.clientY - startY)));
      }

      setDimensions({ width: newWidth, height: newHeight });
      onResize?.(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, id, minWidth, minHeight, maxWidth, maxHeight, onResize]);

  const resizeHandles = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

  const getHandleStyles = (handle: string) => {
    const base = {
      position: 'absolute' as const,
      zIndex: 10,
      opacity: isHovered || isResizing ? 1 : 0,
      transition: 'opacity 0.2s ease',
    };

    const handleSize = 8;
    const cornerSize = 12;

    switch (handle) {
      case 'n':
        return { ...base, top: 0, left: cornerSize, right: cornerSize, height: handleSize, cursor: 'n-resize' };
      case 'ne':
        return { ...base, top: 0, right: 0, width: cornerSize, height: cornerSize, cursor: 'ne-resize' };
      case 'e':
        return { ...base, top: cornerSize, right: 0, bottom: cornerSize, width: handleSize, cursor: 'e-resize' };
      case 'se':
        return { ...base, bottom: 0, right: 0, width: cornerSize, height: cornerSize, cursor: 'se-resize' };
      case 's':
        return { ...base, bottom: 0, left: cornerSize, right: cornerSize, height: handleSize, cursor: 's-resize' };
      case 'sw':
        return { ...base, bottom: 0, left: 0, width: cornerSize, height: cornerSize, cursor: 'sw-resize' };
      case 'w':
        return { ...base, top: cornerSize, left: 0, bottom: cornerSize, width: handleSize, cursor: 'w-resize' };
      case 'nw':
        return { ...base, top: 0, left: 0, width: cornerSize, height: cornerSize, cursor: 'nw-resize' };
      default:
        return base;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${isResizing ? theme.palette.primary.main : theme.palette.divider}`,
          boxShadow: isResizing 
            ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}` 
            : theme.shadows[2],
          bgcolor: 'background.paper',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {/* Control Bar */}
        {showControls && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 20,
              display: 'flex',
              gap: 0.5,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              borderRadius: 1,
              p: 0.5,
              backdropFilter: 'blur(4px)',
            }}
          >
            {isDraggable && (
              <IconButton 
                size="small" 
                className="drag-handle"
                sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
              >
                <DragIcon fontSize="small" />
              </IconButton>
            )}
            {onFullscreen && (
              <IconButton size="small" onClick={() => onFullscreen(id)}>
                <FullscreenIcon fontSize="small" />
              </IconButton>
            )}
            {onRemove && (
              <IconButton 
                size="small" 
                onClick={() => onRemove(id)}
                sx={{ 
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: 'error.main',
                  } 
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        {/* Chart Content */}
        <Box sx={{ width: '100%', height: '100%', p: 0 }}>
          {children}
        </Box>

        {/* Resize Handles */}
        {resizeHandles.map((handle) => (
          <Box
            key={handle}
            sx={getHandleStyles(handle)}
            onMouseDown={(e) => handleMouseDown(e, handle)}
          />
        ))}

        {/* Corner Indicators */}
        {['se', 'sw', 'ne', 'nw'].map((corner) => (
          <Box
            key={`indicator-${corner}`}
            sx={{
              position: 'absolute',
              width: 6,
              height: 6,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              opacity: isHovered || isResizing ? 0.8 : 0,
              transition: 'opacity 0.2s ease',
              ...(corner === 'se' && { bottom: 3, right: 3 }),
              ...(corner === 'sw' && { bottom: 3, left: 3 }),
              ...(corner === 'ne' && { top: 3, right: 3 }),
              ...(corner === 'nw' && { top: 3, left: 3 }),
              pointerEvents: 'none',
            }}
          />
        ))}
      </Box>
    </motion.div>
  );
};

export default ResizableWidget;
