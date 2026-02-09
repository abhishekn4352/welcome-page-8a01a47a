import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Mail, Lock, User, Check, Loader2 } from 'lucide-react';
import { useLogin } from './useLogin';

const Login = () => {
    const {
        activeTab,
        setActiveTab,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        error,
        remember,
        setRemember,
        isLoading,
        handleSubmit,
        handleOAuth,
        loginWithDemoUser
    } = useLogin();

    return (
        <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">
            {/* Left Panel - Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 border-r border-zinc-800 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#0891b2] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#00d2ff]/50">
                        S
                    </div>
                    <span className="text-2xl font-bold tracking-tight">SureOps</span>
                </div>

                <div className="z-10 max-w-md mb-20">
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Streamline your operations with intelligence.
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        The complete platform for managing your IoT infrastructure, workflows, and team collaboration in one secure place.
                    </p>
                </div>

                <div className="z-10 text-zinc-500 text-sm">
                    &copy; {new Date().getFullYear()} SureOps Inc. All rights reserved.
                </div>

                {/* Abstract Background Pattern - Admin theme */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 bg-repeat bg-center mix-blend-overlay"></div>
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#00d2ff]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-[#ff00ff]/10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {activeTab === 'signin'
                                ? 'Enter your credentials to access your account'
                                : 'Enter your details to get started with SureOps'}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
                        <button
                            onClick={() => setActiveTab('signin')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'signin'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'signup'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {activeTab === 'signup' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-[#00d2ff] transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/20 focus:border-[#00d2ff] transition-all"
                                        placeholder="Username"
                                        autoComplete="username"
                                    />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-[#00d2ff] transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/20 focus:border-[#00d2ff] transition-all"
                                        placeholder="Email address"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'signin' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-[#00d2ff] transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/20 focus:border-[#00d2ff] transition-all"
                                        placeholder="Email"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative group">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-[#00d2ff] transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/20 focus:border-[#00d2ff] transition-all"
                                placeholder="Password"
                                autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                            />
                        </div>

                        {activeTab === 'signin' && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? 'bg-[#00d2ff] border-[#00d2ff]' : 'border-gray-300 group-hover:border-[#00d2ff]'}`}>
                                        {remember && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={e => setRemember(e.target.checked)}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-[#00d2ff] hover:text-[#22d3ee] hover:underline"
                                    onClick={() => { }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                                <div className="flex items-center gap-2">
                                    ⚠️ {error}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-2.5 rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0891b2] hover:from-[#22d3ee] hover:to-[#0891b2] text-white font-semibold shadow-lg shadow-[#00d2ff]/20 hover:shadow-[#00d2ff]/30 focus:ring-2 focus:ring-[#00d2ff]/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                activeTab === 'signin' ? 'Sign In' : 'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-50 dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleOAuth('google')}
                            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <FcGoogle className="w-5 h-5" /> Google
                        </button>
                        <button
                            onClick={() => handleOAuth('github')}
                            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <FaGithub className="w-5 h-5" /> GitHub
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="text-gray-900 dark:text-gray-100 hover:underline font-medium">Terms</Link> and{' '}
                        <Link to="/privacy" className="text-gray-900 dark:text-gray-100 hover:underline font-medium">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
