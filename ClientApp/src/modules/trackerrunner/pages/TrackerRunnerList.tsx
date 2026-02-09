import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Download, Radar, Info, Activity, Moon, Sun } from 'lucide-react';
import { trackerRunnerService, TrackerRecord } from '../services/trackerRunnerService';
import { useThemeMode } from '@/theme/ThemeProvider';
import { toast } from 'sonner';

const TrackerRunnerList = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';
  const [data, setData] = useState<TrackerRecord[]>([]);
  const [filteredData, setFilteredData] = useState<TrackerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracker, setSelectedTracker] = useState<TrackerRecord | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await trackerRunnerService.getAllTrackers();
      const items = Array.isArray(response) ? response : response.items || response.content || [];
      setData(items);
    } catch (err) {
      setError('Failed to load tracker data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const term = searchQuery.toLowerCase().trim();
    setFilteredData(
      data.filter((tracker) => {
        return (
          tracker.name?.toLowerCase().includes(term) ||
          tracker.description?.toLowerCase().includes(term) ||
          String(tracker.id || '').includes(term) ||
          String(tracker.accountId || '').includes(term) ||
          String(tracker.active || '').toLowerCase().includes(term)
        );
      })
    );
  };

  const handleDownload = () => {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, 'trackers.csv');
  };

  const convertToCSV = (records: TrackerRecord[]) => {
    const headers = ['ID', 'Name', 'Description', 'Account ID', 'Active', 'Created At'];
    const rows = records.map((r) => [
      r.id || '',
      r.name || '',
      r.description || '',
      r.accountId || '',
      String(r.active ?? ''),
      r.createdAt || '',
    ]);

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
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

  const activeCount = useMemo(() => data.filter((t) => t.active).length, [data]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: isDark ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.1) 2px, rgba(59, 130, 246, 0.1) 4px)' : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(37, 99, 235, 0.05) 2px, rgba(37, 99, 235, 0.05) 4px)',
        }}></div>
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/10'}`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/10'}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <nav className="pt-8 px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 text-sm">
            <a href="/home" className={`flex items-center gap-2 transition-all duration-200 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
            }`}>
              <Radar size={16} />
              <span className="hidden md:inline font-medium">Home</span>
            </a>
            <span className={isDark ? 'text-gray-600' : 'text-blue-300'}>/</span>
            <div className={`flex items-center gap-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              <Radar size={16} />
              <span className="font-medium">Tracker Management</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Header Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-2xl border transition-colors duration-200 ${
            isDark ? 'bg-white/5 border-blue-500/20' : 'bg-white border-blue-200'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className={`text-3xl md:text-5xl font-extrabold mb-3 tracking-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">Tracker</span>
                </h1>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Monitor tracker configurations • <span className={`font-semibold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>{data.length}</span> trackers
                </p>
              </div>
              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border w-fit shadow-lg ${
                isDark
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
              }`}>
                <Activity size={22} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
                <span className={`text-sm font-semibold ${
                  isDark ? 'text-blue-200' : 'text-blue-700'
                }`}>Active: {activeCount}</span>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} size={20} />
                <input
                  type="text"
                  placeholder="Search trackers by name, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:outline-none transition-all duration-200 font-medium ${
                    isDark
                      ? 'bg-white/10 border-blue-400/30 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15'
                      : 'bg-white border-blue-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 font-bold text-lg ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={loadData}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isDark
                      ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400'
                      : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                  }`}
                  title="Refresh"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={handleDownload}
                  className={`px-5 py-4 rounded-xl border transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300 hover:from-emerald-500/30 hover:to-green-500/30'
                      : 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 text-emerald-700 hover:from-emerald-200 hover:to-green-200'
                  }`}
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && filteredData.length > 0 && (
            <div className={`backdrop-blur-xl rounded-2xl p-5 mb-6 shadow-lg border ${
              isDark ? 'bg-blue-500/10 border-blue-400/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Search size={22} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Search Results</h4>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Found <span className={`font-semibold ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>{filteredData.length}</span> tracker{filteredData.length !== 1 ? 's' : ''} for <span className={`font-medium ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>"{searchQuery}"</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-5 py-2 text-sm rounded-xl border transition-all duration-200 font-semibold ${
                    isDark
                      ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20'
                      : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {searchQuery && filteredData.length === 0 && (
            <div className={`backdrop-blur-xl rounded-3xl p-16 mb-6 text-center border ${
              isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
            }`}>
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-blue-500/10' : 'bg-blue-100'
              }`}>
                <Search className={`w-10 h-10 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>No Results Found</h3>
              <p className={`mb-6 text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No trackers found for <span className={`font-semibold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>"{searchQuery}"</span>
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className={`px-6 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                  isDark
                    ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-500/30'
                    : 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Data Container */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl border ${
            isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
          }`}>
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`w-20 h-20 border-4 rounded-full animate-spin mx-auto mb-6 ${
                    isDark ? 'border-blue-500/30 border-t-blue-500' : 'border-blue-300/40 border-t-blue-600'
                  }`}></div>
                  <p className={`text-lg font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Loading tracker data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-red-500/20 border-2 border-red-400/40 flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-400 text-4xl font-bold">!</span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Unable to Load Data</h3>
                  <p className={`text-lg mb-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{error}</p>
                  <button
                    onClick={loadData}
                    className={`px-6 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2 mx-auto font-semibold ${
                      isDark
                        ? 'bg-blue-500/20 border-blue-400/40 text-blue-300 hover:bg-blue-500/30'
                        : 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <RefreshCw size={18} />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Table View */}
            {!loading && !error && filteredData.length > 0 && (
              <div className="overflow-x-auto rounded-2xl">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      isDark ? 'border-blue-400/20 bg-blue-500/10' : 'border-blue-200 bg-blue-50'
                    }`}>
                      <th className={`px-6 py-4 text-left text-sm font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Radar size={18} className="text-blue-400" />
                          Tracker
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>Description</th>
                      <th className={`px-6 py-4 text-left text-sm font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((tracker) => (
                      <tr key={tracker.id} className={`border-b transition-all duration-200 ${
                        isDark ? 'border-blue-400/10 hover:bg-blue-500/10' : 'border-blue-100 hover:bg-blue-50'
                      }`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                              <Radar size={16} className="text-white" />
                            </div>
                            <div>
                              <button
                                onClick={() => navigate(`/trackerrunner/${tracker.id}`)}
                                className={`font-semibold text-base transition-all ${
                                  isDark ? 'text-white hover:text-blue-300' : 'text-gray-900 hover:text-blue-700'
                                }`}
                              >
                                {tracker.name || 'N/A'}
                              </button>
                              <div className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>ID: {tracker.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-sm line-clamp-2 max-w-[420px] ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {tracker.description || 'No description provided'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border ${
                            tracker.active
                              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                              : 'bg-red-500/20 border-red-400/40 text-red-300'
                          }`}>
                            {tracker.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedTracker(tracker)}
                              className={`p-3 rounded-xl border transition-all duration-200 ${
                                isDark
                                  ? 'bg-white/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20'
                                  : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                              }`}
                              title="View Info"
                            >
                              <Info size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/trackerrunner/${tracker.id}`)}
                              className={`px-4 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                                isDark
                                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/40 text-blue-200 hover:from-blue-500/30 hover:to-indigo-500/30'
                                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-700 hover:from-blue-200 hover:to-indigo-200'
                              }`}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredData.length === 0 && !searchQuery && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-blue-500/10' : 'bg-blue-100'
                  }`}>
                    <Radar className={`w-12 h-12 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No Trackers Found</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>No tracker records available</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Tracker Details Modal */}
      {selectedTracker && (
        <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        }`}>
          <div className={`rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30'
              : 'bg-white border-blue-200'
          }`}>
            <div className={`p-8 border-b sticky top-0 ${
              isDark
                ? 'border-blue-400/20 bg-gradient-to-br from-slate-900 to-blue-900'
                : 'border-blue-200 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Radar className={`w-6 h-6 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Tracker Details</h2>
                </div>
                <button
                  onClick={() => setSelectedTracker(null)}
                  className={`text-2xl transition-all ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  ×
                </button>
              </div>
            </div>

              <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Tracker Name</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedTracker.name || 'N/A'}</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Status</label>
                  <div className="mt-2">
                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border ${
                      selectedTracker.active
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                        : 'bg-red-500/20 border-red-400/40 text-red-300'
                    }`}>
                      {selectedTracker.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedTracker.id}</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Account ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedTracker.accountId || 'N/A'}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
              }`}>
                <label className={`text-xs font-bold uppercase tracking-wide ${
                  isDark ? 'text-blue-300' : 'text-blue-700'
                }`}>Description</label>
                <p className={`mt-2 font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{selectedTracker.description || 'No description'}</p>
              </div>

              {selectedTracker.createdAt && (
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Created At</label>
                  <p className={`mt-2 font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedTracker.createdAt}</p>
                </div>
              )}
            </div>

            <div className={`p-8 border-t flex justify-end gap-3 sticky bottom-0 ${
              isDark
                ? 'border-blue-400/20 bg-gradient-to-br from-slate-900 to-blue-900'
                : 'border-blue-200 bg-white'
            }`}>
              <button
                onClick={() => setSelectedTracker(null)}
                className={`px-6 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                  isDark
                    ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20'
                    : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedTracker(null);
                  navigate(`/trackerrunner/${selectedTracker.id}`);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 border border-blue-400 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-semibold shadow-lg"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerRunnerList;
