import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeMode } from '@/theme/ThemeProvider';
import { ArrowLeft, RefreshCw, Search, Download, Radar } from 'lucide-react';
import { trackerRunnerService, TrackerRecord } from '../services/trackerRunnerService';

const TrackerRunnerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const trackerId = Number(id);

  const [tracker, setTracker] = useState<TrackerRecord | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!Number.isNaN(trackerId)) {
      loadData(trackerId);
    }
  }, [trackerId]);

  useEffect(() => {
    filterRows();
  }, [rows, searchQuery]);

  const loadData = async (idValue: number) => {
    setLoading(true);
    setError(null);
    try {
      const [trackerRes, rowsRes] = await Promise.all([
        trackerRunnerService.getTrackerById(idValue),
        trackerRunnerService.getTrackerDataById(idValue),
      ]);

      setTracker(trackerRes || null);
      const list = Array.isArray(rowsRes) ? rowsRes : rowsRes?.data || [];
      setRows(list);
    } catch (err) {
      setError('Failed to load tracker data');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRows = () => {
    if (!searchQuery.trim()) {
      setFilteredRows(rows);
      setCurrentPage(1);
      return;
    }

    const term = searchQuery.toLowerCase().trim();
    const filtered = rows.filter((row) => {
      return Object.values(row || {}).some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      );
    });

    setFilteredRows(filtered);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    const csv = convertToCSV(filteredRows);
    downloadCSV(csv, `tracker_${trackerId}_data.csv`);
  };

  const convertToCSV = (records: any[]) => {
    if (!records.length) return '';
    const headers = Object.keys(records[0]);
    const rowsCsv = records.map((r) => headers.map((h) => `"${r[h] ?? ''}"`).join(','));
    return [headers.join(','), ...rowsCsv].join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = useMemo(() => {
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0]);
  }, [rows]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(startIdx, startIdx + pageSize);

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50'
    }`}>
      {!isDark && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.1) 2px, rgba(59, 130, 246, 0.1) 4px)',
          }}></div>
        </div>
      )}

      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        <div className={`border rounded-2xl p-6 mb-6 ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-blue-200 shadow-lg'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate('/trackerrunner')}
                className={`mt-1 p-2 rounded-lg border transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                title="Back"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Tracker</span> Runner
                </h1>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                  {tracker?.name || 'Tracker'} - {rows.length} rows
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${
              isDark
                ? 'bg-slate-700 border-slate-600'
                : 'bg-blue-100 border-blue-300'
            }`}>
              <Radar size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>ID: {trackerId}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-500' : 'text-gray-400'
              }`} size={18} />
              <input
                type="text"
                placeholder="Search rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none transition ${
                  isDark
                    ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-gray-50 border border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${
                    isDark
                      ? 'text-slate-500 hover:text-slate-300'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  x
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => loadData(trackerId)}
                className={`p-3 rounded-lg border transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleDownload}
                className={`px-4 py-3 rounded-xl border transition flex items-center gap-2 font-semibold shadow-lg ${isDark ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300 hover:from-emerald-500/30 hover:to-green-500/30' : 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 text-emerald-700 hover:from-emerald-200 hover:to-green-200'}`}
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`border rounded-2xl p-6 ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-blue-200 shadow-lg'
        }`}>
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
                  isDark
                    ? 'border-slate-700 border-t-blue-500'
                    : 'border-blue-200 border-t-blue-600'
                }`}></div>
                <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Loading tracker data...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-4 ${
                  isDark
                    ? 'bg-red-900/20 border-red-800'
                    : 'bg-red-100 border-red-300'
                }`}>
                  <span className={`text-2xl ${isDark ? 'text-red-400' : 'text-red-600'}`}>!</span>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Unable to Load Data</h3>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>{error}</p>
                <button
                  onClick={() => loadData(trackerId)}
                  className={`mt-4 px-6 py-3 rounded-xl border transition flex items-center gap-2 mx-auto font-semibold shadow-lg ${isDark ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 border-blue-500 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-xl' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 border-blue-700 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-xl'}`}
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && pageRows.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      isDark
                        ? 'border-slate-700 bg-slate-700'
                        : 'border-blue-200 bg-blue-50'
                    }`}>
                      {columns.map((col) => (
                        <th key={col} className={`px-4 py-3 text-left text-sm font-semibold ${
                          isDark ? 'text-slate-100' : 'text-blue-900'
                        }`}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => (
                      <tr key={idx} className={`border-b transition ${
                        isDark
                          ? 'border-slate-700 hover:bg-slate-700'
                          : 'border-gray-100 hover:bg-blue-50'
                      }`}>
                        {columns.map((col) => (
                          <td key={col} className={`px-4 py-3 text-sm ${
                            isDark ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            {String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={`mt-6 flex items-center justify-between border-t pt-6 ${
                  isDark ? 'border-slate-700' : 'border-blue-200'
                }`}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className={`px-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition ${
                              currentPage === page
                                ? 'bg-blue-600 border border-blue-700 text-white'
                                : isDark
                                ? 'bg-slate-700 border border-slate-600 text-slate-100 hover:bg-slate-600'
                                : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !error && pageRows.length === 0 && (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Radar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Data Available</h3>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>No rows returned for this tracker</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackerRunnerView;
