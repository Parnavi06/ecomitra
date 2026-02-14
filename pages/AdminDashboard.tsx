
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Trash2, LogOut, Bell,
  Clock, Map as MapIcon, User as UserIcon, List, LayoutDashboard,
  Activity, ShieldCheck, ArrowRight, Globe
} from 'lucide-react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { DashboardStats, Bin, BinStatus } from '../types';
import AdminSidebar from '../components/AdminSidebar';

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then(res => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="flex justify-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">Accessing Node Metrics...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bins"
          value={stats?.totalBins}
          icon={<Trash2 size={24} />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          subtitle="Registered Network Nodes"
        />
        <StatCard
          title="Full Bins"
          value={stats?.fullBins}
          icon={<Bell size={24} />}
          color="text-rose-600"
          bgColor="bg-rose-50"
          subtitle="Requiring Immediate Action"
        />
        <StatCard
          title="Avg Fill Level"
          value={`${stats?.avgFillPercentage}%`}
          icon={<Activity size={24} />}
          color="text-emerald-700"
          bgColor="bg-emerald-50"
          subtitle="Overall System Capacity"
        />
        <StatCard
          title="Active Alerts"
          value={stats?.activeAlerts}
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
  );
};

const AdminBins: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Waste Infrastructure Bins</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and monitor all IoT-enabled waste containers.</p>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <BinTable />
      </div>
    </div>
  );
};

const BinTable: React.FC<{ limit?: number }> = ({ limit }) => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllBins().then(res => {
      setBins(limit ? res.slice(0, limit) : res);
      setLoading(false);
    });
  }, [limit]);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="flex justify-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">Syncing Infrastructure Grid...</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
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
          {bins.map(bin => {
            const avgFill = Math.round(bin.compartments.reduce((a, b) => a + b.fillLevel, 0) / bin.compartments.length);
            return (
              <tr key={bin.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-[10px] font-black text-emerald-900/60 bg-emerald-50 px-2 py-1 rounded-md">{bin.id}</span>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight">{bin.locationName}</p>
                    <p className="text-[10px] text-emerald-600/50 font-black uppercase tracking-widest mt-0.5">{bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}</p>
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
                      api.markAsEmptied(bin.id).then(() => {
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
