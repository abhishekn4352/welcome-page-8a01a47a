import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Eye, Download, Copy, AlertCircle, Loader } from 'lucide-react';
import { useThemeMode } from '@/theme/ThemeProvider';

/**
 * ProcessedDataPanel - Read-only display of backend dynamic form data
 * Shows execution results in a glassmorphic card-based layout
 */
const ProcessedDataPanel = ({ data = null, isLoading = false, error = null, title = 'Dynamic Form Data' }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copied, setCopied] = useState(null);
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const panelStyles = {
    backgroundColor: isDark ? 'rgba(26, 32, 44, 0.85)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    border: isDark ? '1px solid rgba(0, 210, 255, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: isDark ? '0 8px 32px rgba(0, 210, 255, 0.1)' : '0 8px 32px rgba(59, 130, 246, 0.08)'
  };

  const headerBorderColor = isDark ? 'rgba(0, 210, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)';
  const accentBg = isDark ? 'rgba(0, 210, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)';
  const accentBgHover = isDark ? 'rgba(0, 210, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)';
  const cardBg = isDark ? 'rgba(0, 210, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)';
  const cardBorder = isDark ? '1px solid rgba(0, 210, 255, 0.15)' : '1px solid rgba(59, 130, 246, 0.15)';
  const subtleBorder = isDark ? 'rgba(0, 210, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)';
  const accentText = isDark ? 'text-cyan-400' : 'text-blue-700';
  const accentTextMuted = isDark ? 'text-cyan-300/60' : 'text-blue-600/70';
  const baseText = isDark ? 'text-cyan-300' : 'text-blue-700';
  const baseTextMuted = isDark ? 'text-cyan-300/50' : 'text-blue-600/60';
  const helpText = isDark ? 'text-cyan-200/30' : 'text-blue-600/40';
  const monoKeyText = isDark ? 'text-cyan-400/70' : 'text-blue-700/70';
  const monoValueText = isDark ? 'text-cyan-300/90' : 'text-slate-800';

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (content, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2)));
    element.setAttribute('download', filename || 'dynamic-form-data.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden" style={panelStyles}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: headerBorderColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentBg }}>
              <Eye className={`w-4 h-4 ${accentText}`} />
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${accentText}`}>{title}</h3>
              <p className={`text-xs ${accentTextMuted}`}>Read-only view • No editing</p>
            </div>
          </div>
          {data && (
            <button
              onClick={() => handleDownload(data, 'dynamic-form-data.json')}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: accentBg,
                border: headerBorderColor
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = accentBgHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = accentBg;
              }}
              title="Download as JSON"
            >
              <Download className={`w-4 h-4 ${accentText}`} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full border-2 ${
                isDark ? 'border-cyan-400/30 border-t-cyan-400' : 'border-blue-300/40 border-t-blue-600'
              } animate-spin mx-auto mb-3`}></div>
              <p className={`text-sm ${baseText}`}>Processing data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-6">
            <div className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-300 mb-1">Error Loading Data</h4>
                <p className="text-xs text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!data || (Array.isArray(data) && data.length === 0)) && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: accentBg }}>
                <Eye className={`w-6 h-6 ${baseTextMuted}`} />
              </div>
              <p className={`text-sm ${baseTextMuted}`}>No dynamic form data available</p>
              <p className={`text-xs ${helpText} mt-1`}>Execute workflow to see results</p>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!isLoading && !error && data && (
          <div className="p-6">
            {Array.isArray(data) ? (
              <div className="space-y-3">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: cardBg,
                      border: cardBorder
                    }}
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  >
                    {/* Item Header */}
                    <div
                      className="px-4 py-3 flex items-center justify-between hover:bg-opacity-100 transition-colors"
                      style={{ backgroundColor: accentBg }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${accentTextMuted}`}>Record #{idx + 1}</p>
                        {typeof item === 'object' && item !== null && (
                          <p className={`text-sm ${baseText} font-medium truncate mt-1`}>
                            {Object.keys(item).length} fields
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item, idx);
                          }}
                          className="p-1.5 rounded transition-colors duration-200"
                          style={{
                            backgroundColor: copied === idx ? 'rgba(34, 197, 94, 0.2)' : accentBg
                          }}
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" style={{ color: copied === idx ? '#22c55e' : (isDark ? '#00d4ff' : '#2563eb') }} />
                        </button>
                        <span className={baseTextMuted}>
                          {expandedIndex === idx ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {/* Item Content - Expanded */}
                    {expandedIndex === idx && (
                      <div className="px-4 py-3 border-t" style={{ borderColor: subtleBorder }}>
                        {typeof item === 'object' && item !== null ? (
                          <div className="space-y-2 text-xs">
                            {Object.entries(item).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className={`${monoKeyText} font-mono min-w-max`}>{key}:</span>
                                <span className={`${monoValueText} font-mono break-all max-w-xs`}>
                                  {formatValue(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-sm ${monoValueText} font-mono break-all`}>
                            {formatValue(item)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg p-4" style={{
                backgroundColor: cardBg,
                border: cardBorder
              }}>
                {typeof data === 'object' ? (
                  <div className="space-y-2 text-xs">
                    {Object.entries(data).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className={`${monoKeyText} font-mono min-w-max`}>{key}:</span>
                        <span className={`${monoValueText} font-mono break-all max-w-md`}>
                          {formatValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm ${monoValueText} font-mono break-all`}>
                    {formatValue(data)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Data info */}
      {data && (
        <div
          className={`px-6 py-3 border-t text-xs ${baseTextMuted} flex items-center justify-between`}
          style={{ borderColor: headerBorderColor }}
        >
          <span>
            {Array.isArray(data) ? `${data.length} records` : '1 object'}
          </span>
          <span className="text-cyan-400/30">• Read-only</span>
        </div>
      )}
    </div>
  );
};

export default ProcessedDataPanel;
