import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportRunnerService, ReportLineModel, AdhocCondition } from '../services/reportRunnerService';
import { useThemeMode } from '@/theme/ThemeProvider';
import { ArrowLeft, Download, RefreshCw, Play, Database, FileText, Menu } from 'lucide-react';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { DynamicParameterForm } from '../components/DynamicParameterForm';
import { AdhocParameterBuilder } from '../components/AdhocParameterBuilder';
import { DateRange, DateUtils } from '@/utils/dateUtils';
import { ReportQueryBuilder } from '../utils/reportQueryBuilder';

interface ReportData {
  [key: string]: any;
}

export default function ReportRunnerView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // Report configuration
  const [report, setReport] = useState<any>(null);
  const [reportConfig, setReportConfig] = useState<ReportLineModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');

  // Parameters
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null, type: 'Today' });
  const [dynamicParams, setDynamicParams] = useState<Record<string, any>>({});
  const [adhocConditions, setAdhocConditions] = useState<AdhocCondition[]>([
    { andor: 'AND', fields_name: '', condition: '=', value: '' }
  ]);

  // Data
  const [rows, setRows] = useState<ReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (id) {
      loadReportConfig();
    }
  }, [id]);

  useEffect(() => {
    // Set default date range on mount
    const today = DateUtils.calculateToday();
    setDateRange(today);
  }, []);

  const loadReportConfig = async () => {
    try {
      setLoading(true);
      setError('');

      const reportData = await reportRunnerService.getReportById(parseInt(id!));
      setReport(reportData);

      // Parse report configuration
      if (reportData.rpt_builder2_lines && reportData.rpt_builder2_lines.length > 0) {
        const lineData = reportData.rpt_builder2_lines[0];
        const config: ReportLineModel = JSON.parse(lineData.model);
        setReportConfig(config);

        // Parse standard parameters
        if (config.std_param_html) {
          try {
            const stdParams = JSON.parse(config.std_param_html);
            if (Array.isArray(stdParams)) {
              // Initialize empty values for each parameter
              const initialParams: Record<string, any> = {};
              stdParams.forEach(param => {
                initialParams[param] = '';
              });
              setDynamicParams(initialParams);
            }
          } catch (e) {
            console.error('Error parsing std_param_html:', e);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load report configuration');
      console.error('Error loading report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunReport = async () => {
    if (!reportConfig) return;

    try {
      setExecuting(true);
      setError('');

      if (reportConfig.sql_str) {
        // SQL-based report
        await executeSQLQuery();
      } else if (reportConfig.url) {
        // URL-based report
        await executeURL();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute report');
      console.error('Error executing report:', err);
    } finally {
      setExecuting(false);
    }
  };

  const executeSQLQuery = async () => {
    if (!reportConfig?.sql_str) return;

    const adhocParamHtml = reportConfig.adhoc_param_html 
      ? JSON.parse(reportConfig.adhoc_param_html) 
      : [];
    
    const dateField = ReportQueryBuilder.extractDateField(adhocParamHtml);

    const query = ReportQueryBuilder.buildQuery(reportConfig.sql_str, {
      dynamicParams,
      dateParams: reportConfig.date_param_req === 'Yes' ? {
        fromDate: dateRange.from,
        toDate: dateRange.to,
        dateField
      } : undefined,
      adhocConditions: adhocConditions.filter(c => c.fields_name && c.fields_name.trim() !== '')
    });

    console.log('Executing query:', query);

    const data = await reportRunnerService.getMasterData(query);
    const dataList = Array.isArray(data) ? data : data.content || data.items || [];
    setRows(dataList);
    setCurrentPage(1);
  };

  const executeURL = async () => {
    if (!reportConfig?.url) return;

    const data = await reportRunnerService.getAllDetailsByUrl(reportConfig.url);
    let dataList = [];

    if (data.body) {
      try {
        dataList = JSON.parse(data.body);
      } catch (e) {
        console.error('Error parsing URL response:', e);
        dataList = [];
      }
    }

    setRows(Array.isArray(dataList) ? dataList : []);
    setCurrentPage(1);
  };

  const columns = useMemo(() => {
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0]);
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;

    const lowerTerm = searchTerm.toLowerCase();
    return rows.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(lowerTerm)
      )
    );
  }, [rows, searchTerm]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const handleExportCSV = () => {
    if (rows.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = columns.join(',');
    const csvRows = rows.map(row =>
      columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '';
        const strValue = String(value);
        return strValue.includes(',') || strValue.includes('"') ? `"${strValue.replace(/"/g, '""')}"` : strValue;
      }).join(',')
    );
    const csv = [headers, ...csvRows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report?.reportName || id}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    if (rows.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const filename = `${report?.reportName || 'report'}_${new Date().toISOString().split('T')[0]}`;
      await reportRunnerService.downloadFile('xlsx', rows, filename);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel file');
    }
  };

  const getStdParamFields = (): string[] => {
    if (!reportConfig?.std_param_html) return [];
    try {
      const params = JSON.parse(reportConfig.std_param_html);
      return Array.isArray(params) ? params : [];
    } catch (e) {
      return [];
    }
  };

  const getAdhocParamFields = (): string[] => {
    if (!reportConfig?.adhoc_param_html) return [];
    try {
      const params = JSON.parse(reportConfig.adhoc_param_html);
      return Array.isArray(params) ? params : [];
    } catch (e) {
      return [];
    }
  };

  const stdParamFields = getStdParamFields();
  const adhocParamFields = getAdhocParamFields();

  return (
    <div className={`p-6 min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 to-cyan-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`mb-6 rounded-xl p-6 ${
          isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/reportrunner')}
                className={`p-2 rounded-lg transition ${
                  isDark
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400'
                    : 'hover:bg-blue-100 text-gray-600 hover:text-blue-700'
                }`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {reportConfig?.sql_str ? 'SQL Report Runner' : 'URL Report Runner'}
                  </h1>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    <Database className="w-3 h-3 inline mr-1" />
                    Data Analytics
                  </div>
                </div>
                <p className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Configure and execute reports - <span className="font-semibold">{report?.reportName || 'Report'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Section */}
        <div className={`mb-6 rounded-xl p-6 ${
          isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white shadow-md'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <Menu className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Report Parameters
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Configure date range and parameters for the report
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Range (if required) */}
            {reportConfig?.date_param_req === 'Yes' && (
              <DateRangeSelector
                dateRange={dateRange}
                onChange={setDateRange}
                isDark={isDark}
              />
            )}

            {/* Standard Parameters */}
            <DynamicParameterForm
              parameters={stdParamFields}
              values={dynamicParams}
              onChange={setDynamicParams}
              isDark={isDark}
            />
          </div>

          {/* Adhoc Parameters */}
          <div className="mt-6">
            <AdhocParameterBuilder
              conditions={adhocConditions}
              availableFields={adhocParamFields}
              onChange={setAdhocConditions}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Report Output Section */}
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Report Output
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {rows.length} records found
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                disabled={rows.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                  rows.length === 0
                    ? isDark
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => navigate('/reportrunner')}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  isDark
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleRunReport}
                disabled={executing}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition font-medium ${
                  executing
                    ? isDark
                      ? 'bg-blue-800 text-blue-300 cursor-wait'
                      : 'bg-blue-400 text-blue-100 cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {executing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Report
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className={`mb-4 p-4 rounded-lg ${
              isDark ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {/* Data Table */}
          {rows.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-16 ${
              isDark ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Data Available</p>
              <p className="text-sm">Configure your parameters and run the report to see results</p>
              <button
                onClick={handleRunReport}
                disabled={executing}
                className="mt-6 flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
              >
                <Play className="w-4 h-4" />
                Run Report
              </button>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search in results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              {/* Table */}
              <div className={`overflow-x-auto rounded-lg border ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <table className="w-full">
                  <thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-300' : 'text-gray-700'
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                    {paginatedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            className={`px-4 py-3 text-sm ${
                              isDark ? 'text-slate-300' : 'text-gray-900'
                            }`}
                          >
                            {row[col] === null || row[col] === undefined ? '-' : String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} results
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? isDark
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isDark
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : isDark
                                ? 'bg-slate-700 text-white hover:bg-slate-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? isDark
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isDark
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
