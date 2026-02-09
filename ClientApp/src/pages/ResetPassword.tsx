import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useThemeMode } from '../theme/ThemeProvider';

const ResetPassword = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !username || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api.put('/reset-password', {
        email,
        username,
        new_password: newPassword,
      });

      setSuccess('Password reset successful! You can now login.');
      setEmail('');
      setUsername('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
      <div className={`rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center ${isDark ? 'bg-slate-900 border border-blue-500/20' : 'bg-white border border-blue-200'}`}>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mb-2">
            S
          </div>
          <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>SureOps</div>
        </div>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Reset Password</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all ${isDark ? 'bg-slate-800 border border-slate-700 text-white placeholder-gray-500' : 'bg-white border border-blue-200 text-slate-900 placeholder-slate-500'}`}
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all ${isDark ? 'bg-slate-800 border border-slate-700 text-white placeholder-gray-500' : 'bg-white border border-blue-200 text-slate-900 placeholder-slate-500'}`}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all ${isDark ? 'bg-slate-800 border border-slate-700 text-white placeholder-gray-500' : 'bg-white border border-blue-200 text-slate-900 placeholder-slate-500'}`}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all ${isDark ? 'bg-slate-800 border border-slate-700 text-white placeholder-gray-500' : 'bg-white border border-blue-200 text-slate-900 placeholder-slate-500'}`}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className={`text-sm mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</div>}
          {success && <div className={`text-sm mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{success}</div>}

          <button
            type="submit"
            className={`w-full py-2 rounded font-semibold transition-colors mb-4 text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700`}
          >
            Reset Password
          </button>

          <button
            type="button"
            onClick={() => navigate('/home')}
            className={`w-full py-2 rounded font-semibold transition-colors text-sm ${isDark ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
          >
            Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
