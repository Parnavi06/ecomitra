import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trash2, ListTodo, User as UserIcon, LogOut } from 'lucide-react';
import { User, UserRole } from '../types';

interface OperatorSidebarProps {
    user: User | null;
    logout: () => void;
}

const OperatorSidebar: React.FC<OperatorSidebarProps> = ({ user, logout }) => {
    const location = useLocation();

    if (user?.role !== UserRole.OPERATOR) return null;

    return (
        <aside className="w-72 bg-emerald-950 border-r border-emerald-900/50 flex flex-col h-full shrink-0 shadow-2xl relative z-50">
            <div className="p-8">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="bg-emerald-600 p-2.5 rounded-xl transition-all group-hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                        <Trash2 className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">Ecomitra</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-8">
                <OperatorSidebarLink to="/operator" active={location.pathname === '/operator'} icon={<Home size={18} />} label="Home" />
                <OperatorSidebarLink to="/operator/assigned" active={location.pathname === '/operator/assigned'} icon={<Trash2 size={18} />} label="Assigned Bins" />
                <OperatorSidebarLink to="/operator/todo" active={location.pathname === '/operator/todo'} icon={<ListTodo size={18} />} label="To-Do List" />
                <OperatorSidebarLink to="/operator/profile" active={location.pathname === '/operator/profile'} icon={<UserIcon size={18} />} label="Profile" />
            </nav>

            <div className="p-6 m-4 bg-emerald-900/30 rounded-3xl border border-emerald-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <img src={user?.avatar} className="w-12 h-12 rounded-2xl bg-emerald-800 border-2 border-emerald-700 shadow-lg object-cover" alt="Operator" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">Field Agent</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const OperatorSidebarLink = ({ to, active, icon, label }: { to: string, active: boolean, icon: React.ReactNode, label: string }) => (
    <Link
        to={to}
        className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest group ${active
            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 ring-1 ring-emerald-500/50'
            : 'text-emerald-400/70 hover:bg-emerald-900/50 hover:text-emerald-300'
            }`}
    >
        <span className={`${active ? 'text-white' : 'text-emerald-500 group-hover:text-emerald-400'} transition-colors`}>
            {icon}
        </span>
        <span>{label}</span>
    </Link>
);

export default OperatorSidebar;
