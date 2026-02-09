import React from 'react';
import { useThemeMode } from '../theme/ThemeProvider';

const Terms: React.FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
      <div className={`max-w-3xl mx-auto p-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Terms of Service</h1>
        <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>These Terms of Service govern your use of the application.</p>
        <ul className={`list-disc pl-6 space-y-1 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
          <li>Use the app responsibly and comply with applicable laws.</li>
          <li>We may update these terms from time to time.</li>
          <li>Contact support for any questions.</li>
        </ul>
      </div>
    </div>
  );
};

export default Terms;



