import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeMode } from '@/theme/ThemeProvider';
import { ArrowLeft, BarChart3, Clock, Filter, Sliders } from 'lucide-react';
import WidgetNode from '@/modules/dashboard/canvas/components/WidgetNode';
import { investigateRunnerService, InvestigateRecord } from '../services/investigateRunnerService';

type ChartType = 'doughnut' | 'pie' | 'bar' | 'line' | 'area' | 'radar';

const chartTypeOptions: { label: string; value: ChartType; widgetType: string }[] = [
  { label: 'Doughnut Chart', value: 'doughnut', widgetType: 'widget-doughnutchart' },
  { label: 'Pie Chart', value: 'pie', widgetType: 'widget-piechart' },
  { label: 'Bar Chart', value: 'bar', widgetType: 'widget-barchart' },
  { label: 'Line Chart', value: 'line', widgetType: 'widget-linechart' },
  { label: 'Area Chart', value: 'area', widgetType: 'widget-areachart' },
  { label: 'Radar Chart', value: 'radar', widgetType: 'widget-radarchart' },
];

const isNumericValue = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return Number.isFinite(num);
  }
  return false;
};

const parseDateValue = (value: unknown) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    const hasDateTokens = /[-/:]/.test(value);
    if (!hasDateTokens) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const InvestigateRunnerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const investigationId = Number(id);

  const [investigation, setInvestigation] = useState<InvestigateRecord | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateField, setDateField] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [chartType, setChartType] = useState<ChartType>('doughnut');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 900, height: 520 });

  useEffect(() => {
    if (!Number.isNaN(investigationId)) {
      loadData(investigationId);
    }
  }, [investigationId]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextWidth = Math.max(320, Math.floor(entry.contentRect.width));
      const nextHeight = Math.max(320, Math.floor(entry.contentRect.height));
      setChartSize({ width: nextWidth, height: nextHeight });
    });
    observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const loadData = async (idValue: number) => {
    setLoading(true);
    setError(null);
    try {
      const [investigationRes, rowsRes] = await Promise.all([
        investigateRunnerService.getInvestigationById(idValue),
        investigateRunnerService.getInvestigationDataById(idValue),
      ]);

      setInvestigation(investigationRes || null);
      const list = Array.isArray(rowsRes) ? rowsRes : rowsRes?.data || [];
      setRows(list);
      setFilteredRows(list);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load investigation data');
      setRows([]);
      setFilteredRows([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => {
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0]);
  }, [rows]);

  const numericColumns = useMemo(() => {
    return columns.filter((col) => rows.some((row) => isNumericValue(row?.[col])));
  }, [columns, rows]);

  const dateColumns = useMemo(() => {
    return columns.filter((col) => rows.some((row) => parseDateValue(row?.[col])));
  }, [columns, rows]);

  useEffect(() => {
    if (!xAxis && columns.length) {
      setXAxis(dateColumns[0] || columns[0]);
    }
    if (!yAxis.length && numericColumns.length) {
      setYAxis([numericColumns[0]]);
    }
    if (!dateField && dateColumns.length) {
      setDateField(dateColumns[0]);
    }
  }, [columns, dateColumns, numericColumns, xAxis, yAxis.length, dateField]);

  const applyFilters = () => {
    let next = rows;
    if (dateField && (fromDate || toDate)) {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      next = rows.filter((row) => {
        const date = parseDateValue(row?.[dateField]);
        if (!date) return false;
        if (from && date < from) return false;
        if (to && date > to) return false;
        return true;
      });
    }
    setFilteredRows(next);
    setLastUpdated(new Date());
  };

  const chartData = useMemo(() => {
    if (!xAxis || !filteredRows.length) return [] as any[];
    const grouped = new Map<string, Record<string, number>>();
    const useCountOnly = yAxis.length === 0;

    filteredRows.forEach((row) => {
      const key = String(row?.[xAxis] ?? 'Unknown');
      const entry = grouped.get(key) || { name: key } as Record<string, number> & { name: string };

      if (useCountOnly) {
        entry.value = (entry.value || 0) + 1;
      } else {
        yAxis.forEach((yKey) => {
          const raw = row?.[yKey];
          const value = isNumericValue(raw) ? Number(raw) : 0;
          entry[yKey] = (entry[yKey] || 0) + value;
        });
      }

      grouped.set(key, entry);
    });

    let data = Array.from(grouped.values());

    if (dateField && xAxis === dateField) {
      data = data.sort((a, b) => {
        const left = parseDateValue(a.name)?.getTime() || 0;
        const right = parseDateValue(b.name)?.getTime() || 0;
        return left - right;
      });
    }

    const isSingleValue = chartType === 'doughnut' || chartType === 'pie' || chartType === 'bar';
    if (isSingleValue) {
      const key = yAxis[0];
      data = data.map((item) => ({
        name: item.name,
        value: key ? (item[key] || 0) : (item.value || 0),
      }));
    }

    return data;
  }, [filteredRows, xAxis, yAxis, chartType, dateField]);

  const selectedChart = chartTypeOptions.find((option) => option.value === chartType);

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'
    }`}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(transparent 0 0), linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/investigate-runner')}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">
                <span className="text-cyan-400">Investigate</span> Dashboard
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Real-time data analysis and visualization for investigation {investigation?.name || investigationId}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Data Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Last Update: {lastUpdated ? lastUpdated.toLocaleString() : '---'}</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Loading data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className={`border rounded-xl p-4 ${
            isDark
              ? 'bg-red-900/30 border-red-800 text-red-200'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-6">
            <div className={`rounded-2xl border px-5 py-6 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-5">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                  <Filter size={18} />
                </div>
                <div>
                  <p className="font-semibold">Filters</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Date Field {dateField ? '' : 'Not Selected'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Date Field</label>
                  <select
                    value={dateField}
                    onChange={(e) => setDateField(e.target.value)}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="">Select Date Field</option>
                    {dateColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isDark
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  Apply Filter
                </button>
              </div>
            </div>

            <div className={`rounded-2xl border px-6 py-6 ${
              isDark
                ? 'bg-slate-900/70 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Data Visualization</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Interactive charts and graphs
                </p>
              </div>

              <div ref={chartContainerRef} className="h-[520px] w-full">
                {chartData.length === 0 ? (
                  <div className={`h-full w-full rounded-xl border flex items-center justify-center ${
                    isDark
                      ? 'border-slate-800 text-slate-500'
                      : 'border-slate-200 text-slate-400'
                  }`}>
                    No data to display
                  </div>
                ) : (
                  <WidgetNode
                    id={`investigate-chart-${investigationId}`}
                    isConnectable={false}
                    isSelected={false}
                    width={chartSize.width}
                    height={chartSize.height}
                    data={{
                      widgetType: selectedChart?.widgetType || 'widget-doughnutchart',
                      title: selectedChart?.label || 'Investigation Chart',
                      description: `${xAxis}${yAxis.length ? ` vs ${yAxis.join(', ')}` : ''}`,
                      disableHandles: true,
                      config: {
                        xAxis: xAxis,
                        yAxis: yAxis,
                        xAxisLabel: xAxis || 'X Axis',
                        yAxisLabel: yAxis.length ? yAxis.join(', ') : 'Count',
                        data: chartData,
                      },
                    }}
                  />
                )}
              </div>
            </div>

            <div className={`rounded-2xl border px-5 py-6 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-5">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  <Sliders size={18} />
                </div>
                <div>
                  <p className="font-semibold">Parameters</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Configure chart settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Chart Type</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as ChartType)}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {chartTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>X-Axis</label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="">Select X-Axis</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Y-Axis (numeric)
                  </label>
                  <select
                    multiple
                    value={yAxis}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions).map((option) => option.value);
                      setYAxis(values);
                    }}
                    className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm min-h-[140px] ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {numericColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <p className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Hold Ctrl/Cmd to select multiple values
                  </p>
                </div>

                {chartType !== 'line' && yAxis.length > 1 && (
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Only the first Y-axis is used for this chart type.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigateRunnerView;
