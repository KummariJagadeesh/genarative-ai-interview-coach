import React, { useState } from 'react';
import { 
  AppView, 
  UserProfile, 
  ResumeAnalysis, 
  JobRoleRecommendation, 
  PracticeTestReport, 
  FinalInterviewReport 
} from './types';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { ResumeUploadView } from './components/ResumeUploadView';
import { JobMatchingView } from './components/JobMatchingView';
import { PracticeTestView } from './components/PracticeTestView';
import { PracticeReportView } from './components/PracticeReportView';
import { InterviewSessionView } from './components/InterviewSessionView';
import { InterviewReportView } from './components/InterviewReportView';
import { PRESET_RESUMES } from './data/sampleResumes';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [selectedRole, setSelectedRole] = useState<JobRoleRecommendation | null>(null);
  const [practiceReport, setPracticeReport] = useState<PracticeTestReport | null>(null);
  const [interviewReport, setInterviewReport] = useState<FinalInterviewReport | null>(null);

  // 1. User Login Handler
  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setCurrentView('upload_resume');
  };

  // 2. Resume Upload & Analysis Complete Handler
  const handleResumeAnalyzed = (analysis: ResumeAnalysis) => {
    setResumeAnalysis(analysis);
    if (analysis.recommendedJobRoles && analysis.recommendedJobRoles.length > 0) {
      setSelectedRole(analysis.recommendedJobRoles[0]);
    }
    setCurrentView('job_matching');
  };

  // 3. Select / Change Role
  const handleSelectRole = (role: JobRoleRecommendation) => {
    setSelectedRole(role);
  };

  // 4. Start Practice Mode
  const handleStartPractice = () => {
    if (!selectedRole && resumeAnalysis?.recommendedJobRoles?.[0]) {
      setSelectedRole(resumeAnalysis.recommendedJobRoles[0]);
    }
    setCurrentView('practice_test');
  };

  // 5. Practice Test Submitted
  const handlePracticeComplete = (report: PracticeTestReport) => {
    setPracticeReport(report);
    setCurrentView('practice_report');
  };

  // 6. Start Live AI Video Interview
  const handleStartInterview = () => {
    if (!selectedRole && resumeAnalysis?.recommendedJobRoles?.[0]) {
      setSelectedRole(resumeAnalysis.recommendedJobRoles[0]);
    }
    setCurrentView('interview_session');
  };

  // 7. Interview Complete
  const handleInterviewComplete = (report: FinalInterviewReport) => {
    setInterviewReport(report);
    setCurrentView('interview_report');
  };

  // Reset / Logout
  const handleLogout = () => {
    setUser(null);
    setResumeAnalysis(null);
    setSelectedRole(null);
    setPracticeReport(null);
    setInterviewReport(null);
    setCurrentView('login');
  };

  // Quick Demo Shortcut
  const handleLoadDemo = () => {
    const preset = PRESET_RESUMES[0];
    const demoUser: UserProfile = {
      id: 'demo-user-1',
      name: preset.name,
      email: preset.analysis.email || 'alex.rivera@example.com',
      collegeOrCompany: 'Tech Institute of Technology',
      experienceLevel: 'Entry Level / Fresher',
      roleTitle: preset.targetRole,
    };
    setUser(demoUser);
    setResumeAnalysis(preset.analysis);
    setSelectedRole(preset.analysis.recommendedJobRoles[0]);
    setCurrentView('job_matching');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        user={user}
        onNavigate={(view) => setCurrentView(view)}
        onLogout={handleLogout}
        onLoadDemo={handleLoadDemo}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'login' && (
          <LoginView onLogin={handleLogin} />
        )}

        {currentView === 'upload_resume' && user && (
          <ResumeUploadView
            user={user}
            onAnalysisComplete={handleResumeAnalyzed}
          />
        )}

        {currentView === 'job_matching' && resumeAnalysis && (
          <JobMatchingView
            analysis={resumeAnalysis}
            selectedRole={selectedRole}
            onSelectRole={handleSelectRole}
            onStartPractice={handleStartPractice}
            onStartInterview={handleStartInterview}
            onUploadDifferentResume={() => setCurrentView('upload_resume')}
          />
        )}

        {currentView === 'practice_test' && resumeAnalysis && selectedRole && (
          <PracticeTestView
            analysis={resumeAnalysis}
            role={selectedRole}
            onTestComplete={handlePracticeComplete}
            onBack={() => setCurrentView('job_matching')}
          />
        )}

        {currentView === 'practice_report' && practiceReport && (
          <PracticeReportView
            report={practiceReport}
            onProceedToInterview={handleStartInterview}
            onRetake={() => setCurrentView('practice_test')}
            onBackToRoles={() => setCurrentView('job_matching')}
          />
        )}

        {currentView === 'interview_session' && resumeAnalysis && selectedRole && (
          <InterviewSessionView
            analysis={resumeAnalysis}
            role={selectedRole}
            onInterviewComplete={handleInterviewComplete}
            onBack={() => setCurrentView('job_matching')}
          />
        )}

        {currentView === 'interview_report' && interviewReport && (
          <InterviewReportView
            report={interviewReport}
            onRetake={() => setCurrentView('interview_session')}
            onBackToRoles={() => setCurrentView('job_matching')}
          />
        )}
      </main>

      {/* Global Geometric Balance Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-semibold text-slate-700">AI Mock Interview Coach • Capstone Project</span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Powered by Gemini 2.5 • Web Speech API • Real-Time Multimodal Evaluation
        </div>
      </footer>
    </div>
  );
}
