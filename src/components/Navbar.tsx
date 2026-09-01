import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Video, 
  LogOut, 
  Sparkles,
  ChevronRight,
  User as UserIcon,
  Zap,
  History,
  Users,
  ChevronDown,
  CloudCheck,
  Plus
} from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { getRecentAccounts, saveAccountToRecentList } from '../lib/firebase';

interface NavbarProps {
  currentView: AppView;
  user: UserProfile | null;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onLoadDemo?: () => void;
  onOpenHistory?: () => void;
  onSwitchUser?: (user: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  user,
  onNavigate,
  onLogout,
  onLoadDemo,
  onOpenHistory,
  onSwitchUser,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recentAccounts = getRecentAccounts();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                <Sparkles className="w-3 h-3 mr-1 text-blue-600" /> Multi-User
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

        {/* User Profile & Account Controls */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-2" ref={dropdownRef}>
              
              {/* History Button */}
              {onOpenHistory && (
                <button
                  id="btn-nav-history"
                  onClick={onOpenHistory}
                  title="View Saved Reports & History"
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-all shadow-2xs"
                >
                  <History className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">My Reports</span>
                </button>
              )}

              {/* Multi-User Dropdown Trigger */}
              <div className="relative">
                <button
                  id="btn-user-dropdown"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-2xl transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs overflow-hidden shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-none truncate max-w-[130px] font-mono">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Card */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed In with Gmail</p>
                      <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.name}</p>
                      <p className="text-xs text-slate-500 font-mono truncate">{user.email}</p>
                      <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-emerald-600 mt-2">
                        <CloudCheck className="w-3.5 h-3.5" />
                        <span>Cloud Firestore Sync Active</span>
                      </div>
                    </div>

                    {/* Quick Navigation Items */}
                    <div className="py-1">
                      {onOpenHistory && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenHistory();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                        >
                          <History className="w-4 h-4 text-blue-600" />
                          <span>View Saved Interview Reports</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onNavigate('upload_resume');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                      >
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Upload Different Resume</span>
                      </button>
                    </div>

                    {/* Multi-User Switcher List */}
                    {recentAccounts.filter(a => a.email !== user.email).length > 0 && (
                      <div className="border-t border-slate-100 py-1.5">
                        <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>Switch Account</span>
                        </p>
                        {recentAccounts
                          .filter(a => a.email !== user.email)
                          .map((acc) => (
                            <button
                              key={acc.email}
                              onClick={() => {
                                setDropdownOpen(false);
                                if (onSwitchUser) onSwitchUser(acc);
                              }}
                              className="w-full px-4 py-1.5 text-left text-xs text-slate-700 hover:bg-blue-50 flex items-center space-x-2.5 group"
                            >
                              <div className="w-5 h-5 rounded-md bg-slate-200 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                {acc.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate">
                                <div className="font-semibold text-slate-800 text-[11px] truncate">{acc.name}</div>
                                <div className="text-[9px] text-slate-400 truncate">{acc.email}</div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}

                    {/* Add / Switch Account Button */}
                    <div className="border-t border-slate-100 py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                      >
                        <Plus className="w-4 h-4 text-slate-400" />
                        <span>Add / Switch Gmail Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
