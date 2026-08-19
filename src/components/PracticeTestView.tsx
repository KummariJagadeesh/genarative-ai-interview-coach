import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Code, 
  Sparkles, 
  HelpCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { 
  ResumeAnalysis, 
  JobRoleRecommendation, 
  PracticeQuestion, 
  PracticeUserAnswer, 
  PracticeTestReport 
} from '../types';

interface PracticeTestViewProps {
  analysis: ResumeAnalysis;
  role: JobRoleRecommendation;
  onTestComplete: (report: PracticeTestReport) => void;
  onBack: () => void;
}

export const PracticeTestView: React.FC<PracticeTestViewProps> = ({
  analysis,
  role,
  onTestComplete,
  onBack,
}) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load tailored questions
  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/generate-practice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleTitle: role.roleTitle,
            candidateSkills: analysis.technicalSkills,
            candidateProjects: analysis.projects,
            questionCount: 5,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate practice test');
        const data = await response.json();
        if (isMounted && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.warn('Using default practice questions:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [role.roleTitle]);

  // Timer countdown
  useEffect(() => {
    if (isLoading || isSubmitting) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading, isSubmitting]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const formattedAnswers: PracticeUserAnswer[] = questions.map((q) => ({
        questionId: q.id,
        selectedOptionIndex: userAnswers[q.id],
        timeSpentSeconds: 600 - timeRemaining,
      }));

      const response = await fetch('/api/grade-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: analysis.candidateName,
          targetRole: role.roleTitle,
          questions,
          userAnswers: formattedAnswers,
          totalTimeSeconds: 600 - timeRemaining,
        }),
      });

      if (!response.ok) throw new Error('Grading failed');
      const data = await response.json();
      if (data.report) {
        onTestComplete(data.report);
      } else {
        throw new Error('No report in response');
      }
    } catch (err) {
      console.warn('Fallback test report generation:', err);
      // Fallback report calculation
      let earned = 0;
      let max = 0;
      const results = questions.map((q) => {
        const uAns = userAnswers[q.id];
        const isCorrect = uAns === q.correctOptionIndex;
        const pts = isCorrect ? q.points : 0;
        earned += pts;
        max += q.points;

        return {
          questionId: q.id,
          question: q.question,
          category: q.category,
          type: q.type,
          userAnswer: uAns !== undefined ? q.options?.[uAns] || 'No answer' : 'No answer',
          isCorrect,
          score: pts,
          maxPoints: q.points,
          modelExplanation: q.explanation || 'Review core documentation for this concept.',
          keyTakeaway: `Key takeaway for ${q.category}`,
        };
      });

      const scorePct = max > 0 ? Math.round((earned / max) * 100) : 0;
      onTestComplete({
        id: `report-${Date.now()}`,
        candidateName: analysis.candidateName || 'Candidate',
        targetRole: role.roleTitle,
        totalScore: scorePct,
        earnedPoints: earned,
        maxPoints: max,
        accuracyRate: scorePct,
        timeSpentSeconds: 600 - timeRemaining,
        difficultyLevel: 'Intermediate',
        categoryBreakdown: [
          {
            category: 'Technical Core',
            score: earned,
            total: max,
            percentage: scorePct,
          },
        ],
        results,
        strengths: ['Demonstrated good technical comprehension of core stack'],
        areasToReview: ['Focus on edge cases and async execution models'],
        recommendation: 'Practice complete! Ready to start the Live AI Video Mock Interview.',
        completedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = questions[currentIndex];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <h2 className="text-xl font-bold text-white tracking-tight">
          Generating Tailored Practice Questions for {role.roleTitle}...
        </h2>
        <p className="text-xs text-slate-400">
          Synthesizing assessment questions based on your resume skills and project tech stack...
        </p>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">No questions loaded.</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Test Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="Back to Job Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                Practice Assessment
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {analysis.candidateName}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {role.roleTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Live Timer */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
            <Clock className={`w-4 h-4 ${timeRemaining < 120 ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`} />
            <span className={`font-mono text-sm font-bold ${timeRemaining < 120 ? 'text-rose-600' : 'text-slate-800'}`}>
              {formatTimer(timeRemaining)}
            </span>
          </div>

          <button
            id="btn-submit-test-top"
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Test ({answeredCount}/{questions.length})</span>
          </button>
        </div>
      </div>

      {/* Question Palette Navigation */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto shadow-xs">
        <div className="flex items-center space-x-2">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                id={`palette-q-${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500/40 shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 shrink-0 font-semibold">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Active Question Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Category & Points Badges */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
              {currentQ.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {currentQ.difficulty}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {currentQ.points} Points
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Code Snippet Box (if any) */}
          {currentQ.codeSnippet && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner">
              <pre>
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options?.map((option, optIdx) => {
            const isSelected = userAnswers[currentQ.id] === optIdx;
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <button
                key={optIdx}
                id={`q-${currentIndex + 1}-opt-${optIdx}`}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start space-x-3.5 ${
                  isSelected
                    ? 'bg-blue-50/80 border-2 border-blue-600 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {letter}
                </div>
                <span className="text-sm font-semibold leading-relaxed">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 transition-all"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-submit-test-bottom"
              onClick={() => setShowConfirmModal(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit & View Report</span>
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Submit Practice Test?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered <strong className="text-slate-900">{answeredCount}</strong> out of <strong className="text-slate-900">{questions.length}</strong> questions.
              Once submitted, our AI Lead Examiner will grade your answers and generate an in-depth score breakdown with model explanations.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep Reviewing
              </button>
              <button
                id="btn-confirm-submit"
                disabled={isSubmitting}
                onClick={handleSubmitTest}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Grading Answers...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Yes, Submit & View Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
