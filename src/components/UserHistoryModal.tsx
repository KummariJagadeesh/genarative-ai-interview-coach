import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Award, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  BarChart3, 
  User, 
  CloudCheck,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserProfile, FinalInterviewReport, PracticeTestReport } from '../types';
import { 
  getUserInterviewReportsFromFirestore, 
  getUserPracticeReportsFromFirestore 
} from '../lib/firebase';

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSelectInterviewReport: (report: FinalInterviewReport) => void;
  onSelectPracticeReport: (report: PracticeTestReport) => void;
}

export const UserHistoryModal: React.FC<UserHistoryModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectInterviewReport,
  onSelectPracticeReport,
}) => {
  const [activeTab, setActiveTab] = useState<'interviews' | 'practice'>('interviews');
  const [interviewReports, setInterviewReports] = useState<FinalInterviewReport[]>([]);
  const [practiceReports, setPracticeReports] = useState<PracticeTestReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [interviews, practices] = await Promise.all([
        getUserInterviewReportsFromFirestore(user.id),
        getUserPracticeReportsFromFirestore(user.id),
      ]);
      setInterviewReports(interviews || []);
      setPracticeReports(practices || []);
    } catch (err) {
      console.warn("Failed to fetch user history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchHistory();
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">My Activity & Report History</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CloudCheck className="w-3 h-3 mr-1" /> Firestore Synced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Account: <span className="font-medium text-slate-700">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchHistory}
              title="Refresh"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 border-b border-slate-200 flex space-x-3 bg-white">
          <button
            onClick={() => setActiveTab('interviews')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'interviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>AI Mock Video Interviews ({interviewReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'practice'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Practice Test Sessions ({practiceReports.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading your cloud reports...</p>
            </div>
          ) : activeTab === 'interviews' ? (
            interviewReports.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No mock interview reports saved yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Complete a Live AI Video Mock Interview to view your multi-modal evaluations, scores, and grammar feedback here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviewReports.map((report, rIdx) => (
                  <div
                    key={report?.id || `int-report-${rIdx}`}
                    onClick={() => {
                      if (report) {
                        onSelectInterviewReport(report);
                        onClose();
                      }
                    }}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {report?.targetRole || 'Technical Mock Interview'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          report?.hiringDecision === 'Strong Hire' || report?.hiringDecision === 'Hire'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {report?.hiringDecision || 'Reviewed'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report?.completedAt || 'Recently'}</span>
                        </span>
                        <span className="flex items-center space-x-1 font-semibold text-slate-700">
                          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Score: {report?.overallScore || 0}% ({report?.totalMarksEarned || 0}/100 marks)</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <span>View Report</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : practiceReports.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No practice tests saved yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Complete a resume-tailored practice test to view your answers and scores here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {practiceReports.map((report, rIdx) => (
                <div
                  key={report?.id || `prac-report-${rIdx}`}
                  onClick={() => {
                    if (report) {
                      onSelectPracticeReport(report);
                      onClose();
                    }
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {report?.targetRole || 'Technical'} Practice Test
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {report?.accuracyRate || 0}% Accuracy
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.completedAt}</span>
                      </span>
                      <span className="flex items-center space-x-1 font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{report.earnedPoints} / {report.maxPoints} Points</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <span>Review Test</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-User Cloud Sync: Reports are stored per-candidate UID</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
