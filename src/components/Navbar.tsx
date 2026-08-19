import React from 'react';
import { 
  Bot, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Video, 
  Award, 
  LogOut, 
  Sparkles,
  ChevronRight,
  User as UserIcon,
  Zap
} from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface NavbarProps {
  currentView: AppView;
  user: UserProfile | null;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onLoadDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  user,
  onNavigate,
  onLogout,
  onLoadDemo,
}) => {
  const navSteps: { key: AppView; label: string; icon: React.ReactNode; enabled: boolean }[] = [
    { key: 'upload_resume', label: '1. Resume Upload', icon: <FileText className="w-4 h-4" />, enabled: !!user },
    { key: 'job_matching', label: '2. Job Matching', icon: <Briefcase className="w-4 h-4" />, enabled: !!user },
    { key: 'practice_test', label: '3. Practice Test', icon: <GraduationCap className="w-4 h-4" />, enabled: !!user },
    { key: 'interview_session', label: '4. AI Video Interview', icon: <Video className="w-4 h-4" />, enabled: !!user },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Capstone Title */}
        <div 
          onClick={() => user ? onNavigate('job_matching') : onNavigate('login')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                AI Coach
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <Sparkles className="w-3 h-3 mr-1 text-blue-600" /> Capstone
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Resume Analysis • Job Matching • Practice Test • Live Video Mock
            </p>
          </div>
        </div>

        {/* Step Progression Bar (Desktop) */}
        {user && currentView !== 'login' && (
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs">
            {navSteps.map((s, idx) => {
              const isActive = currentView === s.key || 
                (s.key === 'practice_test' && currentView === 'practice_report') ||
                (s.key === 'interview_session' && currentView === 'interview_report');
              
              return (
                <React.Fragment key={s.key}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                  <button
                    id={`nav-step-${s.key}`}
                    disabled={!s.enabled}
                    onClick={() => onNavigate(s.key)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : s.enabled
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                        : 'text-slate-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* User Profile / Action Controls */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 py-1 px-3 rounded-2xl">
                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-none truncate max-w-[120px]">
                    {user.collegeOrCompany || 'Candidate'}
                  </div>
                </div>
              </div>

              <button
                id="btn-logout"
                onClick={onLogout}
                title="Log Out & Switch Candidate"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100 text-xs flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          ) : (
            onLoadDemo && (
              <button
                id="btn-nav-demo-shortcut"
                onClick={onLoadDemo}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo Mode</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
