import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert,
  Lock
} from 'lucide-react';
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
import { UserHistoryModal } from './components/UserHistoryModal';
import { PRESET_RESUMES } from './data/sampleResumes';
import { 
  auth, 
  signOutUser,
  saveResumeAnalysisToFirestore, 
  getLatestResumeAnalysisFromFirestore,
  saveInterviewReportToFirestore,
  savePracticeReportToFirestore
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [selectedRole, setSelectedRole] = useState<JobRoleRecommendation | null>(null);
  const [practiceReport, setPracticeReport] = useState<PracticeTestReport | null>(null);
  const [interviewReport, setInterviewReport] = useState<FinalInterviewReport | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [clipboardBlockedToast, setClipboardBlockedToast] = useState<string | null>(null);

  // Global Anti-Copy & Anti-Paste Enforcement across the entire application
  useEffect(() => {
    let timeoutId: any = null;

    const notifyBlocked = (action: string) => {
      setClipboardBlockedToast(`🔒 ${action} is disabled in this application.`);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setClipboardBlockedToast(null);
      }, 3500);
    };

    // 1. Intercept clipboard copy, cut, paste events
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      notifyBlocked('Copying text');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      notifyBlocked('Cutting text');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      notifyBlocked('Pasting content');
    };

    // 2. Intercept keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Cmd+C, Cmd+V, Cmd+X, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isCtrlOrCmd && (key === 'c' || key === 'v' || key === 'x')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const actionMap: Record<string, string> = {
          c: 'Copy shortcut (Ctrl/Cmd+C)',
          v: 'Paste shortcut (Ctrl/Cmd+V)',
          x: 'Cut shortcut (Ctrl/Cmd+X)'
        };
        notifyBlocked(actionMap[key] || 'Clipboard action');
      }

      // Secondary clipboard combinations (Shift+Insert for paste, Ctrl+Insert for copy, Shift+Delete for cut)
      if ((e.shiftKey && e.key === 'Insert') || (e.ctrlKey && e.key === 'Insert') || (e.shiftKey && e.key === 'Delete')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        notifyBlocked('Clipboard shortcut');
      }
    };

    // 3. Intercept context menu (right-click) to prevent right-click copy/paste
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      notifyBlocked('Right-click context menu');
    };

    // 4. Intercept drag-and-drop text bypass
    const handleDrop = (e: DragEvent) => {
      // If it's a file upload (e.g. dropping PDF resume), allow it
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        return;
      }
      // If dragging text into an input/textarea, block it
      if (e.dataTransfer && e.dataTransfer.getData('text')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        notifyBlocked('Dragging and dropping text');
      }
    };

    // Attach listeners with capture phase to guarantee interception
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('drop', handleDrop, true);

    return () => {
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('drop', handleDrop, true);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // 1. Listen to Firebase Auth state on load (supports automatic session persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Candidate',
          email: firebaseUser.email || 'kummarijagadeesh9@gmail.com',
          avatarUrl: firebaseUser.photoURL || undefined,
          collegeOrCompany: 'Computer Science & Engineering',
          experienceLevel: 'Entry Level / Fresher',
          roleTitle: 'Software Engineer',
        };
        setUser(userProfile);
        
        // Auto-load latest resume analysis for this user from Firestore
        try {
          const savedResume = await getLatestResumeAnalysisFromFirestore(firebaseUser.uid);
          if (savedResume && (!resumeAnalysis || !resumeAnalysis.recommendedJobRoles)) {
            setResumeAnalysis(savedResume);
            if (savedResume.recommendedJobRoles && savedResume.recommendedJobRoles.length > 0) {
              setSelectedRole(savedResume.recommendedJobRoles[0]);
            }
          }
        } catch (e) {
          console.warn("Could not auto-load saved resume:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. User Login Handler
  const handleLogin = async (loggedUser: UserProfile) => {
    setUser(loggedUser);
    
    // Check if user has an existing saved resume in Firestore
    try {
      const savedResume = await getLatestResumeAnalysisFromFirestore(loggedUser.id);
      if (savedResume && savedResume.recommendedJobRoles && savedResume.recommendedJobRoles.length > 0) {
        setResumeAnalysis(savedResume);
        setSelectedRole(savedResume.recommendedJobRoles[0]);
        setCurrentView('job_matching');
        return;
      }
    } catch (err) {
      console.warn("Error checking saved resume:", err);
    }

    setCurrentView('upload_resume');
  };

  // 3. User Switch Handler (Multi-User System)
  const handleSwitchUser = async (newUser: UserProfile) => {
    setUser(newUser);
    setPracticeReport(null);
    setInterviewReport(null);
    
    // Load that user's saved resume
    try {
      const saved = await getLatestResumeAnalysisFromFirestore(newUser.id);
      if (saved) {
        setResumeAnalysis(saved);
        if (saved.recommendedJobRoles?.length) {
          setSelectedRole(saved.recommendedJobRoles[0]);
        }
        setCurrentView('job_matching');
        return;
      }
    } catch (e) {
      console.warn("Switch account resume load:", e);
    }

    setResumeAnalysis(null);
    setSelectedRole(null);
    setCurrentView('upload_resume');
  };

  // 4. Resume Upload & Analysis Complete Handler
  const handleResumeAnalyzed = (analysis: ResumeAnalysis) => {
    setResumeAnalysis(analysis);
    if (analysis.recommendedJobRoles && analysis.recommendedJobRoles.length > 0) {
      setSelectedRole(analysis.recommendedJobRoles[0]);
    }

    // Save to Firestore under this user's UID
    if (user?.id) {
      saveResumeAnalysisToFirestore(user.id, analysis);
    }

    setCurrentView('job_matching');
  };

  // 5. Select / Change Role
  const handleSelectRole = (role: JobRoleRecommendation) => {
    setSelectedRole(role);
  };

  // 6. Start Practice Mode
  const handleStartPractice = () => {
    if (!selectedRole && resumeAnalysis?.recommendedJobRoles?.[0]) {
      setSelectedRole(resumeAnalysis.recommendedJobRoles[0]);
    }
    setCurrentView('practice_test');
  };

  // 7. Practice Test Submitted
  const handlePracticeComplete = (report: PracticeTestReport) => {
    setPracticeReport(report);

    // Save practice test report to Firestore
    if (user?.id) {
      savePracticeReportToFirestore(user.id, report);
    }

    setCurrentView('practice_report');
  };

  // 8. Start Live AI Video Interview
  const handleStartInterview = () => {
    if (!selectedRole && resumeAnalysis?.recommendedJobRoles?.[0]) {
      setSelectedRole(resumeAnalysis.recommendedJobRoles[0]);
    }
    setCurrentView('interview_session');
  };

  // 9. Interview Complete
  const handleInterviewComplete = (report: FinalInterviewReport) => {
    setInterviewReport(report);

    // Save interview report to Firestore
    if (user?.id) {
      saveInterviewReportToFirestore(user.id, report);
    }

    setCurrentView('interview_report');
  };

  // 10. Reset / Logout
  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn("SignOut notice:", e);
    }
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
      id: 'demo-jagadeesh',
      name: 'Jagadeesh Kummari',
      email: 'kummarijagadeesh9@gmail.com',
      collegeOrCompany: 'Computer Science & Engineering',
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
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onSwitchUser={handleSwitchUser}
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
            onUpdateAnalysis={(updated) => {
              setResumeAnalysis(updated);
              if (user?.id) {
                saveResumeAnalysisToFirestore(user.id, updated);
              }
            }}
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

      {/* User History & Saved Reports Modal */}
      {user && (
        <UserHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          user={user}
          onSelectInterviewReport={(report) => {
            setInterviewReport(report);
            setCurrentView('interview_report');
          }}
          onSelectPracticeReport={(report) => {
            setPracticeReport(report);
            setCurrentView('practice_report');
          }}
        />
      )}

      {/* Global Copy & Paste Blocked Toast Notification */}
      {clipboardBlockedToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 border-2 border-rose-500 text-rose-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{clipboardBlockedToast}</span>
          </div>
        </div>
      )}

      {/* Global Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-semibold text-slate-700">AI Mock Interview Coach • Multi-User System</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600 flex items-center space-x-1">
            <Lock className="w-2.5 h-2.5 text-amber-500" />
            <span>Copy/Paste Disabled</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Powered by Gemini 2.5 • Firebase Auth (Google / Gmail) • Cloud Firestore
        </div>
      </footer>
    </div>
  );
}
