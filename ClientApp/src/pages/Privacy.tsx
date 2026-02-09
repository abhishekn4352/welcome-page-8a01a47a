import React from 'react';
import { useThemeMode } from '../theme/ThemeProvider';

const Privacy: React.FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
      <div className={`max-w-3xl mx-auto p-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Privacy Policy</h1>
        <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>We respect your privacy and are committed to protecting your personal data.</p>
        <ul className={`list-disc pl-6 space-y-1 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
          <li>We store only what is necessary for the app to function.</li>
          <li>Data may be used to improve service quality.</li>
          <li>You can request deletion of your data at any time.</li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy;



