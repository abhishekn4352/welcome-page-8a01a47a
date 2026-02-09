import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../theme/ThemeProvider';

const OAuthComplete: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('auth_token', token);
      navigate('/home', { replace: true });
    } else {
      // Fallback when backend didn't redirect (e.g., dev/testing): try fetching JSON
      // Not strictly necessary if you always provide redirect_to
      navigate('/login?error=missing_token', { replace: true });
    }
  }, [navigate]);

  return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
    <div className={`rounded-2xl shadow-xl w-full max-w-md p-8 text-center ${isDark ? 'bg-slate-900 border border-blue-500/20' : 'bg-white border border-blue-200'}`}>
      <div className={`bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mb-2 mx-auto`}>S</div>
      <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>SureOps</div>
      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Completing sign-in...</div>
    </div>
  </div>;
};

export default OAuthComplete;