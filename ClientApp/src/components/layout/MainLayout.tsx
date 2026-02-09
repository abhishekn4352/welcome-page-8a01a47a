import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useThemeMode } from '@/theme/ThemeProvider';

const MainLayout = () => {
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';
    const username = localStorage.getItem('fullname') || localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className={`min-h-screen flex flex-col ${
            isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
            {/* Persistent Header */}
            <nav className={`shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
            }`}>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/home')}
                >
                    <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold">S</div>
                    <span className={`text-xl font-bold ${
                        isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}>SureOps</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                            isDark
                                ? 'text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-blue-400/30'
                                : 'text-slate-700 border-slate-300 hover:bg-blue-50 hover:border-blue-400'
                        }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`px-4 py-2 rounded-xl border transition-all duration-200 font-semibold ${
                            isDark
                                ? 'bg-red-500/20 text-red-300 border-red-400/40 hover:bg-red-500/30 hover:border-red-400'
                                : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 hover:border-red-400'
                        }`}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Dynamic Content */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
