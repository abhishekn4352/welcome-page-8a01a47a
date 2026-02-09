import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportRunnerService } from '../services/reportRunnerService';
import { ChevronRight, RefreshCw, Download, Info, Search, FileText, Activity, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useThemeMode } from '@/theme/ThemeProvider';

interface Report {
  id: number;
  reportName: string;
  description: string;
  isSql: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ReportRunnerList() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reportRunnerService.getAllReports();
      const reportsList = Array.isArray(data) ? data : data.content || data.items || [];
      setReports(reportsList);
      setFilteredReports(reportsList);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (!term.trim()) {
      setFilteredReports(reports);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = reports.filter(report =>
      report.reportName?.toLowerCase().includes(lowerTerm) ||
      report.description?.toLowerCase().includes(lowerTerm) ||
      report.id?.toString().includes(lowerTerm) ||
      (report.isSql ? 'SQL' : 'URL').toLowerCase().includes(lowerTerm) ||
      (report.active ? 'Active' : 'Inactive').toLowerCase().includes(lowerTerm)
    );
    setFilteredReports(filtered);
  };

  const handleExport = () => {
    if (filteredReports.length === 0) {
      alert('No reports to export');
      return;
    }

    const csv = [
      ['ID', 'Report Name', 'Description', 'Type', 'Status'].join(','),
      ...filteredReports.map(r =>
        [
          r.id,
          `"${r.reportName}"`,
          `"${r.description}"`,
          r.isSql ? 'SQL' : 'URL',
          r.active ? 'Active' : 'Inactive'
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReports.slice(startIndex, startIndex + pageSize);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const activeCount = useMemo(() => reports.filter(r => r.active).length, [reports]);

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
            <a href="/home" className={`flex items-center gap-2 transition-all duration-200 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}>
              <FileText size={16} />
              <span className="hidden md:inline font-medium">Home</span>
            </a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <FileText size={16} />
              <span className="font-medium">Report Runner</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Header Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-2xl ${isDark ? 'bg-white/5 border border-blue-500/20' : 'bg-white border border-blue-200'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className={`text-3xl md:text-5xl font-extrabold mb-3 tracking-tight`}>
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">Report Runner</span><span className={isDark ? 'text-white' : 'text-slate-900'}> </span>
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                  Manage and view SQL and URL-based reports • <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{reports.length}</span> total reports
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl w-fit shadow-lg ${isDark ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30' : 'bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300'}`}>
                  <Activity size={22} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
                  <span className={`text-sm font-semibold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>{activeCount} Active</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`p-3 rounded-lg transition-colors ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'}`}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>

            {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
              <input
                type="text"
                placeholder="Search by name, description, or type..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full pl-12 pr-12 py-4 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-opacity-15 transition-all duration-200 font-medium ${
                  isDark ? 'bg-white/10 border border-blue-400/30 text-white placeholder-gray-500' : 'bg-white/80 border border-blue-200 text-slate-900 placeholder-slate-500'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 font-bold text-lg ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  ×
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={loadData}
                className={`p-4 rounded-xl border transition-all duration-200 ${isDark ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400'}`}
                title="Refresh"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleExport}
                className={`px-5 py-4 rounded-xl border text-white flex items-center gap-2 font-semibold shadow-lg transition-all duration-200 ${
                  isDark ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-500 border-emerald-600 hover:bg-emerald-600'
                }`}
              >
                <Download size={20} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && filteredReports.length > 0 && (
          <div className={`backdrop-blur-xl rounded-2xl p-5 mb-6 shadow-lg ${isDark ? 'bg-blue-500/10 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Search size={22} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Search Results</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    Found <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{filteredReports.length}</span> report{filteredReports.length !== 1 ? 's' : ''} for <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>"{searchTerm}"</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSearch('')}
                className={`px-5 py-2 text-sm rounded-xl border font-semibold transition-all duration-200 ${isDark ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={`backdrop-blur-xl rounded-3xl p-16 mb-6 text-center shadow-lg ${isDark ? 'bg-white/5 border border-blue-400/20' : 'bg-white border border-blue-100'}`}>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 flex items-center justify-center ${
              isDark ? 'bg-red-500/20 border-red-400/40' : 'bg-red-50 border-red-200'
            }`}>
              <span className={`text-4xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>!</span>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Error Loading Reports</h3>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{error}</p>
            <button
              onClick={loadData}
              className={`px-6 py-3 rounded-xl border flex items-center gap-2 mx-auto font-semibold transition-all duration-200 ${isDark ? 'bg-blue-500/20 border-blue-400/40 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200'}`}
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredReports.length === 0 && (
          <div className={`backdrop-blur-xl rounded-3xl p-16 mb-6 text-center shadow-lg ${isDark ? 'bg-white/5 border border-blue-400/20' : 'bg-white border border-blue-100'}`}>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <FileText className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Reports Found</h3>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {searchTerm ? `No reports found for "${searchTerm}"` : 'No reports available'}
            </p>
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className={`mt-6 px-6 py-3 rounded-xl border font-semibold transition-all duration-200 ${isDark ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-500/30' : 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200'}`}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Reports Table */}
        {!loading && !error && filteredReports.length > 0 && (
          <div className={`backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-white/5 border border-blue-400/20' : 'bg-white border border-blue-100'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-blue-400/20 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Name</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Type</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Description</th>
                    <th className={`px-6 py-4 text-right text-sm font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.id} className={`border-b transition-all duration-200 ${isDark ? 'border-blue-400/10 hover:bg-blue-500/10' : 'border-blue-100 hover:bg-blue-50'}`}>
                    <td className={`px-6 py-5`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg`}>
                          <FileText size={16} className="text-white" />
                        </div>
                        <span className={`font-semibold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.reportName}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-5`}>
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                        report.isSql
                          ? isDark ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                          : isDark ? 'bg-sky-500/20 border-sky-400/40 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-700'
                      }`}>
                        {report.isSql ? 'SQL' : 'URL'}
                      </span>
                    </td>
                    <td className={`px-6 py-5`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${report.active ? 'bg-emerald-400 animate-pulse' : isDark ? 'bg-red-400' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-semibold ${
                          report.active ? 'text-emerald-400' : isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {report.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-5`}>
                      <span className={`text-sm truncate max-w-xs inline-block ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{report.description}</span>
                    </td>
                    <td className={`px-6 py-5 text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowModal(true);
                          }}
                          className={`p-3 rounded-xl border transition-all duration-200 ${isDark ? 'bg-white/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                          title="Info"
                        >
                          <Info size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/reportrunner/${report.id}`)}
                          className={`p-3 rounded-xl border transition-all duration-200 ${isDark ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-500/30' : 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200'}`}
                          title="View"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`border-t px-6 py-4 flex items-center justify-between ${isDark ? 'border-blue-400/20' : 'border-blue-200'}`}>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  Page {currentPage} of {totalPages} ({filteredReports.length} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-xl border font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const page = Math.max(1, currentPage - 2) + i;
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                          page === currentPage
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border border-blue-400 text-white shadow-lg'
                            : isDark ? 'bg-white/10 border border-blue-400/30 text-blue-200 hover:bg-blue-500/20' : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-xl border font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      {/* Info Modal */}
      {showModal && selectedReport && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-black/40 backdrop-blur-sm'}`}>
          <div className={`rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${
            isDark ? 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30' : 'bg-white border-blue-200'
          }`}>
            <div className={`p-8 border-b sticky top-0 ${isDark ? 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>📋 Report Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`text-3xl font-light p-2 rounded-lg transition-all duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'}`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Name</label>
                  <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.reportName}</p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'}`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Type</label>
                  <div className="mt-2">
                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border ${
                      selectedReport.isSql
                        ? isDark ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : isDark ? 'bg-sky-500/20 border-sky-400/40 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-700'
                    }`}>
                      {selectedReport.isSql ? 'SQL' : 'URL'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'}`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedReport.active ? 'bg-emerald-400 animate-pulse' : isDark ? 'bg-red-400' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-semibold ${
                      selectedReport.active ? 'text-emerald-400' : isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {selectedReport.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'}`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>ID</label>
                  <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.id}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'}`}>
                <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Description</label>
                <p className={`mt-2 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.description || 'No description'}</p>
              </div>
            </div>

            <div className={`p-8 border-t flex justify-end gap-3 sticky bottom-0 ${isDark ? 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              <button
                onClick={() => setShowModal(false)}
                className={`px-6 py-3 rounded-xl border font-semibold transition-all duration-200 ${isDark ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate(`/reportrunner/${selectedReport.id}`);
                }}
                className={`px-6 py-3 rounded-xl border text-white font-semibold shadow-lg transition-all duration-200 ${isDark ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400 hover:from-blue-600 hover:to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-700 hover:from-blue-700 hover:to-indigo-700'}`}
                              className={`px-6 py-3 rounded-xl border text-white font-semibold shadow-lg transition-all duration-200 ${isDark ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 border-blue-500 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-xl' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 border-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-xl'}`}
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
