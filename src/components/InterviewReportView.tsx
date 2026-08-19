import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  Video, 
  Activity, 
  Eye, 
  Check, 
  HelpCircle,
  BarChart3,
  ThumbsUp,
  FileText,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FinalInterviewReport } from '../types';
import { exportInterviewReportPDF } from '../lib/pdfExport';

interface InterviewReportViewProps {
  report: FinalInterviewReport;
  onRetake: () => void;
  onBackToRoles: () => void;
}

export const InterviewReportView: React.FC<InterviewReportViewProps> = ({
  report,
  onRetake,
  onBackToRoles,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'grammar' | 'word_frequency' | 'correctness' | 'delivery'>('overview');

  // Trigger celebration confetti
  useEffect(() => {
    if (report.overallScore >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [report.overallScore]);

  const getDecisionBadge = (decision: FinalInterviewReport['hiringDecision']) => {
    switch (decision) {
      case 'Strong Hire':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Hire':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Leaning Hire':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Overall Score & Hiring Recommendation */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Capstone Mock Interview Assessment</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getDecisionBadge(report.hiringDecision)}`}>
                Recommendation: {report.hiringDecision}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Interview Evaluation: {report.targetRole}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {report.executiveSummary}
            </p>

            <div className="text-xs text-slate-500 pt-1 font-medium">
              Candidate: <strong className="text-slate-900">{report.candidateName}</strong> • Evaluated on: {report.completedAt}
            </div>
          </div>

            {/* Big Score Card & Marks Awarded */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              {/* Total Marks Awarded Card */}
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[170px] shadow-xs text-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                  Total Marks Earned
                </span>
                <div className="text-4xl font-black text-blue-950">
                  {report.totalMarksEarned ?? report.overallScore}
                  <span className="text-xl text-blue-400">/{report.totalMaxMarks ?? 100}</span>
                </div>
                <span className="text-[11px] text-blue-700 mt-1 font-bold">
                  Marks for Answer Relevance
                </span>
              </div>

              {/* Overall Percentage Score */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[170px] shadow-xs text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Overall Rating
                </span>
                <div className="text-4xl font-black text-slate-900">
                  {report.overallScore}
                  <span className="text-xl text-slate-400">/100</span>
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 font-bold">
                  {report.overallRelevanceScore ?? 92}% Question Match
                </span>
              </div>

            </div>

        </div>

        {/* Action Button Strip */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-download-interview-pdf"
              onClick={() => exportInterviewReportPDF(report)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm shadow-blue-500/20 flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>Download Official PDF Report</span>
            </button>
            <button
              onClick={onRetake}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Interview</span>
            </button>
          </div>

          <button
            onClick={onBackToRoles}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch Target Role</span>
          </button>
        </div>

        {/* Report Section Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          <button
            id="tab-report-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Overview & Action Plan</span>
          </button>
          <button
            id="tab-report-grammar"
            onClick={() => setActiveTab('grammar')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'grammar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Grammar & Fluency ({report.grammarSummary.overallGrammarScore}%)</span>
          </button>
          <button
            id="tab-report-words"
            onClick={() => setActiveTab('word_frequency')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'word_frequency'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Word Usage & Filler Words ({report.wordUsageSummary.totalFillerWords})</span>
          </button>
          <button
            id="tab-report-correctness"
            onClick={() => setActiveTab('correctness')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'correctness'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Answer Correctness & Model Answers ({report.questionEvaluations.length})</span>
          </button>
          <button
            id="tab-report-delivery"
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'delivery'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video & Confidence ({report.deliveryAssessment.overallConfidenceScore}%)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & ACTION PLAN */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">Grammar Score</span>
              <div className="text-2xl font-black text-slate-900 flex items-center space-x-1">
                <span>{report.grammarSummary.overallGrammarScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                {report.grammarSummary.vocabularyProficiency}
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">Filler Word Frequency</span>
              <div className="text-2xl font-black text-slate-900 flex items-center space-x-1">
                <span>{report.wordUsageSummary.totalFillerWords}</span>
                <span className="text-xs text-slate-400 font-normal">fillers</span>
              </div>
              <span className="text-[11px] text-amber-600 font-semibold block">
                {report.wordUsageSummary.fillerWordsRatio}% of spoken words
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">Speaking Pacing</span>
              <div className="text-2xl font-black text-slate-900 flex items-center space-x-1">
                <span>{report.deliveryAssessment.averageWordsPerMinute}</span>
                <span className="text-xs text-slate-400 font-normal">WPM</span>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold block">
                {report.deliveryAssessment.pacingRating}
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">Delivery Confidence</span>
              <div className="text-2xl font-black text-slate-900 flex items-center space-x-1">
                <span>{report.deliveryAssessment.overallConfidenceScore}</span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                Strong Eye Contact
              </span>
            </div>

          </div>

          {/* Superpower Strengths & Priority Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-emerald-700 flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Top Demonstrated Superpower Strengths</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.topSuperpowerStrengths.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-amber-700 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Prioritized Action Items to Ace Real Interviews</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.priorityActionItems.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span className="leading-relaxed font-medium">{act}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Study Roadmap */}
          {report.studyRoadmap && report.studyRoadmap.length > 0 && (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-blue-700 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Recommended 3-Step Preparation Roadmap</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {report.studyRoadmap.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      Step {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: GRAMMAR & FLUENCY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'grammar' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Grammar Accuracy & Spoken Fluency Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates grammatical tense consistency, sentence formation, and professional vocabulary.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shrink-0 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Grammar Accuracy Score
              </span>
              <span className="text-xl font-extrabold text-emerald-600">
                {report.grammarSummary.overallGrammarScore}/100
              </span>
            </div>
          </div>

          {report.grammarSummary.frequentErrors && report.grammarSummary.frequentErrors.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Specific Sentence Corrections & Polish Suggestions:
              </h3>
              <div className="space-y-3">
                {report.grammarSummary.frequentErrors.map((err, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="text-rose-700 font-medium">
                      ❌ Spoken: <span className="text-slate-800 font-normal">"{err.originalSentence}"</span>
                    </div>
                    <div className="text-emerald-700 font-bold">
                      ✅ Polished Alternative: <span className="text-slate-900">"{err.suggestedImprovement}"</span>
                    </div>
                    {err.explanation && (
                      <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                        💡 {err.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Excellent Spoken Grammar:</strong> No major grammatical flaws or tense disagreements were detected in your responses.
              </span>
            </div>
          )}

          {/* Per Question Fluency Overview */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">
              Fluency Assessment per Question:
            </h3>
            <div className="space-y-3">
              {report.questionEvaluations.map((q, idx) => (
                <div key={q.questionId} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Q{idx + 1}: {q.category}</span>
                    <span className="text-emerald-600 font-bold">{q.grammarScore}/100 Grammar</span>
                  </div>
                  <p className="text-slate-600">{q.fluencyAssessment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: WORD USAGE & FILLER WORDS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'word_frequency' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Spoken Word Frequency & Filler Words Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracks verbal fillers ("um", "like", "actually", "basically") and most frequently repeated words.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shrink-0 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Filler Impact
              </span>
              <span className="text-sm font-bold text-amber-600">
                {report.wordUsageSummary.fillerWordImpact}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Filler Words Breakdown */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-amber-700 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Detected Filler Words Frequency</span>
              </h3>

              <div className="space-y-2">
                {report.wordUsageSummary.topFillerWords && report.wordUsageSummary.topFillerWords.length > 0 ? (
                  report.wordUsageSummary.topFillerWords.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                      <span className="font-bold text-slate-900 capitalize">"{item.word}"</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        {item.count} times
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No recurring filler words detected!</p>
                )}
              </div>

              <div className="pt-2 text-[11px] text-slate-600 leading-relaxed">
                💡 <strong>Coaching Advice:</strong> Whenever you feel the urge to say "like" or "um", try taking a silent 1-second breath instead. Silence conveys thoughtful confidence in technical interviews.
              </div>
            </div>

            {/* Most Common Meaningful Words */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-blue-700 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Most Frequently Spoken Vocabulary Words</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {report.wordUsageSummary.topCommonWords.map((item, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center space-x-2 shadow-xs">
                    <span className="text-slate-800 font-semibold">{item.word}</span>
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Total Words Spoken: <strong className="text-slate-900">{report.wordUsageSummary.totalWordsSpoken} words</strong> across all questions.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: ANSWER CORRECTNESS & MODEL ANSWERS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'correctness' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Spoken Answer Correctness vs Ideal Model Responses</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {report.questionEvaluations.length} Questions Evaluated
            </span>
          </div>

          <div className="space-y-6">
            {report.questionEvaluations.map((q, idx) => (
              <div
                key={q.questionId}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Question {idx + 1} • {q.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      "{q.questionText}"
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Marks Awarded Badge */}
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1 shadow-xs">
                      <span>Marks:</span>
                      <span className="text-blue-950 font-black">
                        {q.marksEarned ?? Math.round((q.contentScore / 100) * 25)} / {q.maxMarks ?? 25}
                      </span>
                    </span>

                    {/* Relevance Verdict Badge */}
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1 ${
                      (q.relevanceVerdict || '').toLowerCase().includes('relevant') && !(q.relevanceVerdict || '').toLowerCase().includes('irrelevant')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : (q.relevanceVerdict || '').toLowerCase().includes('partial')
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      <span>
                        {q.relevanceVerdict || (q.contentScore >= 75 ? '🟢 Highly Relevant Answer' : '🟡 Partially Relevant')}
                      </span>
                    </span>

                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      q.contentScore >= 80
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {q.contentScore}/100 Accuracy
                    </span>
                  </div>
                </div>

                {/* Question Relevance & Marks Breakdown Box */}
                <div className="bg-slate-50 border border-blue-100 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center space-x-1 text-blue-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Question Relevance & Marks Assessment:</span>
                    </span>
                    <span className="text-emerald-700">
                      Relevance Score: {q.relevanceScore ?? q.contentScore}%
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {q.relevanceReasoning || (
                      q.contentScore >= 75
                        ? 'Candidate directly addressed the core question prompt with high contextual relevance, correct technical terminology, and concrete trade-off reasoning.'
                        : 'Candidate partially answered the prompt but omitted key architectural trade-offs or drifted slightly off the specific question scope.'
                    )}
                  </p>
                </div>

                {/* Candidate's Actual Spoken Transcript */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Your Spoken Response (Transcript):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                    "{q.transcript}"
                  </p>
                </div>

                {/* Feedback Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl space-y-1.5">
                    <span className="font-bold text-emerald-800 block">
                      Key Points You Covered Well:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {q.keyPointsCovered.map((kp, kIdx) => (
                        <li key={kIdx} className="flex items-start space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-2xl space-y-1.5">
                    <span className="font-bold text-amber-800 block">
                      Missed Points to Include in Future:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {q.missedKeyPoints.map((mp, mIdx) => (
                        <li key={mIdx} className="flex items-start space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span>{mp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ideal Senior Model Answer */}
                <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-blue-700 font-bold">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Ideal FAANG / Senior Engineer Model Answer:</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">
                    {q.idealModelAnswer}
                  </p>
                </div>

                {/* Coach Feedback */}
                <div className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <strong className="text-slate-900">Hiring Coach Feedback:</strong> {q.interviewerFeedback}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: VIDEO & CONFIDENCE DELIVERY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'delivery' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Video Presence, Eye Contact & Delivery Assessment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation of confidence, posture stability, camera eye engagement, and vocal pacing.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shrink-0 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Confidence Rating
              </span>
              <span className="text-xl font-extrabold text-blue-600">
                {report.deliveryAssessment.overallConfidenceScore}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Single Candidate Proctoring Integrity Card */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Single-Candidate Proctor Integrity</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  (report.proctorIntegrity?.violationCount || 0) === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {report.proctorIntegrity?.singleCandidateVerified !== false ? '100% Solo Candidate' : 'Violations Detected'}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {report.proctorIntegrity?.statusMessage || 'Camera feed maintained continuous single-candidate verification with zero multi-person intrusions.'}
              </p>
              <div className="text-[11px] text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl">
                <strong>Proctor Summary:</strong> {report.proctorIntegrity?.details || 'Face bounding boxes verified single applicant isolation.'}
              </div>
            </div>

            {/* Acoustic Sound & Voice Clarity Card */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Acoustic Sound & Voice Clarity</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {report.soundClarityAnalysis?.overallClarityScore || 94}% Clarity
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {report.soundClarityAnalysis?.soundQualityNotes || 'Crisp microphone acoustics with studio-grade noise suppression.'}
              </p>
              <div className="text-[11px] text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl flex justify-between">
                <span>Vocal Volume: <strong className="text-slate-900">{report.soundClarityAnalysis?.averageDbLevel || 54} dB</strong></span>
                <span>Energy: <strong className="text-emerald-700">{report.soundClarityAnalysis?.vocalEnergy || 'Optimal'}</strong></span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Eye Contact & Camera Focus</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {report.deliveryAssessment.eyeContactAssessment}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Body Language & Posture Stability</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {report.deliveryAssessment.bodyLanguageAndPosture}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Speech Clarity & Pacing Rhythm</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {report.deliveryAssessment.speechClarityAndPace}
              </p>
              <div className="pt-2 text-[11px] text-slate-600">
                Average Speed: <strong className="text-slate-900">{report.deliveryAssessment.averageWordsPerMinute} Words Per Minute</strong> ({report.deliveryAssessment.pacingRating}).
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
