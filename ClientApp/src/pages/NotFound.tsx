import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useThemeMode } from "../theme/ThemeProvider";

const NotFound = () => {
  const location = useLocation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
      <div className={`text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">404</h1>
        <p className={`text-xl mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Oops! Page not found</p>
        <a href="/" className={`underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
