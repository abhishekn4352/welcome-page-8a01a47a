import React, { useEffect, useState } from 'react';
import { RefreshCw, Search, Download, Eye, Database, Microchip, Tag, Building } from 'lucide-react';
import { dynamicFormDataService, DynamicFormRecord, FormSetup, DynamicFormComponent } from '../services/dynamicFormDataService';
import { useThemeMode } from '@/theme/ThemeProvider';
import { toast } from 'sonner';

const DynamicFormDataPage = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [forms, setForms] = useState<FormSetup[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormSetup | null>(null);
  const [data, setData] = useState<DynamicFormRecord[]>([]);
  const [filteredData, setFilteredData] = useState<DynamicFormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCardView, setIsCardView] = useState(false);
  const pageSize = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DynamicFormRecord | null>(null);

  // Load available forms on mount
  useEffect(() => {
    loadForms();
  }, []);

  // Load data and form structure when form is selected
  useEffect(() => {
    if (selectedFormId !== null) {
      loadFormStructure();
      loadData();
    }
  }, [selectedFormId]);

  useEffect(() => {
    filterData();
  }, [data, searchQuery]);

  const loadForms = async () => {
    setFormsLoading(true);
    try {
      const response = await dynamicFormDataService.getAllForms();
      
      let formsList: FormSetup[] = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        formsList = response;
      } else if (response && typeof response === 'object') {
        formsList = response.items || response.content || response.data || [];
      }
      
      setForms(formsList);
      
      // Auto-select first form if available
      if (formsList.length > 0) {
        const firstFormId = formsList[0].form_id || formsList[0].id || null;
        setSelectedFormId(firstFormId as number);
      }
    } catch (error: any) {
      console.error('Failed to load forms', error);
      toast.error('Failed to load forms');
      setForms([]);
    } finally {
      setFormsLoading(false);
    }
  };

  const loadFormStructure = async () => {
    if (!selectedFormId) return;
    try {
      const form = await dynamicFormDataService.getFormById(selectedFormId);
      setSelectedForm(form);
    } catch (error: any) {
      console.warn('Form structure not available, will infer from data', error);
      // Allow continuing without form structure - we'll infer from data
      setSelectedForm(null);
    }
  };

  const loadData = async () => {
    if (!selectedFormId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await dynamicFormDataService.getAllDynamicFormData(selectedFormId);
      
      let items: DynamicFormRecord[] = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        items = response;
      } else if (response && typeof response === 'object') {
        items = response.items || response.content || response.data || [];
      }
      
      setData(items);
    } catch (error: any) {
      console.error('Failed to load dynamic form data', error);
      setError('Failed to load dynamic form data');
      toast.error('Failed to load data for selected form');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = data.filter((record) => {
      // Search across all fields
      return Object.values(record).some((value) =>
        value && String(value).toLowerCase().includes(query)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Get field label from component mapping
  const getFieldLabel = (mapping: string): string => {
    if (!selectedForm?.components) return mapping;
    const component = selectedForm.components.find((c) => c.mapping === mapping);
    return component?.label || mapping;
  };

  // Get visible columns based on form components
  const getVisibleColumns = (): string[] => {
    if (!selectedForm?.components) return ['id', 'form_id'];
    return ['id', ...selectedForm.components.map((c) => c.mapping)];
  };

  const handleOpenModal = (record: DynamicFormRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleDownload = () => {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, `${selectedForm?.form_name || 'form-data'}.csv`);
  };

  const convertToCSV = (records: DynamicFormRecord[]) => {
    if (!selectedForm?.components) {
      return 'No data to export';
    }

    const headers = ['ID', 'Form ID', ...selectedForm.components.map((c) => c.label), 'Created By', 'Created At'];
    const rows = records.map((r) => [
      r.id,
      r.form_id,
      ...selectedForm.components!.map((c) => r[c.mapping] || ''),
      r.createdBy || '',
      r.createdAt || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
    return csvContent;
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

  const getDisplayData = () => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  };

  const getTotalPages = () => Math.ceil(filteredData.length / pageSize);
  const totalPages = getTotalPages();
  const displayData = getDisplayData();
  const startIdx = (currentPage - 1) * pageSize;

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-3'}`} style={{
          backgroundImage: isDark
            ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.12) 2px, rgba(59, 130, 246, 0.12) 4px)'
            : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.06) 2px, rgba(59, 130, 246, 0.06) 4px)',
        }}></div>
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-200/20'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-500/20' : 'bg-indigo-200/20'
        }`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <nav className="pt-8 px-6 max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="flex items-center space-x-3 text-sm">
              <a href="/home" className={`flex items-center gap-2 transition-all duration-200 ${
                isDark ? 'text-gray-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
              }`}>
                <Database size={16} />
                <span className="hidden md:inline font-medium">Home</span>
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-slate-400'}>/</span>
              <div className={`flex items-center gap-2 font-medium ${
                isDark ? 'text-blue-300' : 'text-blue-700'
              }`}>
                <Database size={16} />
                <span>Dynamic Form</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Header Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-2xl border transition-colors duration-300 ${
            isDark
              ? 'bg-white/5 border-blue-500/20'
              : 'bg-white/80 border-blue-200'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className={`text-3xl md:text-5xl font-extrabold mb-3 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span className={`bg-gradient-to-r to-blue-600 text-transparent bg-clip-text ${
                    isDark ? 'from-blue-400 via-indigo-400' : 'from-blue-600 via-indigo-600'
                  }`}>Dynamic Form</span>
                </h1>
                <p className={`text-lg ${
                  isDark ? 'text-gray-200' : 'text-slate-700'
                }`}>
                  View dynamic form data • <span className={`font-semibold ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>{data.length}</span> total records
                </p>
              </div>
              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border w-fit shadow-lg transition-colors duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
              }`}>
                <Microchip size={22} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
                <span className={`text-sm font-semibold ${
                  isDark ? 'text-blue-200' : 'text-blue-700'
                }`}>IoT Data Stream</span>
              </div>
            </div>

            {/* Search Bar & Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} size={20} />
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none transition-all duration-200 font-medium ${
                    isDark
                      ? 'bg-gray-800 border-blue-400/50 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-700'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-blue-50'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 font-bold text-lg ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
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
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-800 border-blue-400/50 text-blue-200 hover:bg-blue-900 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                  title="Refresh"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={data.length === 0}
                  className={`px-5 py-4 rounded-xl border flex items-center gap-2 font-semibold shadow-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300 hover:from-emerald-500/30 hover:to-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 text-emerald-700 hover:from-emerald-200 hover:to-green-200 disabled:opacity-50 disabled:cursor-not-allowed'
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
            <div className={`backdrop-blur-xl border rounded-2xl p-5 mb-6 shadow-lg transition-colors duration-300 ${
              isDark
                ? 'bg-blue-500/10 border-blue-400/30'
                : 'bg-blue-100/50 border-blue-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-200'
                  }`}>
                    <Search size={22} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Search Results</h4>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-200' : 'text-slate-700'
                    }`}>
                      Found <span className={`font-semibold ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>{filteredData.length}</span> record{filteredData.length !== 1 ? 's' : ''} for <span className={`font-medium ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>"{searchQuery}"</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-5 py-2 text-sm rounded-xl border transition-all duration-200 font-semibold ${
                    isDark
                      ? 'bg-white/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20'
                      : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>
          )}  

          {/* No Search Results */}
          {searchQuery && filteredData.length === 0 && (
            <div className={`backdrop-blur-xl border rounded-3xl p-16 mb-6 text-center transition-colors duration-300 ${
              isDark
                ? 'bg-white/5 border-blue-400/20'
                : 'bg-white/80 border-blue-200'
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
                isDark ? 'text-gray-200' : 'text-slate-700'
              }`}>
                No data found for <span className={`font-semibold ${
                  isDark ? 'text-blue-300' : 'text-blue-700'
                }`}>"{searchQuery}"</span>
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className={`px-6 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                  isDark
                    ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-500/30'
                    : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Data Container */}
          <div className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-colors duration-300 ${
            isDark
              ? 'bg-white/5 border-blue-400/20'
              : 'bg-white/80 border-blue-200'
          }`}>
            {/* Loading State */}
            {loading && selectedFormId && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`w-20 h-20 border-4 rounded-full animate-spin mx-auto mb-6 ${
                    isDark
                      ? 'border-blue-500/30 border-t-blue-500'
                      : 'border-blue-300 border-t-blue-600'
                  }`}></div>
                  <p className={`text-lg font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Loading form data...</p>
                </div>
              </div>
            )}



            {/* No Forms Available - Hidden since manual input is available */}
            {false && !formsLoading && forms.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-orange-500/10' : 'bg-orange-100'
                  }`}>
                    <Database className={`w-10 h-10 ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No Forms Available</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    No forms are configured yet. Please contact your administrator.
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center mx-auto mb-6 ${
                    isDark
                      ? 'bg-red-500/20 border-red-400/40'
                      : 'bg-red-100 border-red-300'
                  }`}>
                    <span className={`text-4xl font-bold ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}>!</span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Unable to Load Data</h3>
                  <p className={`text-lg mb-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{error}</p>
                  <button
                    onClick={loadData}
                    className={`mt-4 px-6 py-3 rounded-xl border flex items-center gap-2 mx-auto font-semibold transition-all duration-200 ${
                      isDark
                        ? 'bg-blue-500/20 border-blue-400/40 text-blue-300 hover:bg-blue-500/30'
                        : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <RefreshCw size={18} />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Table View */}
            {!loading && !error && !isCardView && displayData.length > 0 && (
              <div className="overflow-x-auto rounded-2xl">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      isDark
                        ? 'border-blue-400/20 bg-blue-500/10'
                        : 'border-blue-300 bg-blue-100'
                    }`}>
                      <th className={`px-4 py-4 text-left text-sm font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>ID</th>
                      {selectedForm?.components ? (
                        selectedForm.components.slice(0, 5).map((component) => (
                          <th key={component.mapping} className={`px-4 py-4 text-left text-sm font-bold ${
                            isDark ? 'text-blue-200' : 'text-blue-700'
                          }`}>
                            {component.label}
                          </th>
                        ))
                      ) : (
                        // Fallback: show first 5 fields from data
                        displayData.length > 0 && Object.keys(displayData[0])
                          .filter(key => !['id', 'form_id', 'form_version', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(key))
                          .slice(0, 5)
                          .map(key => (
                            <th key={key} className={`px-4 py-4 text-left text-sm font-bold ${
                              isDark ? 'text-blue-200' : 'text-blue-700'
                            }`}>
                              {key}
                            </th>
                          ))
                      )}
                      <th className={`px-4 py-4 text-left text-sm font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-700'
                      }`}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((record) => (
                      <tr key={record.id} className={`border-b transition-all duration-200 ${
                        isDark
                          ? 'border-blue-400/10 hover:bg-blue-500/10'
                          : 'border-blue-200 hover:bg-blue-50'
                      }`}>
                        <td className={`px-4 py-5 font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{record.id}</td>
                        {selectedForm?.components ? (
                          selectedForm.components.slice(0, 5).map((component) => (
                            <td key={component.mapping} className="px-4 py-5">
                              <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>
                                {String(record[component.mapping] || 'N/A').substring(0, 50)}
                              </span>
                            </td>
                          ))
                        ) : (
                          // Fallback: show first 5 field values
                          Object.keys(record)
                            .filter(key => !['id', 'form_id', 'form_version', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(key))
                            .slice(0, 5)
                            .map(key => (
                              <td key={key} className="px-4 py-5">
                                <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>
                                  {String(record[key] || 'N/A').substring(0, 50)}
                                </span>
                              </td>
                            ))
                        )}
                        <td className="px-4 py-5">
                          <button
                            onClick={() => handleOpenModal(record)}
                            className={`p-2 rounded-lg border transition-all duration-200 ${
                              isDark
                                ? 'bg-blue-500/20 border-blue-400/40 text-blue-300 hover:bg-blue-500/30'
                                : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                            }`}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Card View */}
            {!loading && !error && isCardView && displayData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayData.map((record) => (
                  <div
                    key={record.id}
                    className={`backdrop-blur-xl border rounded-2xl p-6 transition-all duration-200 shadow-xl ${
                      isDark
                        ? 'bg-white/5 border-blue-400/20 hover:border-blue-400/40 hover:bg-white/10'
                        : 'bg-white/80 border-blue-200 hover:border-blue-400 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h4 className={`font-bold text-base ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>Record #{record.id}</h4>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>{selectedForm?.form_name || `Form ${selectedFormId}`}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                        {selectedForm?.components ? (
                        selectedForm.components.slice(0, 4).map((component) => (
                          <div key={component.mapping}>
                            <label className={`text-xs font-bold uppercase tracking-wide ${
                              isDark ? 'text-blue-200' : 'text-blue-800'
                            }`}>{component.label}</label>
                            <p className={`text-sm truncate mt-1.5 font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>{record[component.mapping] || 'N/A'}</p>
                          </div>
                        ))
                      ) : (
                        // Fallback: show first 4 fields from data
                        Object.keys(record)
                          .filter(key => !['id', 'form_id', 'form_version', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(key))
                          .slice(0, 4)
                          .map(key => (
                            <div key={key}>
                              <label className={`text-xs font-bold uppercase tracking-wide ${
                                isDark ? 'text-blue-200' : 'text-blue-800'
                              }`}>{key}</label>
                              <p className={`text-sm truncate mt-1.5 font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>{record[key] || 'N/A'}</p>
                            </div>
                          ))
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenModal(record)}
                      className={`w-full mt-4 px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all duration-200 shadow-lg ${
                        isDark
                          ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/40 text-blue-200 hover:from-blue-500/30 hover:to-indigo-500/30'
                          : 'bg-gradient-to-r from-blue-200 to-indigo-200 border-blue-300 text-blue-700 hover:from-blue-300 hover:to-indigo-300'
                      }`}
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && selectedFormId && displayData.length === 0 && !searchQuery && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-purple-500/10' : 'bg-purple-100'
                  }`}>
                    <Database className={`w-12 h-12 ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No Data Available</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>No records found for the selected form</p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-purple-400/20 pt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-xl border transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-slate-800 border-blue-400/30 text-blue-200 hover:bg-slate-700'
                      : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-2 text-gray-500 font-bold">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border border-blue-400 text-white shadow-lg'
                              : isDark
                                ? 'bg-slate-800 border border-blue-400/30 text-blue-200 hover:bg-slate-700'
                                : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
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
                  className={`px-6 py-3 rounded-xl border transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-slate-800 border-blue-400/30 text-blue-200 hover:bg-slate-700'
                      : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal - View Only */}
      {showModal && selectedRecord && (
        <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        }`}>
          <div className={`rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30'
              : 'bg-white border-blue-200'
          }`}>
            <div className={`p-8 border-b sticky top-0 ${
              isDark
                ? 'border-blue-400/20 bg-gradient-to-br from-slate-900 to-blue-900'
                : 'border-blue-200 bg-white'
            }`}>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>📊 View Record Details</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedRecord?.id}</p>
                </div>
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Project ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedRecord?.projectId || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Device Category ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedRecord?.deviceCategoryId || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  <label className={`text-xs font-bold uppercase tracking-wide ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>Device ID</label>
                  <p className={`mt-2 text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{selectedRecord?.deviceId || 'N/A'}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
              }`}>
                <label className={`text-xs font-bold uppercase tracking-wide ${
                  isDark ? 'text-blue-300' : 'text-blue-700'
                }`}>URL</label>
                <p className={`mt-2 break-all font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{selectedRecord?.url || 'N/A'}</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
              }`}>
                <label className={`text-xs font-bold uppercase tracking-wide mb-3 block ${
                  isDark ? 'text-blue-300' : 'text-blue-700'
                }`}>Payload</label>
                <pre className={`border p-4 rounded-xl text-sm overflow-auto max-h-48 font-mono ${
                  isDark
                    ? 'bg-slate-950 border-blue-400/20 text-gray-200'
                    : 'bg-slate-50 border-blue-200 text-slate-800'
                }`}>
                  {JSON.stringify(selectedRecord?.payload, null, 2) || 'N/A'}
                </pre>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-white/5 border-blue-400/20' : 'bg-blue-50 border-blue-200'
              }`}>
                <label className={`text-xs font-bold uppercase tracking-wide mb-3 block ${
                  isDark ? 'text-blue-300' : 'text-blue-700'
                }`}>Mapped Payload</label>
                <pre className={`border p-4 rounded-xl text-sm overflow-auto max-h-48 font-mono ${
                  isDark
                    ? 'bg-slate-950 border-blue-400/20 text-gray-200'
                    : 'bg-slate-50 border-blue-200 text-slate-800'
                }`}>
                  {JSON.stringify(selectedRecord?.mappedPayload, null, 2) || 'N/A'}
                </pre>
              </div>
            </div>

            <div className={`p-8 border-t flex justify-end gap-3 sticky bottom-0 ${
              isDark
                ? 'border-blue-400/20 bg-gradient-to-br from-slate-900 to-blue-900'
                : 'border-blue-200 bg-white'
            }`}>
              <button
                onClick={handleCloseModal}
                className={`px-6 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                  isDark
                    ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 hover:bg-blue-500/30'
                    : 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFormDataPage;
