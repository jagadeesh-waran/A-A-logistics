import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import BlackHole from '../../components/ui/black-hole';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('llr_logged_in') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username.trim() !== '' && password.trim() !== '') {
      setIsLoading(true);
      setTimeout(() => {
        localStorage.setItem('llr_logged_in', 'true');
        navigate('/dashboard', { replace: true });
      }, 400);
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black font-inter selection-red py-12 px-4">
      {/* 1. Interactive Black Hole Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-75">
        <BlackHole />
      </div>

      {/* Global Background overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#1a0505] to-black opacity-65 pointer-events-none" />

      {/* 2. Main Login Container */}
      <div className="relative z-10 w-full max-w-[480px] animate-fade-up">
        {/* Official A&A Logistics Logo & Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          {/* Prominent Large Logo Box with Ambient Crimson Glow */}
          <div className="relative w-full max-w-[420px] sm:max-w-[460px] p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-zinc-900/95 to-black border border-white/20 backdrop-blur-2xl mb-4 shadow-[0_0_60px_rgba(239,35,60,0.55)] group transition-all hover:border-[#ef233c] hover:shadow-[0_0_80px_rgba(239,35,60,0.75)]">
            <img
              src="/logo.png"
              alt="A&A Logistics Official Logo"
              className="w-full h-auto max-h-44 sm:max-h-56 object-contain rounded-2xl drop-shadow-[0_0_35px_rgba(239,35,60,0.75)] transition-transform duration-300 group-hover:scale-105"
            />
            {/* Subtle rotating glow ring */}
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#ef233c]/30 via-transparent to-[#ef233c]/30 blur-xl pointer-events-none opacity-90" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-manrope text-zinc-200 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_10px_#ef233c] animate-pulse" />
            <span className="font-semibold tracking-wide">Commercial Logistics Management Console</span>
          </div>
        </div>

        {/* 3. Modern Red-Noir Frosted Glass Card */}
        <div className="p-7 sm:p-8 border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black/95 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(239,35,60,0.15)] backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 className="text-sm font-bold font-manrope text-white">Operator Sign In</h2>
            <div className="flex items-center gap-1.5 text-[11px] font-manrope text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Terminal
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error Notification */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-[#ef233c] text-red-200 text-xs animate-fade-up">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ef233c]" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
                Operator ID / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or dispatch ID"
                required
                className="w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-[#ef233c] transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
                Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-[#ef233c] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Help */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-[#ef233c] focus:ring-0"
                />
                Remember terminal
              </label>
              <span className="text-xs text-zinc-500 hover:text-[#ef233c] transition-colors cursor-pointer">
                Operator Help
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="shiny-cta w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4 text-[#ef233c]" />
                <span>{isLoading ? 'Authenticating...' : 'Access Command Hub'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-zinc-600 font-inter">
            &copy; {new Date().getFullYear()} A&amp;A Logistics Corp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
