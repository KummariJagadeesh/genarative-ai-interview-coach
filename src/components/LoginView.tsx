import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ArrowRight, 
  Sparkles, 
  FileCheck, 
  Target, 
  GraduationCap, 
  Video, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  UserCheck,
  Mail,
  Users,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  signInWithGoogle, 
  getRecentAccounts, 
  saveAccountToRecentList, 
  removeAccountFromRecentList 
} from '../lib/firebase';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('Jagadeesh Kummari');
  const [email, setEmail] = useState('kummarijagadeesh9@gmail.com');
  const [collegeOrCompany, setCollegeOrCompany] = useState('Computer Science & Engineering');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('Entry Level / Fresher');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [recentAccounts, setRecentAccounts] = useState<UserProfile[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    setRecentAccounts(getRecentAccounts());
  }, []);

  // 1. Google / Gmail Sign In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      const userProfile = await signInWithGoogle();
      setRecentAccounts(getRecentAccounts());
      onLogin(userProfile);
    } catch (err: any) {
      console.warn("Google Sign In Notice:", err);
      // If popup was blocked or closed by user, show informative message
      if (err.code === 'auth/popup-closed-by-user') {
        setGoogleError("Google Sign-In popup was closed. Please try again.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setGoogleError("Sign-in request was cancelled.");
      } else {
        setGoogleError(err.message || "Google Sign-In encountered an error. You can also sign in with your Gmail address below.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. Select an Existing Saved Multi-User Account
  const handleSelectRecentAccount = (acc: UserProfile) => {
    saveAccountToRecentList(acc);
    onLogin(acc);
  };

  // 3. Remove Saved Account from list
  const handleRemoveAccount = (e: React.MouseEvent, accEmail: string) => {
    e.stopPropagation();
    removeAccountFromRecentList(accEmail);
    setRecentAccounts(getRecentAccounts());
  };

  // 4. Manual / Direct Form Submit (Alternative Sign-in by Gmail)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const userProfile: UserProfile = {
      id: `user-${email.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || 'kummarijagadeesh9@gmail.com',
      collegeOrCompany: collegeOrCompany.trim() || 'Computer Science & Engineering',
      experienceLevel,
      roleTitle: 'Software Engineer',
    };

    saveAccountToRecentList(userProfile);
    setRecentAccounts(getRecentAccounts());
    onLogin(userProfile);
  };

  // 5. Quick Demo Profile
  const handleQuickDemo = (presetName: string, presetRole: string, presetEmail: string) => {
    const userProfile: UserProfile = {
      id: `demo-${presetEmail.split('@')[0]}`,
      name: presetName,
      email: presetEmail,
      collegeOrCompany: 'Tech Institute of Technology',
      experienceLevel: 'Entry Level / Fresher',
      roleTitle: presetRole,
    };
    saveAccountToRecentList(userProfile);
    setRecentAccounts(getRecentAccounts());
    onLogin(userProfile);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] text-slate-900">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Project Overview & Multi-User System */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Capstone • Multi-User Cloud Architecture</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              AI Mock Interview <br />
              <span className="text-blue-600">
                Coach & Career Accelerator
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              An intelligent multi-user platform. Sign in with your <strong>Gmail account</strong> to save and access your tailored resume analyses, practice test scores, and video mock interview reports anytime.
            </p>
          </div>

          {/* Project Workflow Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-start space-x-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">1. PDF Resume Analysis</h2>
                <p className="text-xs text-slate-500 mt-0.5">Extracts projects, skills, education, and technical competencies.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-start space-x-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">2. Smart Job Matching</h2>
                <p className="text-xs text-slate-500 mt-0.5">Predicts tailored career roles with skill match % and focus topics.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-start space-x-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">3. Practice Mode & Test</h2>
                <p className="text-xs text-slate-500 mt-0.5">Resume-tailored test with instant grading and knowledge reports.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-start space-x-3 shadow-xs">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">4. Live AI Video Interview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Webcam + microphone analysis: grammar, filler words & correctness.</p>
              </div>
            </div>
          </div>

          {/* Quick Sign-In Presets */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-500 mb-2.5 font-semibold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Fast 1-Click Candidate Profiles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                id="btn-quick-jagadeesh"
                onClick={() => handleQuickDemo('Jagadeesh Kummari', 'Full Stack Developer', 'kummarijagadeesh9@gmail.com')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 flex items-center space-x-2 transition-all shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Jagadeesh (Full Stack)</span>
              </button>
              <button
                id="btn-quick-priya"
                onClick={() => handleQuickDemo('Priya Sharma', 'AI / ML Engineer', 'priya.sharma@gmail.com')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 flex items-center space-x-2 transition-all shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Priya (AI / Data Science)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-User Authentication & Login Card */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative space-y-6">
            
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Multi-User Sign In</h2>
                <p className="text-xs text-slate-500">Sign in with Gmail to save your interviews</p>
              </div>
            </div>

            {/* Error Banner */}
            {googleError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-relaxed">
                {googleError}
              </div>
            )}

            {/* 1. Primary Google / Gmail Sign-In Button */}
            <div className="space-y-3">
              <button
                id="btn-signin-google"
                type="button"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm flex items-center justify-center space-x-3 transition-all group disabled:opacity-50"
              >
                {/* Official Google Multicolored SVG Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.99 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="text-sm">
                  {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google / Gmail'}
                </span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                Instantly connects your profile, resume history, and mock interview reports.
              </p>
            </div>

            {/* 2. Recent Accounts Multi-User Switcher */}
            {recentAccounts.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Saved User Profiles ({recentAccounts.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">1-Click Switch</span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
                  {recentAccounts.map((acc) => (
                    <div
                      key={acc.email}
                      onClick={() => handleSelectRecentAccount(acc)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {acc.avatarUrl ? (
                            <img src={acc.avatarUrl} alt={acc.name} className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            acc.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="text-left truncate">
                          <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {acc.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={(e) => handleRemoveAccount(e, acc.email)}
                          title="Remove from saved accounts"
                          className="p-1 text-slate-300 hover:text-rose-600 transition-colors rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                or sign in by details
              </span>
            </div>

            {/* 3. Manual Candidate Info / Custom Gmail Sign In */}
            <div>
              {!showManualForm ? (
                <button
                  type="button"
                  onClick={() => setShowManualForm(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enter Custom Name & Gmail Address</span>
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="input-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jagadeesh Kummari"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gmail Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kummarijagadeesh9@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Degree / College / Department
                    </label>
                    <input
                      id="input-college"
                      type="text"
                      value={collegeOrCompany}
                      onChange={(e) => setCollegeOrCompany(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Career Experience Stage
                    </label>
                    <select
                      id="select-experience"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    >
                      <option value="Entry Level / Fresher">Entry Level / Fresher (0-1 yrs)</option>
                      <option value="Junior (1-3 yrs)">Junior Engineer (1-3 yrs)</option>
                      <option value="Mid-Senior (3-5+ yrs)">Mid-Senior Developer (3-5+ yrs)</option>
                      <option value="Lead / Architect">Tech Lead / Architect</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      id="btn-login-submit"
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] text-xs"
                    >
                      <span>Sign In & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManualForm(false)}
                      className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Trust Badges */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Firebase Auth
              </span>
              <span className="flex items-center space-x-1 text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Cloud Firestore DB
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
