import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  GraduationCap, 
  Video, 
  ArrowRight, 
  Layers, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  Code, 
  Check, 
  Flame,
  IndianRupee,
  Lightbulb,
  Edit3,
  ExternalLink,
  Target,
  FileCheck,
  Zap,
  Tag,
  Clock,
  MapPin,
  Mail,
  Phone,
  Github
} from 'lucide-react';
import { ResumeAnalysis, JobRoleRecommendation, ResumeSuggestion } from '../types';

/**
 * Format salary to standard Indian Rupee (INR / ₹) LPA benchmarks
 */
export function formatSalaryInr(salary?: string): string {
  if (!salary) return '₹6.5 - 14.0 LPA';
  
  const trimmed = salary.trim();
  // Already in LPA or ₹ format
  if (trimmed.includes('LPA') || trimmed.includes('₹') || trimmed.includes('Lakh')) {
    if (!trimmed.includes('₹')) {
      return `₹${trimmed}`;
    }
    return trimmed;
  }
  
  // If in USD format e.g. "$95,000 - $135,000" or "$88,000"
  const numbers = trimmed.match(/\d+[\d,]*/g);
  if (numbers && numbers.length >= 2) {
    const num1 = parseInt(numbers[0].replace(/,/g, ''), 10);
    const num2 = parseInt(numbers[1].replace(/,/g, ''), 10);
    
    if (num1 >= 30000) {
      // Map USD figures to realistic Indian tech salary LPA (e.g. 7.5 - 16.0 LPA)
      const lpa1 = (Math.max(4.5, Math.round((num1 / 10000) * 0.95 * 10) / 10)).toFixed(1);
      const lpa2 = (Math.max(8.0, Math.round((num2 / 10000) * 1.15 * 10) / 10)).toFixed(1);
      return `₹${lpa1} - ${lpa2} LPA`;
    }
    
    if (num1 < 100 && num2 < 100) {
      return `₹${num1} - ${num2} LPA`;
    }
  }
  
  return trimmed.replace(/\$/g, '₹');
}

interface JobMatchingViewProps {
  analysis: ResumeAnalysis;
  selectedRole: JobRoleRecommendation | null;
  onSelectRole: (role: JobRoleRecommendation) => void;
  onStartPractice: () => void;
  onStartInterview: () => void;
  onUploadDifferentResume: () => void;
  onUpdateAnalysis?: (updated: ResumeAnalysis) => void;
}

export const JobMatchingView: React.FC<JobMatchingViewProps> = ({
  analysis,
  selectedRole,
  onSelectRole,
  onStartPractice,
  onStartInterview,
  onUploadDifferentResume,
  onUpdateAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'suggestions' | 'profile'>('roles');
  const [selectedSuggestionCategory, setSelectedSuggestionCategory] = useState<string>('all');
  const [appliedSuggestions, setAppliedSuggestions] = useState<{ [id: string]: boolean }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    candidateName: analysis.candidateName || '',
    email: analysis.email || '',
    phone: analysis.phone || '',
    summary: analysis.summary || '',
    skillsString: (analysis.technicalSkills || []).join(', '),
  });

  const currentRole = selectedRole || (analysis.recommendedJobRoles && analysis.recommendedJobRoles[0]);
  const suggestions: ResumeSuggestion[] = analysis.resumeSuggestions || [];

  const toggleSuggestionApplied = (id: string) => {
    setAppliedSuggestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSkills = editForm.skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedAnalysis: ResumeAnalysis = {
      ...analysis,
      candidateName: editForm.candidateName.trim() || analysis.candidateName,
      email: editForm.email.trim() || analysis.email,
      phone: editForm.phone.trim() || analysis.phone,
      summary: editForm.summary.trim() || analysis.summary,
      technicalSkills: updatedSkills.length > 0 ? updatedSkills : analysis.technicalSkills,
    };

    if (onUpdateAnalysis) {
      onUpdateAnalysis(updatedAnalysis);
    }
    setIsEditModalOpen(false);
  };

  const filteredSuggestions = selectedSuggestionCategory === 'all'
    ? suggestions
    : suggestions.filter(s => s.category.toLowerCase().includes(selectedSuggestionCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Extracted Resume Profile Overview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume Collected & Analyzed</span>
              </span>
              {suggestions.length > 0 && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                  <span>{suggestions.length} Tailored Suggestions</span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {analysis.candidateName || 'Candidate Profile'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                {analysis.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{analysis.email}</span>
                  </span>
                )}
                {analysis.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{analysis.phone}</span>
                  </span>
                )}
                {analysis.education && analysis.education[0] && (
                  <span className="flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{analysis.education[0].degree}</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {analysis.summary}
            </p>

            {/* Extracted Skills Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {analysis.technicalSkills.slice(0, 7).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
              {analysis.technicalSkills.length > 7 && (
                <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200">
                  +{analysis.technicalSkills.length - 7} more skills collected
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
            <button
              id="btn-edit-profile"
              onClick={() => {
                setEditForm({
                  candidateName: analysis.candidateName || '',
                  email: analysis.email || '',
                  phone: analysis.phone || '',
                  summary: analysis.summary || '',
                  skillsString: (analysis.technicalSkills || []).join(', '),
                });
                setIsEditModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-xs flex items-center justify-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Details</span>
            </button>
            <button
              id="btn-reupload-resume"
              onClick={onUploadDifferentResume}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all shadow-xs"
            >
              Upload Different Resume
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-slate-100 text-xs font-medium overflow-x-auto">
          <button
            id="tab-suggested-roles"
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-semibold whitespace-nowrap ${
              activeTab === 'roles'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target Job Matches ({analysis.recommendedJobRoles ? analysis.recommendedJobRoles.length : 0})</span>
          </button>
          
          <button
            id="tab-resume-suggestions"
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-semibold whitespace-nowrap ${
              activeTab === 'suggestions'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Suggestions ({suggestions.length})</span>
          </button>

          <button
            id="tab-extracted-profile"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-semibold whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Extracted Information & Breakdown</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Target Job Matches */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Recommended Job Roles List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Recommended Job Matches</span>
              </h2>
              <span className="text-xs font-medium text-slate-500">Select target role</span>
            </div>

            <div className="space-y-3">
              {(analysis.recommendedJobRoles || []).map((role) => {
                const isSelected = currentRole?.id === role.id;
                return (
                  <div
                    key={role.id}
                    id={`role-card-${role.id}`}
                    onClick={() => onSelectRole(role)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-blue-50/70 border-2 border-blue-600 shadow-md shadow-blue-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {role.roleTitle}
                          </h3>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {role.category} • {role.experienceLevel}
                        </p>
                      </div>

                      {/* Match Score Badge */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          <span>{role.matchScore}% Match</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                      {role.summary}
                    </p>

                    {/* Progress Match Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${role.matchScore}%` }}
                      />
                    </div>

                    {/* Salary & Skills Summary Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {role.averageSalaryRange && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-0.5">
                          <IndianRupee className="w-3 h-3 text-emerald-600" />
                          <span>{formatSalaryInr(role.averageSalaryRange)}</span>
                        </span>
                      )}
                      {role.matchedSkills.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 flex items-center space-x-1"
                        >
                          <Check className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> {s}
                        </span>
                      ))}
                      {role.missingSkills.slice(0, 1).map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          Need: {m}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Role Deep Dive & Dual Action Cards (Practice vs Interview) */}
          <div className="lg:col-span-7 space-y-6">
            {currentRole && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Selected Target Career Role
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {currentRole.roleTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentRole.category} • Experience: {currentRole.experienceLevel}
                    </p>
                  </div>

                  {currentRole.averageSalaryRange && (
                    <div className="bg-emerald-50/60 border border-emerald-200 px-4 py-2.5 rounded-2xl text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block tracking-wider">
                        Market Compensation (INR)
                      </span>
                      <span className="text-base font-extrabold text-emerald-700 flex items-center space-x-1 sm:justify-end mt-0.5">
                        <IndianRupee className="w-4 h-4 text-emerald-600 -mr-0.5" />
                        <span>{formatSalaryInr(currentRole.averageSalaryRange)}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Matched Skills ({currentRole.matchedSkills.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentRole.matchedSkills.map((s, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg bg-white text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Missing Skills to Prepare ({currentRole.missingSkills.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentRole.missingSkills.map((m, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg bg-white text-amber-800 border border-amber-200 text-xs font-semibold shadow-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Focus Topics Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Key Technical & Behavioral Interview Focus Topics:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentRole.interviewFocusTopics.map((topic, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        <span className="font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DUAL ACTION CARDS (Practice Test vs Live Video Interview) */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-slate-600 block">
                    Choose your preparation path for <strong className="text-slate-900">{currentRole.roleTitle}</strong>:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Option 1: Practice Test Mode */}
                    <div 
                      id="card-action-practice"
                      onClick={onStartPractice}
                      className="bg-white border-2 border-slate-200 hover:border-emerald-500 p-5 rounded-2xl cursor-pointer group transition-all hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          1. Practice Mode
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Take a resume-tailored test with multiple-choice, code snippet, and architecture questions. Receive an instant knowledge report with correct answers.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                        <span>Start Practice Test</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Option 2: Live AI Video Interview */}
                    <div 
                      id="card-action-interview"
                      onClick={onStartInterview}
                      className="bg-slate-900 border-2 border-slate-900 hover:border-blue-500 p-5 rounded-2xl cursor-pointer group transition-all shadow-lg text-white flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
                          <Video className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                          2. Live Video Mock Interview
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Start webcam & microphone. The AI Coach asks questions verbally. Analyze speech grammar, filler words frequency, answer correctness, and posture.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
                        <span>Start Live Video Interview</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: AI Resume & Career Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Personalized Resume & Career Optimization Suggestions</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Targeted recommendations to upgrade your resume, pass Applicant Tracking Systems (ATS), and impress hiring managers.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto overflow-x-auto">
                {['all', 'Impact', 'ATS', 'Skill', 'Project'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSuggestionCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all capitalize font-semibold ${
                      selectedSuggestionCategory === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat === 'all' ? 'All Suggestions' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSuggestions.map((sug) => {
                const isApplied = !!appliedSuggestions[sug.id];
                return (
                  <div
                    key={sug.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      isApplied
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              sug.priority === 'High Priority'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : sug.priority === 'Recommended'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {sug.priority}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {sug.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {sug.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => toggleSuggestionApplied(sug.id)}
                        className={`p-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 flex items-center space-x-1 ${
                          isApplied
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={isApplied ? 'Marked as completed' : 'Mark as applied'}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">
                          {isApplied ? 'Completed' : 'Mark Done'}
                        </span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sug.description}
                    </p>

                    {/* Action Item Box */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                        Recommended Action:
                      </span>
                      <p className="text-xs text-slate-800 font-medium">
                        {sug.actionItem}
                      </p>
                    </div>

                    {/* Before vs After Example */}
                    {sug.exampleBeforeAfter && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Before vs After Rewrite Example:
                        </span>
                        <div className="space-y-1.5 text-xs">
                          <div className="bg-rose-50/60 border border-rose-100 p-2.5 rounded-xl text-rose-900">
                            <span className="font-bold text-[10px] uppercase text-rose-600 block mb-0.5">Weak Bullet:</span>
                            "{sug.exampleBeforeAfter.before}"
                          </div>
                          <div className="bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-xl text-emerald-900">
                            <span className="font-bold text-[10px] uppercase text-emerald-600 block mb-0.5">High-Impact Bullet:</span>
                            "{sug.exampleBeforeAfter.after}"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Full Extracted Resume Breakdown */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>Extracted Candidate Information & Verification</span>
            </h2>
            <button
              onClick={() => {
                setEditForm({
                  candidateName: analysis.candidateName || '',
                  email: analysis.email || '',
                  phone: analysis.phone || '',
                  summary: analysis.summary || '',
                  skillsString: (analysis.technicalSkills || []).join(', '),
                });
                setIsEditModalOpen(true);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Refine Information</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Education & Skills */}
            <div className="space-y-6">
              
              {/* Education Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Collected Education Details</span>
                </h4>
                {analysis.education && analysis.education.length > 0 ? (
                  analysis.education.map((edu, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl space-y-1">
                      <div className="font-bold text-xs text-slate-900">{edu.degree}</div>
                      <div className="text-[11px] text-slate-600">{edu.institution}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Year: {edu.year}</span>
                        {edu.gpaOrGrade && <span className="font-semibold text-emerald-700">GPA/Score: {edu.gpaOrGrade}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Degree details parsed from resume.</p>
                )}
              </div>

              {/* Technical Skills Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Code className="w-4 h-4 text-emerald-600" />
                  <span>Collected Technical Skills Matrix</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.technicalSkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Identified Competitive Strengths</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysis.strengths.map((st, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column: Projects & Work Experience */}
            <div className="space-y-6">
              
              {/* Projects Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span>Collected Resume Projects</span>
                </h4>
                <div className="space-y-3 text-xs">
                  {analysis.projects.map((proj, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5">
                      <span className="font-bold text-slate-900 block">{proj.name}</span>
                      <p className="text-slate-600">{proj.description}</p>
                      {proj.outcomes && (
                        <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100">
                          🎯 Outcomes: {proj.outcomes}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              {analysis.workExperience && analysis.workExperience.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Work Experience & Internships</span>
                  </h4>
                  {analysis.workExperience.map((exp, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl space-y-1">
                      <div className="font-bold text-xs text-slate-900">{exp.title} • {exp.company}</div>
                      <div className="text-[11px] text-slate-500">{exp.duration}</div>
                      {exp.highlights && (
                        <ul className="space-y-1 pt-1 text-[11px] text-slate-600 list-disc list-inside">
                          {exp.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Areas for Improvement */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Interview Preparation Gaps</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysis.areasForImprovement.map((imp, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Refine Extracted Candidate Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editForm.candidateName}
                  onChange={(e) => setEditForm({ ...editForm, candidateName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Summary</label>
                <textarea
                  rows={3}
                  value={editForm.summary}
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skillsString}
                  onChange={(e) => setEditForm({ ...editForm, skillsString: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, TypeScript, Node.js, SQL, Docker"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20"
                >
                  Save & Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
