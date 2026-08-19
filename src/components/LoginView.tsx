import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('Jagadeesh Kummari');
  const [email, setEmail] = useState('jagadeesh.k@example.com');
  const [collegeOrCompany, setCollegeOrCompany] = useState('Computer Science & Engineering');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('Entry Level / Fresher');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || 'candidate@example.com',
      collegeOrCompany: collegeOrCompany.trim() || 'Student / Engineer',
      experienceLevel,
      roleTitle: 'Full Stack Engineer',
    });
  };

  const handleQuickDemo = (presetName: string, presetRole: string, presetEmail: string) => {
    onLogin({
      id: `demo-${Date.now()}`,
      name: presetName,
      email: presetEmail,
      collegeOrCompany: 'Tech Institute of Technology',
      experienceLevel: 'Entry Level / Fresher',
      roleTitle: presetRole,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] text-slate-900">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Project Overview & Capabilities */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Capstone Final Project</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              AI Mock Interview <br />
              <span className="text-blue-600">
                Coach & Career Accelerator
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              An intelligent, end-to-end platform that analyzes your PDF resume, recommends best-fit job roles, trains you with practice tests, and conducts interactive live video mock interviews with real-time speech and video analysis.
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
              <span>Fast 1-Click Demo Evaluation Profiles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                id="btn-quick-fullstack"
                onClick={() => handleQuickDemo('Jagadeesh Kummari', 'Full Stack Developer', 'jagadeesh.k@example.com')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 flex items-center space-x-2 transition-all shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Jagadeesh (Full Stack)</span>
              </button>
              <button
                id="btn-quick-ai"
                onClick={() => handleQuickDemo('Priya Sharma', 'AI / ML Engineer', 'priya.s@example.com')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 flex items-center space-x-2 transition-all shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Priya (AI / Data Science)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Login Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 relative">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Portal Login</h2>
                <p className="text-xs text-slate-500">Enter your info to begin resume evaluation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jagadeesh Kummari"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@university.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Degree / Department / University
                </label>
                <input
                  id="input-college"
                  type="text"
                  value={collegeOrCompany}
                  onChange={(e) => setCollegeOrCompany(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Career Experience Stage
                </label>
                <select
                  id="select-experience"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                >
                  <option value="Entry Level / Fresher">Entry Level / Fresher (0-1 yrs)</option>
                  <option value="Junior (1-3 yrs)">Junior Engineer (1-3 yrs)</option>
                  <option value="Mid-Senior (3-5+ yrs)">Mid-Senior Developer (3-5+ yrs)</option>
                  <option value="Lead / Architect">Tech Lead / Architect</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all group active:scale-[0.98]"
                >
                  <span>Start & Upload Resume</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Secure Session
              </span>
              <span className="flex items-center space-x-1 text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Gemini Powered
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
