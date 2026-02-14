
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, BarChart3, Zap, Globe, Map, Settings, Users, ArrowRight, ShieldCheck, Cpu, Cloud, Activity, Linkedin, Camera, CheckCircle, Smartphone, Wifi, Bell, LayoutDashboard } from 'lucide-react';
import { api } from '../services/api';
import { TeamMember } from '../types';

// Custom VIT-style Image Slider Component
const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const images = [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1574974671999-24b7dfbb0d53?auto=format&fit=crop&w=1920&q=80'
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <img
            src={img}
            alt={`Ecomitra Slide ${index + 1}`}
            className="w-full h-full object-cover object-center bg-no-repeat"
            style={{ zIndex: 0 }}
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent"
            style={{ zIndex: 1 }}
          />
        </div>
      ))}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    api.getTeam().then(setTeam);
  }, []);

  const handleImageUpdate = async (id: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await api.updateTeamMemberImage(id, base64);
      setTeam(prev => prev.map(m => m.id === id ? { ...m, imageUrl: base64 } : m));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Trash2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">Ecomitra</span>
            </div>
            <div className="hidden lg:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-slate-500">
              <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
              <a href="#team" className="hover:text-emerald-600 transition-colors">Team</a>
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

      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-6 bg-white overflow-hidden">
        {/* Background Slider */}
        <HeroSlider />

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 lg:gap-12 items-center" style={{ zIndex: 2 }}>
          <div className="text-left">
            <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-emerald-100">
              Smart Waste Management System
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
              Smarter Waste Management for <span className="text-emerald-600">Greener Cities</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium max-w-xl">
              Ecomitra is an AI-powered smart dustbin monitoring system designed for cleaner urban environments through IoT-enabled real-time tracking.
            </p>
            <div className="flex flex-col sm:flex-row justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/login" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
                Get Started <ArrowRight className="ml-3" />
              </Link>
              <Link
                to="/how-it-works"
                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-lg border-2 border-slate-100 hover:bg-slate-50 transition-all inline-flex items-center justify-center group"
              >
                Learn More <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          {/* Empty div for grid alignment if needed, or keeping it for spacing */}
          <div className="hidden lg:block"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Key Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<Globe className="w-6 h-6" />} title="Live Bin Monitoring" desc="Track fill levels across the city in real-time with IoT precision." />
            <FeatureCard icon={<BarChart3 className="w-6 h-6" />} title="AI-driven Analytics" desc="Predict peak waste generation times using historical data models." />
            <FeatureCard icon={<Zap className="w-6 h-6" />} title="Smart Alerts" desc="Instant notifications for bins reaching critical capacity." />
            <FeatureCard icon={<Map className="w-6 h-6" />} title="Route Optimization" desc="Automatically calculate the fastest collection paths for trucks." />
            <FeatureCard icon={<Settings className="w-6 h-6" />} title="IoT Enabled Bins" desc="Every bin is equipped with sensors for deep status reporting." />
            <FeatureCard icon={<Users className="w-6 h-6" />} title="Sustainable Living" desc="Driving cleaner communities through technology-first solutions." />
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section id="team" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-emerald-600 font-black tracking-widest text-sm uppercase mb-4">The Team</h2>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tighter text-slate-900">Meet the Team</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.filter(m => !m.isProfessor).map(member => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onImageUpload={(file) => handleImageUpdate(member.id, file)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-emerald-600 font-black tracking-widest text-sm uppercase mb-4">Our Mentors</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {team.filter(m => m.isProfessor).map(mentor => (
              <TeamMemberCard
                key={mentor.id}
                member={mentor}
                onImageUpload={(file) => handleImageUpdate(mentor.id, file)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-emerald-600 font-black tracking-widest text-sm uppercase mb-4">Funded By</p>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">KAF India Foundation</h3>
          <p className="text-slate-500 font-medium text-sm">Supporting innovative social impact projects through technology and sustainability initiatives</p>
          <a href="https://kafindia.in/" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-bold uppercase tracking-widest border-b border-emerald-100 pb-1">
            Learn More →
          </a>
        </div>
      </section>

      {/* College Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Vidyalankar Institute of Technology, Mumbai</h3>
          <p className="text-slate-500 font-medium text-sm">Pioneering research and innovation in engineering and technology education</p>
          <a href="https://vit.edu.in/" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-bold uppercase tracking-widest border-b border-emerald-100 pb-1">
            Visit Website →
          </a>
        </div>
      </section>

      {/* LinkedIn Connectivity Section */}
      <section id="connect" className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-emerald-400 font-black tracking-widest text-[10px] uppercase mb-4">Connect With Us</h2>
            <h3 className="text-4xl font-black tracking-tighter">Our LinkedIn Profiles</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map(member => (
              <a
                key={member.id}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 hover:bg-emerald-600 hover:border-emerald-500 transition-all text-center"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-slate-700 p-3 rounded-2xl group-hover:bg-white/20 transition-colors">
                    <Linkedin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black tracking-tight text-white group-hover:text-white transition-colors">{member.name.split(' ')[0]}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-100 transition-colors mt-1">{member.role.split(' ')[0]}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-white text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 Ecomitra System. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
    <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">{icon}</div>
    <h4 className="text-xl font-black mb-3 text-slate-900">{title}</h4>
    <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
  </div>
);

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

const TeamMemberCard = ({ member, onImageUpload }: { member: TeamMember, onImageUpload: (file: File) => void | Promise<void> }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`p-8 rounded-[2.5rem] text-center group border border-slate-100 transition-all relative ${member.isProfessor ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-white hover:border-emerald-200 shadow-sm'}`}>
      <div className="relative mx-auto mb-6 w-32 h-32 group/img">
        <img
          src={member.imageUrl}
          className="w-full h-full rounded-3xl object-cover shadow-lg group-hover:scale-105 transition-transform"
          alt={member.name}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white"
        >
          <Camera size={24} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
        />
      </div>
      <h5 className="text-lg font-black text-slate-900 tracking-tight">{member.name}</h5>
      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 mb-6 ${member.isProfessor ? 'text-emerald-700' : 'text-slate-400'}`}>{member.role}</p>

      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
        title={`${member.name}'s LinkedIn`}
      >
        <Linkedin size={18} />
      </a>
    </div>
  );
};

export default LandingPage;
