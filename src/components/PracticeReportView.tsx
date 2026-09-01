import React, { useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Video, 
  Download, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PracticeTestReport } from '../types';
import { exportPracticeReportPDF } from '../lib/pdfExport';

interface PracticeReportViewProps {
  report: PracticeTestReport;
  onProceedToInterview: () => void;
  onRetake: () => void;
  onBackToRoles: () => void;
}

export const PracticeReportView: React.FC<PracticeReportViewProps> = ({
  report,
  onProceedToInterview,
  onRetake,
  onBackToRoles,
}) => {
  // Fire confetti if score is high
  useEffect(() => {
    if (report.totalScore >= 70) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [report.totalScore]);

  const isPassing = report.totalScore >= 70;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Banner: Score & Overall Verdict */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Practice Test Assessment Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Test Completed: {report.targetRole}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {report.recommendation}
            </p>
            <div className="text-xs text-slate-500 pt-1 font-medium">
              Candidate: <strong className="text-slate-900">{report.candidateName}</strong> • Evaluated on: {report.completedAt}
            </div>

            {/* Stage 1 & Stage 2 Multi-stage Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                <span>Stage 1 MCQs:</span>
                <strong>{report.stage1Score ? `${report.stage1Score.correctCount}/${report.stage1Score.totalCount} (${report.stage1Score.percentage}%)` : 'Passed'}</strong>
              </span>
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
                report.stage2Unlocked 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <span>Stage 2 Advanced:</span>
                <strong>{report.stage2Unlocked ? 'Unlocked & Evaluated' : 'Stage 1 Threshold Not Met'}</strong>
              </span>
            </div>
          </div>

          {/* Big Score Dial Box */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[170px]">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Score
            </div>
            <div className="text-4xl sm:text-5xl font-black text-slate-900">
              {report.totalScore}%
            </div>
            <span className="text-xs text-slate-500 mt-1 font-semibold">
              {report.earnedPoints} / {report.maxPoints} Points
            </span>
            <span className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isPassing 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isPassing ? 'Assessment Passed' : 'Review Recommended'}
            </span>
          </div>

        </div>

        {/* Action Button Strip */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              id="btn-download-practice-pdf"
              onClick={() => exportPracticeReportPDF(report)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download Test PDF Report</span>
            </button>
            <button
              onClick={onRetake}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>
          </div>

          {/* PRIMARY NEXT STEP: LIVE AI VIDEO INTERVIEW */}
          <button
            id="btn-proceed-to-live-interview"
            onClick={onProceedToInterview}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all active:scale-95 group"
          >
            <Video className="w-4 h-4 text-blue-200" />
            <span>Proceed to Live Video Mock Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Strengths & Areas to Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-emerald-700 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Strengths in Assessment</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {report.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-amber-700 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Key Concepts to Polish for Live Interview</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {report.areasToReview.map((a, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span className="font-medium">{a}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Question by Question Detailed Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Detailed Question Review & Model Explanations</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {report.results.filter((r) => r.isCorrect).length} Correct of {report.results.length} Questions
          </span>
        </div>

        <div className="space-y-4">
          {report.results.map((res, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-3xl p-5 sm:p-6 space-y-3.5 transition-all shadow-xs ${
                res.isCorrect
                  ? 'border-emerald-200'
                  : 'border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">
                    Question {idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {res.category}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {res.isCorrect ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Correct (+{res.score} pts)</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Incorrect (0 pts)</span>
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {res.question}
              </h3>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="text-slate-600">
                  Your Answer:{' '}
                  <span className={res.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                    {res.userAnswer}
                  </span>
                </div>
              </div>

              {/* Model Explanation Box */}
              <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-700">
                <div className="text-blue-700 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Lead Examiner Model Explanation</span>
                </div>
                <p className="leading-relaxed">{res.modelExplanation}</p>
                {res.keyTakeaway && (
                  <div className="text-[11px] text-blue-900 pt-1 border-t border-blue-100 font-semibold">
                    💡 Key Takeaway: {res.keyTakeaway}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bridge to Live Interview */}
      <div className="bg-slate-900 border-2 border-slate-900 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-md text-white">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Ready to Test Your Verbal Communication & Spoken Accuracy?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Start the interactive Live AI Video Interview. Practice answering technical and behavioral questions out loud with speech grammar, filler words, and video delivery analysis.
        </p>
        <button
          onClick={onProceedToInterview}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/25 inline-flex items-center space-x-2 transition-all active:scale-95"
        >
          <Video className="w-4 h-4 text-blue-200" />
          <span>Launch AI Video Mock Interview Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
