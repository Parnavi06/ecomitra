
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Trash2, ArrowRight, Loader2, Mail, Lock, ChevronLeft } from 'lucide-react';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // login in App.tsx updates the auth state and localStorage
      // We can use the result of login or check the updated state
      // For immediate navigation after login, we can check the localStorage we just set
      const savedUserString = localStorage.getItem('user');
      if (savedUserString) {
        const user = JSON.parse(savedUserString);
        if (user.role === UserRole.ADMIN) navigate('/admin/dashboard');
        else if (user.role === UserRole.OPERATOR) navigate('/operator/home');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 selection:bg-emerald-100">
      {/* Left side brand visual - only on large screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-700 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full" />

        <div className="max-w-md relative z-10 text-white">
          <Link to="/" className="inline-flex items-center space-x-3 mb-16 hover:scale-105 transition-transform">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl">
              <Trash2 className="text-emerald-700 w-8 h-8" />
            </div>
            <span className="text-3xl font-black tracking-tighter">Ecomitra</span>
          </Link>
          <h1 className="text-6xl font-black mb-8 leading-tight tracking-tighter">
            Smart Control <br /> Center Access.
          </h1>
          <p className="text-xl text-emerald-100 font-medium leading-relaxed opacity-90">
            Sign in to manage IoT bin nodes, track city-wide fill levels, and optimize sanitation logistics.
          </p>
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors mb-12 group">
            <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="mb-10 lg:hidden flex items-center space-x-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl">
              <Trash2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">Ecomitra</span>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Portal Access</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Login Required</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-8 border border-rose-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecomitra.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center shadow-2xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="ml-3" /></>}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            <p>Use <span className="text-emerald-600">admin@ecomitra.com</span> for Admin</p>
            <p className="mt-1">Use <span className="text-emerald-600">operator@ecomitra.com</span> for Operator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
