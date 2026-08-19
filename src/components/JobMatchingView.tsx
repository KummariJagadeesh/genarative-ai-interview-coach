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
  Plus,
  Flame,
  DollarSign
} from 'lucide-react';
import { ResumeAnalysis, JobRoleRecommendation } from '../types';

interface JobMatchingViewProps {
  analysis: ResumeAnalysis;
  selectedRole: JobRoleRecommendation | null;
  onSelectRole: (role: JobRoleRecommendation) => void;
  onStartPractice: () => void;
  onStartInterview: () => void;
  onUploadDifferentResume: () => void;
}

export const JobMatchingView: React.FC<JobMatchingViewProps> = ({
  analysis,
  selectedRole,
  onSelectRole,
  onStartPractice,
  onStartInterview,
  onUploadDifferentResume,
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'profile'>('roles');

  const currentRole = selectedRole || analysis.recommendedJobRoles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Resume Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resume Analyzed Successfully</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {analysis.candidateName || 'Candidate Profile'}
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {analysis.summary}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {analysis.technicalSkills.slice(0, 8).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
              {analysis.technicalSkills.length > 8 && (
                <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200">
                  +{analysis.technicalSkills.length - 8} more skills
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
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
        <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-slate-100 text-xs font-medium">
          <button
            id="tab-suggested-roles"
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-semibold ${
              activeTab === 'roles'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Suggested Job Roles ({analysis.recommendedJobRoles.length})</span>
          </button>
          <button
            id="tab-extracted-profile"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-semibold ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Resume Breakdown & Skills</span>
          </button>
        </div>
      </div>

      {activeTab === 'roles' ? (
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
              {analysis.recommendedJobRoles.map((role) => {
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

                    {/* Skills Summary Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {role.matchedSkills.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1"
                        >
                          <Check className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> {s}
                        </span>
                      ))}
                      {role.missingSkills.slice(0, 2).map((m, i) => (
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
            
            {/* Selected Role Focus Card */}
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
                    <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Estimated Salary Range
                      </span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5 -mr-1" />
                        <span>{currentRole.averageSalaryRange}</span>
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
      ) : (
        /* Tab 2: Full Extracted Resume Breakdown */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Extracted Resume Information & Diagnostics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths & Areas to Improve */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5">
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

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-700 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Areas to Strengthen for Interviews</span>
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

            {/* Projects & Work History */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-blue-700 flex items-center space-x-1.5">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span>Key Resume Projects</span>
                </h4>
                <div className="space-y-3 text-xs">
                  {analysis.projects.map((proj, i) => (
                    <div key={i} className="border-l-2 border-blue-600 pl-3 space-y-1">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      <p className="text-slate-600">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.workExperience && analysis.workExperience.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-indigo-700 flex items-center space-x-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Work Experience</span>
                  </h4>
                  {analysis.workExperience.map((exp, i) => (
                    <div key={i} className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">{exp.title} • {exp.company}</div>
                      <div className="text-[11px] text-slate-500">{exp.duration}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
