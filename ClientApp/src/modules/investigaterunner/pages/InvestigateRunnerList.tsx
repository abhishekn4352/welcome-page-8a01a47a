import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Download, Target, Info, Activity } from 'lucide-react';
import { investigateRunnerService, InvestigateRecord } from '../services/investigateRunnerService';
import { toast } from 'sonner';
import { useThemeMode } from '@/theme/ThemeProvider';

const InvestigateRunnerList = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [data, setData] = useState<InvestigateRecord[]>([]);
  const [filteredData, setFilteredData] = useState<InvestigateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState<InvestigateRecord | null>(null);

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
      const response = await investigateRunnerService.getAllInvestigations();
      const items = Array.isArray(response) ? response : response.items || response.content || [];
      setData(items);
    } catch (err) {
      setError('Failed to load investigation data');
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
      data.filter((investigation) => {
        return (
          investigation.name?.toLowerCase().includes(term) ||
          investigation.description?.toLowerCase().includes(term) ||
          String(investigation.id || '').includes(term) ||
          String(investigation.accountId || '').includes(term) ||
          String(investigation.active || '').toLowerCase().includes(term)
        );
      })
    );
  };

  const handleDownload = () => {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, 'investigations.csv');
  };

  const convertToCSV = (records: InvestigateRecord[]) => {
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

  const activeCount = useMemo(() => data.filter((i) => i.active).length, [data]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: isDark
            ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.1) 2px, rgba(59, 130, 246, 0.1) 4px)'
            : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(37, 99, 235, 0.05) 2px, rgba(37, 99, 235, 0.05) 4px)',
        }}></div>
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-400/10'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/10'
        }`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <nav className="pt-8 px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 text-sm">
            <a href="/home" className={`flex items-center gap-2 transition-all duration-200 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
            }`}>
              <Target size={16} />
              <span className="hidden md:inline font-medium">Home</span>
            </a>
            <span className={isDark ? 'text-gray-600' : 'text-blue-300'}>/</span>
            <div className={`flex items-center gap-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              <Target size={16} />
              <span className="font-medium">Investigate</span>
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
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">Investigate</span> Runner
                </h1>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Execute and monitor investigation workflows • <span className={`font-semibold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>{data.length}</span> investigations
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
                  placeholder="Search investigations..."
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
                  disabled={loading}
                  className={`p-4 rounded-xl border transition-all duration-200 disabled:opacity-50 ${
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

          {/* Loading State */}
          {loading && (
            <div className={`backdrop-blur-xl rounded-3xl p-16 mb-6 text-center shadow-2xl border ${
              isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
            }`}>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className={`w-20 h-20 border-4 rounded-full animate-spin mx-auto mb-6 ${
                    isDark ? 'border-blue-500/30 border-t-blue-500' : 'border-blue-300/40 border-t-blue-600'
                  }`}></div>
                  <p className={`text-lg font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Loading investigations...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className={`backdrop-blur-xl rounded-3xl p-16 mb-6 text-center shadow-2xl border ${
              isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
            }`}>
              <div className="w-20 h-20 rounded-2xl bg-red-500/20 border-2 border-red-400/40 flex items-center justify-center mx-auto mb-6">
                <span className="text-red-400 text-4xl font-bold">!</span>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Error</h3>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>{error}</p>
            </div>
          )}

          {/* Investigation Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6">
              {filteredData.map((investigation) => (
                <div
                  key={investigation.id}
                  onClick={() => navigate(`/investigate-runner/${investigation.id}`)}
                  className={`backdrop-blur-xl rounded-2xl p-6 transition-all duration-200 shadow-xl cursor-pointer group border ${
                    isDark
                      ? 'bg-white/5 border-blue-400/20 hover:border-blue-400/40 hover:bg-white/10'
                      : 'bg-white border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-blue-500/20">
                          <Target className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-xl truncate ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {investigation.name || `Investigation #${investigation.id}`}
                          </h3>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>ID: {investigation.id}</p>
                        </div>
                      </div>

                      {investigation.description && (
                        <p className={`text-sm mb-4 line-clamp-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {investigation.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {investigation.active && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                            Active
                          </span>
                        )}
                        {investigation.accountId && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                            Account: {investigation.accountId}
                          </span>
                        )}
                        {investigation.createdAt && (
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${
                            isDark
                              ? 'bg-white/10 border-blue-400/30 text-gray-300'
                              : 'bg-blue-50 border-blue-200 text-gray-700'
                          }`}>
                            {new Date(investigation.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvestigation(investigation);
                      }}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        isDark
                          ? 'bg-white/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20'
                          : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredData.length === 0 && !loading && (
                <div className={`backdrop-blur-xl rounded-3xl p-16 text-center border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <Target className={`w-24 h-24 mx-auto mb-6 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <p className={`text-xl mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>No investigations found</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {searchQuery ? 'Try adjusting your search terms' : 'No investigations have been created yet'}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Info Modal */}
      {selectedInvestigation && (
        <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        }`} onClick={() => setSelectedInvestigation(null)}>
          <div
            className={`rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30'
                : 'bg-white border-blue-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-8 border-b sticky top-0 ${
              isDark
                ? 'border-blue-400/20 bg-gradient-to-br from-slate-900 to-blue-900'
                : 'border-blue-200 bg-white'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Target className={`w-6 h-6 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedInvestigation.name || `Investigation #${selectedInvestigation.id}`}
                    </h2>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Investigation Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvestigation(null)}
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
                  }`}>ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedInvestigation.id}</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Status</label>
                  <div className="mt-2">
                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border ${
                      selectedInvestigation.active
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                        : 'bg-red-500/20 border-red-400/40 text-red-300'
                    }`}>
                      {selectedInvestigation.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedInvestigation.description && (
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Description</label>
                  <p className={`mt-2 font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedInvestigation.description}</p>
                </div>
              )}

              {selectedInvestigation.accountId && (
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Account ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedInvestigation.accountId}</p>
                </div>
              )}

              {selectedInvestigation.createdAt && (
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Created</label>
                  <p className={`mt-2 font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{new Date(selectedInvestigation.createdAt).toLocaleString()}</p>
                </div>
              )}

              {selectedInvestigation.updatedAt && (
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-white border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Updated</label>
                  <p className={`mt-2 font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{new Date(selectedInvestigation.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className={`p-8 border-t flex justify-end gap-3 sticky bottom-0 ${
              isDark
                ? 'border-blue-400/20 bg-gradient-to-br from-slate-900 to-blue-900'
                : 'border-blue-200 bg-white'
            }`}>
              <button
                onClick={() => setSelectedInvestigation(null)}
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
                  setSelectedInvestigation(null);
                  navigate(`/investigate-runner/${selectedInvestigation.id}`);
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

export default InvestigateRunnerList;
