
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Trash2, LogOut, Bell,
  Clock, Map as MapIcon, User as UserIcon, List, LayoutDashboard,
  Activity, ShieldCheck, ArrowRight, Globe, Plus, X, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { DashboardStats, Bin, BinStatus, UserRole } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from "../src/lib/supabaseClient";


const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-emerald-50/20 overflow-hidden font-inter">
      <AdminSidebar user={user} logout={logout} />

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 px-8 py-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-lg lg:hidden">
              <LayoutDashboard size={20} className="text-emerald-700" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Admin Control</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              Live Monitor Active
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="bins" element={<AdminBins />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="profile" element={<AdminProfileView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBins: 0,
    activeBins: 0,
    fullBins: 0,
    avgFillPercentage: 0,
    activeAlerts: 0,
    bins: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.getStats();
        setStats(res);
      } catch (error) {
        console.error("Fetch stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative min-h-[400px]">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]">
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">Updating Metrics...</p>
          </div>
        </div>
      )}

      <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Bins"
            value={stats.totalBins}
            icon={<Trash2 size={24} />}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
            subtitle="Registered Network Nodes"
          />
          <StatCard
            title="Full Bins"
            value={stats.fullBins}
            icon={<Bell size={24} />}
            color="text-rose-600"
            bgColor="bg-rose-50"
            subtitle="Requiring Immediate Action"
          />
          <StatCard
            title="Avg Fill Level"
            value={`${stats.avgFillPercentage}%`}
            icon={<Activity size={24} />}
            color="text-emerald-700"
            bgColor="bg-emerald-50"
            subtitle="Overall System Capacity"
          />
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts}
            icon={<ShieldCheck size={24} />}
            color="text-amber-600"
            bgColor="bg-amber-50"
            subtitle="Unresolved System Flags"
          />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-emerald-100 overflow-hidden shadow-sm shadow-emerald-100/20">
          <div className="px-8 py-6 border-b border-emerald-50 flex justify-between items-center bg-emerald-50/20">
            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Recent Infrastructure Activity</h3>
            <Link to="/admin/bins" className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center">
              View Grid View <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="p-0">
            <BinTable limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminBins: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    console.log('AdminBins rendered, user role:', user?.role);
  }, [user]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between items-start mb-8 border-b border-emerald-50 pb-6">
        <div className="flex-1 pr-4">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Waste Infrastructure Bins</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and monitor all IoT-enabled waste containers.</p>
        </div>
        <div className="shrink-0 pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all hover:-translate-y-1 active:scale-95 z-[9999] relative"
            style={{ display: 'flex', visibility: 'visible', opacity: 1 }}
          >
            <Plus size={20} />
            <span>Add Bin</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <BinTable />
      </div>

      <AddBinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
        onError={(msg) => setToast({ message: msg, type: 'error' })}
      />

      {toast && (
        <div className={`fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
          }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

interface AddBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const AddBinModal: React.FC<AddBinModalProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    locationName: '',
    address: '',
    localBodyEmail: '',
    enabled: true
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.id || !formData.locationName || !formData.address || !formData.localBodyEmail) {
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.localBodyEmail)) {
        throw new Error('Invalid email format');
      }

      await api.addBin(formData);
      onSuccess('Bin added successfully');
      setFormData({ id: '', locationName: '', address: '', localBodyEmail: '', enabled: true });
      onClose();
    } catch (err: any) {
      onError(err.message || 'Failed to add bin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-100 animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-emerald-50 flex justify-between items-center bg-emerald-50/20">
          <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Register New Infrastructure</h3>
          <button onClick={onClose} className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-900/40">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bin ID</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                placeholder="BN-X00"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bin Name (Location Highlight)</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="Central Park West"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Address / Precise Location</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="100 Central Park West, NY"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Local Body Email</label>
              <input
                type="email"
                value={formData.localBodyEmail}
                onChange={(e) => setFormData({ ...formData, localBodyEmail: e.target.value })}
                placeholder="sanitation@city.gov"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                required
              />
            </div>

            <div className="flex items-center justify-between p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Active Status</p>
                <p className="text-[9px] font-bold text-emerald-600/60 uppercase mt-0.5">Enable monitoring immediately</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.enabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.enabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center min-w-[160px]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Confirm Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BinTable: React.FC<{ limit?: number }> = ({ limit }) => {
  const [bins, setBins, res] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Bins useEffect
  useEffect(() => {
    const fetchBins = async () => {
      setLoading(true);
      try {
        const res = await api.getAllBins();
        console.log("🔥 STATE BEFORE SET:", bins);
        console.log("🔥 RESPONSE FROM API:", res);
        setBins(res ?? []);
      } catch (error) {
        console.error("Error fetching bins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBins();
  }, [limit]);

  // Real-time Subscription useEffect
  useEffect(() => {
    const channel = supabase
      .channel("waste_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "waste_logs",
        },
        (payload) => {
          console.log("Realtime log:", payload.new);
          setBins((prevBins) =>
            prevBins.map((bin) =>
              bin.id === payload.new.bin_id
                ? {
                  ...bin,
                  fill_percentage: payload.new.fill_percentage,
                  fill_overall: payload.new.fill_overall,
                  fill_organic: payload.new.fill_organic,
                  fill_plastic: payload.new.fill_plastic,
                  fill_metal: payload.new.fill_metal,
                  fill_unclassified: payload.new.fill_unclassified,
                }
                : bin
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="overflow-x-auto relative">
      {/* Non-blocking loader overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-emerald-50/30 border-b border-emerald-50">
            <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Node ID</th>
            <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Location</th>
            <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-center">Fill Percentage</th>
            <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Status</th>
            <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-right">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50/50">
          {bins?.map(bin => {
            const avgFill = (bin.compartments ?? []).length ? Math.round(bin.compartments.reduce((a, b) => a + b.fillLevel, 0) / bin.compartments.length) : 0;
            return (
              <tr key={bin.bin_id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-[10px] font-black text-emerald-900/60 bg-emerald-50 px-2 py-1 rounded-md">{bin.bin_id}</span>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight">{bin.locationName}</p>
                    <p className="text-[10px] text-emerald-600/50 font-black uppercase tracking-widest mt-0.5">{bin.latitude?.toFixed(4)}, {bin.longitude?.toFixed(4)}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-center space-x-4 min-w-[140px]">
                    <div className="flex-1 h-2 bg-emerald-50 rounded-full overflow-hidden max-w-[80px] shadow-inner">
                      <div
                        className={`h-full transition-all duration-1000 shadow-sm ${avgFill >= 90 ? 'bg-rose-500' : avgFill >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        style={{ width: `${avgFill}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 w-8">{avgFill}%</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={bin.status} />
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => {
                      api.markAsEmptied(bin.bin_id).then(() => {
                        api.getAllBins().then(res => setBins(limit ? res.slice(0, limit) : res));
                      });
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm"
                  >
                    Clear Manually
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: BinStatus }) => {
  const styles = {
    NORMAL: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-100',
    FULL: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, bgColor, subtitle }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 group hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${bgColor} ${color} transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
        {icon}
      </div>
      <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
    </div>
    <div>
      <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">{value}</h3>
      <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">{subtitle}</p>
    </div>
  </div>
);

const AdminProfileView = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto bg-white p-16 rounded-[3rem] border border-emerald-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -mr-8 -mt-8 opacity-50" />
      <div className="relative z-10 flex flex-col items-center text-center mb-12">
        <div className="relative mb-8">
          <img src={user?.avatar} className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-emerald-50 shadow-2xl relative z-10" alt="Profile" />
          <div className="absolute -inset-4 bg-emerald-100 rounded-[3rem] blur-2xl opacity-30 animate-pulse" />
        </div>
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{user?.name}</h3>
          <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] bg-emerald-50 px-4 py-1.5 rounded-full inline-block">Authorized System Lead</p>
          <p className="text-sm text-slate-500 mt-6 font-medium leading-relaxed max-w-sm mx-auto">{user?.bio}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <div className="p-8 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 group hover:bg-white transition-colors">
          <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1">Network Identity</p>
          <p className="font-black text-slate-900 text-sm tracking-tight">{user?.email}</p>
        </div>
        <div className="p-8 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 group hover:bg-white transition-colors">
          <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1">Clearance Level</p>
          <p className="font-black text-emerald-700 text-sm tracking-tight">Tier 1 Admin Access</p>
        </div>
      </div>
    </div>
  );
};

const AdminLocations = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-12 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[10rem] -mr-20 -mt-20 opacity-50 z-0" />

        <div className="relative z-10">
          <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100">
            Primary Infrastructure Node
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Dustbin Location (College Campus)</h3>
          <p className="text-slate-500 font-medium mb-12 max-w-lg leading-relaxed">
            Registered regional hub for the Ecomitra smart waste management pilot program. This hub monitors all connected IoT nodes across the campus.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50 group hover:bg-emerald-600 transition-all duration-500">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-emerald-500 transition-colors">
                  <MapPin size={24} className="text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest group-hover:text-emerald-100">Latitude</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-white">19.0216° N</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50 group hover:bg-emerald-600 transition-all duration-500">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-emerald-500 transition-colors">
                  <Globe size={24} className="text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest group-hover:text-emerald-100">Longitude</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-white">72.8705° E</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-12 text-center text-emerald-900/20 font-black uppercase tracking-[0.3em] border-4 border-dashed border-emerald-50 rounded-[3rem]">
        Regional Map Integration Pending
      </div>
    </div>
  );
};

export default AdminDashboard;
