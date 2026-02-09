import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dynamicFormService, RnFormsSetup } from '@/services/dynamicFormService';
import { Plus, Edit, Trash, FileText, RefreshCw, Search } from 'lucide-react';

const DynamicFormList = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dynamicFormService.getAllForms();
            // API Response structure: { items: [...], ... }
            const data = response.items || response.content || response;
            if (Array.isArray(data)) {
                setForms(data);
            } else {
                setForms([]);
            }
        } catch (err: any) {
            console.error('Failed to load forms', err);
            setError('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this form setup?')) return;
        try {
            await dynamicFormService.deleteFormSetup(id);
            loadForms();
        } catch (err) {
            alert('Failed to delete form');
        }
    };

    const filteredForms = forms.filter(form =>
        form.form_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-white dark:bg-slate-900 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Dynamic Forms</h1>
                    <p className="text-tertiary text-sm">Manage your dynamic form configurations</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={loadForms}
                        className="p-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Refresh List"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    {/* 
                    <button 
                        onClick={() => navigate('/dynamic-forms/new')} 
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                    */}
                </div>
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded mb-6">{error}</div>}

            {loading && forms.length === 0 ? (
                <div className="p-12 text-center text-muted">Loading forms...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredForms.map((form) => (
                        <div key={form.form_id || form.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-5 flex flex-col group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                    <FileText size={24} />
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg text-primary mb-1">{form.form_name}</h3>
                            <p className="text-sm text-tertiary line-clamp-2 mb-4 h-10">
                                {form.description || 'No description provided.'}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                                <button
                                    onClick={() => navigate(`/dynamic-forms/${form.form_id}`)}
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                                >
                                    Open Form <span aria-hidden="true">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredForms.length === 0 && !loading && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-full mb-3">
                                <Search size={24} className="text-muted" />
                            </div>
                            <p>No forms found matching "{searchQuery}"</p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DynamicFormList;
