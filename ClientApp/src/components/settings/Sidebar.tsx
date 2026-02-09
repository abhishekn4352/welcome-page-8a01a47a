import React from 'react';
import { FiBarChart2, FiUser, FiUsers, FiKey, FiLock, FiServer, FiShield, FiCloud, FiActivity, FiBox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '@/theme/ThemeProvider';

const options = [
  { key: 'usage', label: 'Usage and plan', icon: <FiBarChart2 /> },
  { key: 'personal', label: 'Personal', icon: <FiUser /> },
  { key: 'users', label: 'Users', icon: <FiUsers /> },
  { key: 'api', label: 'API', icon: <FiKey /> },
  { key: 'externalSecrets', label: 'External Secrets', icon: <FiLock /> },
  { key: 'environments', label: 'Environments', icon: <FiServer /> },
  { key: 'sso', label: 'SSO', icon: <FiShield /> },
  { key: 'ldap', label: 'LDAP', icon: <FiCloud /> },
  { key: 'logStreaming', label: 'Log Streaming', icon: <FiActivity /> },
  { key: 'communityNodes', label: 'Community nodes', icon: <FiBox /> },
];

interface SidebarProps {
  selected: string;
  setSelected: (selected: string) => void;
}

const Sidebar = ({ selected, setSelected }: SidebarProps) => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  
  // Get user data from localStorage
  const fullname = localStorage.getItem('fullname') || 'User';
  const firstName = localStorage.getItem('firstName') || fullname.split(' ')[0] || 'User';
  const email = localStorage.getItem('email') || '';
  
  // Get first letter of the name for avatar
  const avatarLetter = firstName.charAt(0).toUpperCase();
  
  return (
    <aside className={`w-64 flex flex-col py-6 px-2 min-h-screen border-r transition-colors duration-200 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <h2 className={`text-xl font-bold mb-6 px-2 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>Settings</h2>
      <nav className="flex flex-col gap-1">
        {options.map(opt => (
          <button
            key={opt.key}
            className={`flex items-center px-4 py-2 rounded-xl font-medium text-left transition-all duration-200 ${
              selected === opt.key
                ? isDark
                  ? 'bg-blue-900/50 text-blue-200 border border-blue-400/30'
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
                : isDark
                  ? 'text-slate-200 hover:bg-slate-800/70 hover:text-blue-300'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent'
            }`}
            onClick={() => setSelected(opt.key)}
          >
            <span className="w-5 h-5 mr-3 flex items-center justify-center">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </nav>
      {/* Profile section at the bottom */}
      <div
        className={`mt-auto flex items-center gap-3 px-4 py-4 mx-2 rounded-xl border-t border cursor-pointer transition-all duration-200 ${
          isDark ? 'border-blue-400/20 hover:bg-blue-900/30 hover:border-blue-400/40' : 'border-blue-200 hover:bg-blue-50 hover:border-blue-300'
        }`}
        onClick={() => navigate('/profile')}
        title="View Profile"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
          {avatarLetter}
        </div>
        <div className="flex flex-col">
          <span className={`font-medium text-sm ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>{fullname}</span>
          {email && (
            <span className={`text-xs ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>{email}</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 