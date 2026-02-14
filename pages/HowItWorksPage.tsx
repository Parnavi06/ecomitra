
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Cpu, Wifi, LayoutDashboard, Bell, ShieldCheck } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Trash2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">Ecomitra</span>
            </Link>
            <div className="flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-slate-500">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <Link 
                to="/login" 
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* How it Works Section */}
      <section className="pt-32 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-emerald-600 font-black tracking-widest text-sm uppercase mb-4">The Process</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">How Ecomitra Works</h3>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto font-medium">
              Our advanced IoT infrastructure ensures a complete feedback loop between city waste and municipal action.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <StepItem 
                icon={<Cpu className="w-6 h-6" />} 
                title="Smart Dustbin Sensors" 
                desc="Integrated ultrasonic and load sensors monitor fill levels and waste categories with millimetric precision in real-time." 
              />
              <StepItem 
                icon={<Wifi className="w-6 h-6" />} 
                title="Data Transmission to Cloud" 
                desc="Encrypted IoT data is beamed to our central cloud architecture via low-power wide-area networks (LPWAN) for global availability." 
              />
              <StepItem 
                icon={<LayoutDashboard className="w-6 h-6" />} 
                title="Dashboard Monitoring" 
                desc="A high-performance command center visualizes city-wide status, predicting overflow events before they happen using AI models." 
              />
              <StepItem 
                icon={<Bell className="w-6 h-6" />} 
                title="Alerts and Operator Actions" 
                desc="When thresholds are met, localized alerts notify field operators with optimized pickup routes, ensuring 100% efficiency." 
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />
              <div className="relative bg-slate-50 p-12 rounded-[3rem] border border-slate-200 shadow-inner flex items-center justify-center">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-emerald-100 text-center transform hover:scale-105 transition-transform duration-500">
                  <ShieldCheck size={80} className="text-emerald-500 mx-auto mb-6" />
                  <p className="text-2xl font-black text-slate-900">Full System Sync</p>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Active Infrastructure</p>
                  <div className="mt-8 flex justify-center space-x-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-white text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 Ecomitra System. All rights reserved.</p>
      </footer>
    </div>
  );
};

const StepItem = ({ icon, title, desc }: any) => (
  <div className="flex items-start space-x-6 group">
    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <div>
      <h5 className="text-xl font-black text-slate-900 mb-2">{title}</h5>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default HowItWorksPage;
