
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home, Trash2, ListTodo, LogOut,
  MapPin, Clock, CheckCircle2, User as UserIcon, Loader2,
  Activity, Bell, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { Bin } from '../types';
import OperatorSidebar from '../components/OperatorSidebar';

const OperatorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-emerald-50/20 overflow-hidden font-inter">
      <OperatorSidebar user={user} logout={logout} />

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 px-8 py-6 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Operator Portal</h1>
          <div className="flex items-center space-x-3 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
            <span>Node Connection Active</span>
          </div>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto">
          <Routes>
            <Route index element={<OperatorHome />} />
            <Route path="assigned" element={<AssignedBins />} />
            <Route path="todo" element={<ToDoList />} />
            <Route path="profile" element={<OperatorProfileView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const OperatorHome: React.FC = () => {
  const { user } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    const fetchBins = async () => {
      if (!user) return;
      const data = await api.getOperatorBins(user.id);
      console.log("👷 OPERATOR BINS:", data);
      setBins(data ?? []);

    };

    fetchBins();

    // Subscribe to real-time updates
    const subscription = api.subscribeToBins(() => {
      fetchBins();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fullCount = bins.filter(b => b.status === 'FULL').length;
  const allLevels = bins.flatMap(b => b.compartments.map(c => c.fillLevel));
  const avgFill = allLevels.length ? Math.round(allLevels.reduce((a, b) => a + b, 0) / allLevels.length) : 0;
  const activeAlerts = bins.filter(b => b.status !== 'NORMAL').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bins"
          value={bins.length}
          icon={<Trash2 size={24} />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          subtitle="Assigned Network Nodes"
        />
        <StatCard
          title="Full Bins"
          value={fullCount}
          icon={<Bell size={24} />}
          color="text-rose-600"
          bgColor="bg-rose-50"
          subtitle="Needs Immediate Emptying"
        />
        <StatCard
          title="Avg Fill Level"
          value={`${avgFill}%`}
          icon={<Activity size={24} />}
          color="text-emerald-700"
          bgColor="bg-emerald-50"
          subtitle="Route Capacity Overview"
        />
        <StatCard
          title="Active Alerts"
          value={activeAlerts}
          icon={<ShieldCheck size={24} />}
          color="text-amber-600"
          bgColor="bg-amber-50"
          subtitle="Nodes Requiring Attention"
        />
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-sm shadow-emerald-900/5">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Route Status</h2>
        <p className="text-slate-500 mt-2 font-medium">Monitoring <span className="text-emerald-700 font-bold">{bins.length} infrastructure nodes</span> in your assigned core.</p>

        {fullCount > 0 ? (
          <div className="mt-8 bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-rose-500 p-3 rounded-xl text-white">
                <Trash2 size={24} />
              </div>
              <div>
                <p className="font-black text-rose-900 tracking-tight">{fullCount} Bins are FULL</p>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mt-1">Emptying required soon</p>
              </div>
            </div>
            <Link to="/operator/todo" className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all">
              Go to To-Do List
            </Link>
          </div>
        ) : (
          <div className="mt-8 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center space-x-4">
            <div className="bg-emerald-500 p-3 rounded-xl text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-black text-emerald-900 tracking-tight">Your route is clear</p>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">All bins are within normal levels</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AssignedBins: React.FC = () => {
  const { user } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBins = () => {
      if (user) api.getOperatorBins(user.id).then(res => { setBins(res); setLoading(false); });
    };

    fetchBins();

    // Subscribe to real-time updates
    const subscription = api.subscribeToBins(() => {
      fetchBins();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Your Assigned Infrastructure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-emerald-600 font-black uppercase tracking-widest animate-pulse text-[10px]">Syncing Assigned Nodes...</div>
        ) : bins.map(bin => {
          const avgFill = Math.round(bin.compartments.reduce((a, b) => a + b.fillLevel, 0) / bin.compartments.length);
          return (
            <div key={bin.id} className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm shadow-emerald-900/5 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-slate-900 text-lg tracking-tight">{bin.locationName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {bin.id}</p>
                </div>
                <StatusDot status={bin.status} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Capacity</span>
                  <span className={avgFill >= 90 ? 'text-rose-600' : 'text-emerald-600'}>{avgFill}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${avgFill >= 90 ? 'bg-rose-500' : avgFill >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${avgFill}%` }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">
                  <span className="flex items-center"><MapPin size={12} className="mr-1.5 text-emerald-600" /> {bin.address.split(',')[0]}</span>
                  <span className="flex items-center"><Clock size={12} className="mr-1.5 text-emerald-600" /> {new Date(bin.lastEmptied).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ToDoList: React.FC = () => {
  const { user } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadTodo = async () => {
    if (user) {
      const res = await api.getOperatorBins(user.id);
      setBins(res.filter(b => b.status === 'FULL'));
    }
  };

  useEffect(() => {
    loadTodo();

    // Subscribe to real-time updates
    const subscription = api.subscribeToBins(() => {
      loadTodo();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleEmpty = async (id: string) => {
    setProcessing(id);
    try {
      await api.markAsEmptied(id);
      setBins(prev => prev.filter(b => b.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">High Priority Tasks</h2>
        {bins.length > 0 && (
          <span className="bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-200">
            {bins.length} Actions Required
          </span>
        )}
      </div>

      <div className="space-y-4">
        {bins.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-[2.5rem] border border-emerald-100 border-dashed">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight">Great job!</p>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">All full bins in your zone have been cleared.</p>
          </div>
        ) : bins.map(bin => {
          const avgFill = Math.round(bin.compartments.reduce((a, b) => a + b.fillLevel, 0) / bin.compartments.length);
          return (
            <div key={bin.id} className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between group hover:border-emerald-200 transition-all">
              <div className="flex items-center space-x-6">
                <div className="bg-rose-500 p-5 rounded-2xl text-white shadow-lg shadow-rose-600/20">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tighter">{bin.locationName}</h4>
                  <div className="flex space-x-4 mt-2">
                    <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest flex items-center">
                      <MapPin size={12} className="mr-1.5 text-rose-500" /> {bin.address.split(',')[0]}
                    </p>
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center bg-rose-50 px-2 py-0.5 rounded-md">
                      Fill Level: {avgFill}%
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleEmpty(bin.id)}
                disabled={!!processing}
                className="mt-6 md:mt-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center min-w-[200px] shadow-sm shadow-emerald-900/5 disabled:opacity-50"
              >
                {processing === bin.id ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Clear Manually
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor, subtitle }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm shadow-emerald-900/5 group hover:border-emerald-200 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${bgColor} ${color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">{title}</h4>
      <div className="flex items-baseline space-x-2">
        <p className={`text-4xl font-black tracking-tighter ${color}`}>{value ?? '0'}</p>
      </div>
      <p className="text-[10px] font-bold text-slate-400 mt-2">{subtitle}</p>
    </div>
  </div>
);

const StatusDot = ({ status }: { status: string }) => {
  const colors = {
    NORMAL: 'bg-emerald-500',
    WARNING: 'bg-amber-500',
    FULL: 'bg-rose-500'
  };
  return (
    <div className="flex items-center space-x-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
      <div className={`w-2 h-2 rounded-full ${(colors as any)[status] || 'bg-slate-300'}`} />
      <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{status}</span>
    </div>
  );
};

const OperatorProfileView = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-12 rounded-[3.5rem] border border-emerald-100 shadow-sm shadow-emerald-900/5 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-[8rem] -mr-16 -mt-16 opacity-50 z-0" />

        <div className="relative z-10">
          <div className="relative inline-block mb-10">
            <img src={user?.avatar} className="w-36 h-36 rounded-[2.5rem] mx-auto border-4 border-emerald-50 shadow-2xl object-cover" alt="Profile" />
            <div className="absolute -bottom-3 -right-3 bg-emerald-600 p-3 rounded-2xl border-4 border-white shadow-lg">
              <CheckCircle2 size={20} className="text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{user?.name}</h3>
          <p className="text-emerald-600 font-black uppercase tracking-widest text-[10px] mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">Certified Field Specialist</p>

          <div className="mt-14 space-y-4 text-left">
            <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 group hover:bg-emerald-50 transition-colors">
              <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-2">Logistics ID</label>
              <p className="font-black text-slate-900 text-base">{user?.email}</p>
            </div>
            <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 group hover:bg-emerald-50 transition-colors">
              <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-2">Assigned Zone</label>
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900 text-base">Zone 4 (Central Core)</p>
                <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded-md">PRIMARY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
