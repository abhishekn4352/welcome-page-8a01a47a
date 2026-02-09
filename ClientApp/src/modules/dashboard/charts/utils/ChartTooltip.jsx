import React from 'react';

/**
 * Custom Tooltip Component for All Charts
 * Theme-aware styling with dark/light mode support
 */
export const CustomTooltip = ({ active, payload, label, xAxisLabel }) => {
  if (active && payload && payload.length) {
    // For line/area/bar charts with label
    if (label !== undefined) {
      return (
        <div style={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          padding: '12px 14px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '12px',
          color: 'hsl(var(--foreground))',
          zIndex: 1000,
          pointerEvents: 'none',
          minWidth: 140
        }}>
          <p style={{ 
            fontWeight: '600', 
            color: 'hsl(var(--foreground))', 
            marginBottom: '8px', 
            fontSize: '12px', 
            borderBottom: '1px solid hsl(var(--border))', 
            paddingBottom: '6px' 
          }}>
            {xAxisLabel && label ? `${xAxisLabel}: ${label}` : label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px', 
              marginTop: index === 0 ? '6px' : '4px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: entry.color, 
                  flexShrink: 0 
                }} />
                <span style={{ 
                  color: 'hsl(var(--muted-foreground))', 
                  fontSize: '11px', 
                  fontWeight: '500' 
                }}>
                  {entry.name}
                </span>
              </div>
              <span style={{ 
                fontWeight: '600', 
                color: 'hsl(var(--foreground))', 
                fontSize: '12px', 
                whiteSpace: 'nowrap' 
              }}>
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    // For scatter/bubble charts without label
    return (
      <div style={{
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        padding: '12px 14px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        fontSize: '12px',
        color: 'hsl(var(--foreground))',
        zIndex: 1000,
        pointerEvents: 'none',
        minWidth: 140
      }}>
        {payload.map((entry, index) => (
          <div key={index} style={{ marginBottom: index < payload.length - 1 ? '6px' : 0 }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{entry.name || 'Value'}</div>
            <div style={{ color: 'hsl(var(--muted-foreground))' }}>
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Empty State Component for Charts with No Data
 */
export const ChartEmptyState = ({ message = 'No data available', icon: Icon }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%',
    gap: '12px',
    color: 'hsl(var(--muted-foreground))',
    fontSize: '14px'
  }}>
    {Icon && <Icon size={32} style={{ opacity: 0.5 }} />}
    <span>{message}</span>
  </div>
);
