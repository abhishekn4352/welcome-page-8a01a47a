import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResizableChartWidgetProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  title?: string;
  onResize?: (width: number, height: number) => void;
}

type ResizeDirection = 
  | 'n' | 's' | 'e' | 'w' 
  | 'ne' | 'nw' | 'se' | 'sw';

const ResizableChartWidget: React.FC<ResizableChartWidgetProps> = ({
  children,
  initialWidth = 400,
  initialHeight = 300,
  minWidth = 200,
  minHeight = 150,
  maxWidth = 1200,
  maxHeight = 800,
  className,
  title,
  onResize,
}) => {
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 0, height: 0 });
  const directionRef = useRef<ResizeDirection | null>(null);

  const handleMouseDown = useCallback((direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    directionRef.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;
      const dir = directionRef.current;

      let newWidth = startDimensions.current.width;
      let newHeight = startDimensions.current.height;

      // Handle horizontal resize
      if (dir?.includes('e')) {
        newWidth = startDimensions.current.width + deltaX;
      } else if (dir?.includes('w')) {
        newWidth = startDimensions.current.width - deltaX;
      }

      // Handle vertical resize
      if (dir?.includes('s')) {
        newHeight = startDimensions.current.height + deltaY;
      } else if (dir?.includes('n')) {
        newHeight = startDimensions.current.height - deltaY;
      }

      // Apply constraints
      newWidth = Math.min(maxWidth, Math.max(minWidth, newWidth));
      newHeight = Math.min(maxHeight, Math.max(minHeight, newHeight));

      setDimensions({ width: newWidth, height: newHeight });
      onResize?.(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      directionRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, minWidth, minHeight, maxWidth, maxHeight, onResize]);

  const handleStyles = {
    base: `absolute bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20`,
    corner: `w-3 h-3 rounded-full bg-primary shadow-lg`,
    edge: `bg-primary/40 hover:bg-primary/80`,
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative group bg-card rounded-xl border border-border shadow-lg overflow-hidden",
        isResizing && "select-none",
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
      animate={{ width: dimensions.width, height: dimensions.height }}
      transition={{ duration: isResizing ? 0 : 0.2 }}
    >
      {/* Title bar */}
      {title && (
        <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground truncate">{title}</span>
          <span className="text-xs text-muted-foreground">
            {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Edge handles */}
      {/* North */}
      <div
        className={cn(handleStyles.base, handleStyles.edge, "top-0 left-3 right-3 h-1.5 cursor-n-resize rounded-b")}
        onMouseDown={handleMouseDown('n')}
      />
      {/* South */}
      <div
        className={cn(handleStyles.base, handleStyles.edge, "bottom-0 left-3 right-3 h-1.5 cursor-s-resize rounded-t")}
        onMouseDown={handleMouseDown('s')}
      />
      {/* East */}
      <div
        className={cn(handleStyles.base, handleStyles.edge, "right-0 top-3 bottom-3 w-1.5 cursor-e-resize rounded-l")}
        onMouseDown={handleMouseDown('e')}
      />
      {/* West */}
      <div
        className={cn(handleStyles.base, handleStyles.edge, "left-0 top-3 bottom-3 w-1.5 cursor-w-resize rounded-r")}
        onMouseDown={handleMouseDown('w')}
      />

      {/* Corner handles */}
      {/* NW */}
      <div
        className={cn(handleStyles.base, handleStyles.corner, "-top-1 -left-1 cursor-nw-resize")}
        onMouseDown={handleMouseDown('nw')}
      />
      {/* NE */}
      <div
        className={cn(handleStyles.base, handleStyles.corner, "-top-1 -right-1 cursor-ne-resize")}
        onMouseDown={handleMouseDown('ne')}
      />
      {/* SW */}
      <div
        className={cn(handleStyles.base, handleStyles.corner, "-bottom-1 -left-1 cursor-sw-resize")}
        onMouseDown={handleMouseDown('sw')}
      />
      {/* SE */}
      <div
        className={cn(handleStyles.base, handleStyles.corner, "-bottom-1 -right-1 cursor-se-resize")}
        onMouseDown={handleMouseDown('se')}
      />

      {/* Resize indicator overlay */}
      {isResizing && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-xl pointer-events-none" />
      )}
    </motion.div>
  );
};

export default ResizableChartWidget;
