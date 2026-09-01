import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  ArrowLeft,
  Lock,
  Unlock,
  ShieldAlert,
  Code2,
  ListOrdered,
  HelpCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import { 
  ResumeAnalysis, 
  JobRoleRecommendation, 
  PracticeQuestion, 
  PracticeUserAnswer, 
  PracticeTestReport 
} from '../types';
import { DEFAULT_PRACTICE_QUESTIONS } from '../data/defaultPracticeQuestions';
import { CodingChallengeEditor } from './CodingChallengeEditor';
import { CodeExecutionResult } from '../lib/codeRunner';

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
  // Test State Management
  const [questions, setQuestions] = useState<PracticeQuestion[]>(DEFAULT_PRACTICE_QUESTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User submissions
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [codeExecResults, setCodeExecResults] = useState<Record<string, CodeExecutionResult>>({});

  // Two-Stage System: Stage 1 = Questions 1-4 (MCQs). Stage 2 = Questions 5-10 (Unlocked if >= 50% on Stage 1).
  const [stage2Unlocked, setStage2Unlocked] = useState(false);
  const [showStageGateModal, setShowStageGateModal] = useState(false);
  const [stage1Passed, setStage1Passed] = useState<boolean | null>(null);
  const [stage1ScoreDetails, setStage1ScoreDetails] = useState<{ correct: number; total: number; pct: number } | null>(null);

  // Integrity & Anti-Copy-Paste Security
  const [copyPasteWarning, setCopyPasteWarning] = useState<string | null>(null);

  // Timer & Submission
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load tailored 10-question set
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
            questionCount: 10,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate practice test');
        const data = await response.json();
        if (isMounted && data.questions && Array.isArray(data.questions) && data.questions.length >= 8) {
          setQuestions(data.questions);
        } else if (isMounted) {
          setQuestions(DEFAULT_PRACTICE_QUESTIONS);
        }
      } catch (err) {
        console.warn('Using default 10 practice questions set:', err);
        if (isMounted) setQuestions(DEFAULT_PRACTICE_QUESTIONS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [role.roleTitle]);

  // Global Anti-Cheat Clipboard Prevention
  useEffect(() => {
    const preventClipboard = (e: ClipboardEvent) => {
      // Prevent copy, paste, cut
      e.preventDefault();
      triggerCopyPasteAlert();
    };

    window.addEventListener('copy', preventClipboard);
    window.addEventListener('paste', preventClipboard);
    window.addEventListener('cut', preventClipboard);

    return () => {
      window.removeEventListener('copy', preventClipboard);
      window.removeEventListener('paste', preventClipboard);
      window.removeEventListener('cut', preventClipboard);
    };
  }, []);

  const triggerCopyPasteAlert = () => {
    setCopyPasteWarning('Copy-paste is strictly disabled to ensure authentic assessment integrity.');
    setTimeout(() => {
      setCopyPasteWarning(null);
    }, 4000);
  };

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
    setMcqAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleUpdateCode = (questionId: string, code: string) => {
    setCodeAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const handleCodeExecutionComplete = (questionId: string, result: CodeExecutionResult) => {
    setCodeExecResults((prev) => ({
      ...prev,
      [questionId]: result,
    }));
  };

  // Evaluate Stage 1 (Questions 1 to 4)
  const handleCheckStage1Gate = () => {
    const stage1Questions = questions.slice(0, 4);
    let correct = 0;
    stage1Questions.forEach((q) => {
      if (mcqAnswers[q.id] !== undefined && mcqAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });

    const total = stage1Questions.length; // 4
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 50; // >= 50% condition

    setStage1ScoreDetails({ correct, total, pct });
    setStage1Passed(passed);

    if (passed) {
      setStage2Unlocked(true);
      setShowStageGateModal(true);
    } else {
      setShowStageGateModal(true);
    }
  };

  const handleProceedToStage2 = () => {
    setShowStageGateModal(false);
    setCurrentIndex(4); // Jump to question 5 (first Stage 2 question)
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Compute formatted user answers
      const formattedAnswers: PracticeUserAnswer[] = questions.map((q) => {
        if (q.type === 'code') {
          const exec = codeExecResults[q.id];
          const passedTests = exec?.passedTests ?? (exec?.passed ? (q.testCases?.length || 1) : 0);
          const totalTests = exec?.totalTests ?? (q.testCases?.length || 1);
          return {
            questionId: q.id,
            codeAnswer: codeAnswers[q.id] || q.starterCode,
            testCasesPassed: passedTests,
            totalTestCases: totalTests,
            timeSpentSeconds: 900 - timeRemaining,
          };
        } else {
          return {
            questionId: q.id,
            selectedOptionIndex: mcqAnswers[q.id],
            timeSpentSeconds: 900 - timeRemaining,
          };
        }
      });

      // Calculate stage 1 results
      const stage1Questions = questions.slice(0, 4);
      let s1Correct = 0;
      stage1Questions.forEach((q) => {
        if (mcqAnswers[q.id] === q.correctOptionIndex) {
          s1Correct++;
        }
      });
      const s1Pct = Math.round((s1Correct / 4) * 100);

      const response = await fetch('/api/grade-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: analysis.candidateName,
          targetRole: role.roleTitle,
          questions,
          userAnswers: formattedAnswers,
          totalTimeSeconds: 900 - timeRemaining,
          stage1Score: {
            correctCount: s1Correct,
            totalCount: 4,
            percentage: s1Pct,
            passed: s1Pct >= 50,
          },
          stage2Unlocked,
        }),
      });

      if (!response.ok) throw new Error('Grading API error');
      const data = await response.json();
      if (data.report) {
        onTestComplete(data.report);
      } else {
        throw new Error('No report received');
      }
    } catch (err) {
      console.warn('Fallback test report generation:', err);
      // Fallback manual grading
      let earned = 0;
      let max = 0;
      const categoryMap: Record<string, { score: number; total: number }> = {};

      const results = questions.map((q) => {
        let isCorrect = false;
        let score = 0;
        let userAnswerStr = 'Not attempted';

        if (q.type === 'code') {
          const exec = codeExecResults[q.id];
          const passedTests = exec?.passedTests || 0;
          const totalTests = exec?.totalTests || (q.testCases?.length || 1);
          isCorrect = totalTests > 0 && passedTests === totalTests;
          score = isCorrect ? q.points : Math.round((passedTests / Math.max(totalTests, 1)) * q.points);
          userAnswerStr = `Code submitted (${passedTests}/${totalTests} test cases passed)`;
        } else {
          const chosenOpt = mcqAnswers[q.id];
          isCorrect = chosenOpt !== undefined && chosenOpt === q.correctOptionIndex;
          score = isCorrect ? q.points : 0;
          userAnswerStr = chosenOpt !== undefined ? q.options?.[chosenOpt] || 'No answer' : 'No answer';
        }

        earned += score;
        max += q.points;

        if (!categoryMap[q.category]) {
          categoryMap[q.category] = { score: 0, total: 0 };
        }
        categoryMap[q.category].score += score;
        categoryMap[q.category].total += q.points;

        return {
          questionId: q.id,
          question: q.question,
          category: q.category,
          type: q.type,
          userAnswer: userAnswerStr,
          isCorrect,
          score,
          maxPoints: q.points,
          modelExplanation: q.explanation || 'Verified algorithmic correctness and conceptual design.',
          keyTakeaway: `Key takeaway in ${q.category}`,
        };
      });

      const scorePct = max > 0 ? Math.round((earned / max) * 100) : 0;
      const categoryBreakdown = Object.entries(categoryMap).map(([category, stats]) => ({
        category,
        score: stats.score,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.score / stats.total) * 100) : 0,
      }));

      onTestComplete({
        id: `report-${Date.now()}`,
        candidateName: analysis.candidateName || 'Candidate',
        targetRole: role.roleTitle,
        totalScore: scorePct,
        earnedPoints: earned,
        maxPoints: max,
        accuracyRate: scorePct,
        timeSpentSeconds: 900 - timeRemaining,
        difficultyLevel: 'Intermediate',
        stage1Score: {
          correctCount: results.slice(0, 4).filter((r) => r.isCorrect).length,
          totalCount: 4,
          percentage: Math.round((results.slice(0, 4).filter((r) => r.isCorrect).length / 4) * 100),
          passed: true,
        },
        stage2Unlocked,
        categoryBreakdown,
        results,
        strengths: ['Solid algorithmic structure and multi-tier problem solving'],
        areasToReview: ['Deepen knowledge of system edge cases and async bottlenecks'],
        recommendation: 'Assessment complete! You have verified your skills and are ready for the Live AI Mock Interview.',
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

  const answeredStage1Count = questions
    .slice(0, 4)
    .filter((q) => mcqAnswers[q.id] !== undefined).length;

  const totalAnsweredCount =
    Object.keys(mcqAnswers).length +
    Object.keys(codeExecResults).filter((k) => codeExecResults[k]?.passedTests > 0).length;

  const currentQ = questions[currentIndex];
  const isCurrentStage2 = currentIndex >= 4;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Generating 10-Question Technical Assessment for {role.roleTitle}...
        </h2>
        <p className="text-xs text-slate-500">
          Synthesizing Stage 1 (4 MCQs) and Stage 2 (6 Advanced Questions with 3 Coding Challenges)...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Copy-Paste Warning Toast */}
      {copyPasteWarning && (
        <div className="bg-rose-50 border-2 border-rose-500 text-rose-800 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-md animate-bounce">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs font-bold">
            {copyPasteWarning}
          </div>
        </div>
      )}

      {/* Test Top Bar */}
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
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                10-Question Multi-Stage Assessment
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

        <div className="flex items-center space-x-3">
          {/* Live Timer */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
            <Clock className={`w-4 h-4 ${timeRemaining < 180 ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`} />
            <span className={`font-mono text-sm font-bold ${timeRemaining < 180 ? 'text-rose-600' : 'text-slate-800'}`}>
              {formatTimer(timeRemaining)}
            </span>
          </div>

          <button
            id="btn-finish-test"
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Test</span>
          </button>
        </div>
      </div>

      {/* Stage Progression Indicator Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Stage 1: Core MCQs (Q1–4)</div>
              <div className="text-[11px] text-slate-500">Threshold: ≥ 50% to unlock Stage 2</div>
            </div>
          </div>

          <div className="text-slate-300 hidden md:block">→</div>

          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
              stage2Unlocked 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-200 text-slate-500'
            }`}>
              {stage2Unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className={`text-xs font-bold ${stage2Unlocked ? 'text-emerald-700' : 'text-slate-600'}`}>
                Stage 2: 6 Questions (3 Coding Challenges)
              </div>
              <div className="text-[11px] text-slate-500">
                {stage2Unlocked ? 'Unlocked & Active' : 'Locked until Stage 1 ≥ 50%'}
              </div>
            </div>
          </div>
        </div>

        {/* Anti-cheat badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Anti-Copy/Paste Active</span>
        </div>
      </div>

      {/* Question Palette with Stage Dividers */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Question Palette</span>
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {/* Stage 1 Questions (1 to 4) */}
          <div className="flex items-center space-x-1.5 p-1 bg-blue-50/50 rounded-xl border border-blue-100">
            <span className="text-[10px] font-bold text-blue-600 uppercase px-1">Stage 1</span>
            {questions.slice(0, 4).map((q, idx) => {
              const isAnswered = mcqAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  id={`palette-q-${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-500/40 shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-slate-300 px-1 font-bold">|</div>

          {/* Stage 2 Questions (5 to 10) */}
          <div className={`flex items-center space-x-1.5 p-1 rounded-xl border ${
            stage2Unlocked 
              ? 'bg-emerald-50/50 border-emerald-100' 
              : 'bg-slate-100/70 border-slate-200 opacity-60'
          }`}>
            <span className="text-[10px] font-bold text-emerald-700 uppercase px-1">Stage 2</span>
            {questions.slice(4, 10).map((q, rawIdx) => {
              const actualIdx = rawIdx + 4;
              const isCurrent = actualIdx === currentIndex;
              const isCode = q.type === 'code';
              const isCodePassed = codeExecResults[q.id]?.passed;
              const isAnswered = isCode ? (codeExecResults[q.id]?.passedTests ?? 0) > 0 : mcqAnswers[q.id] !== undefined;

              return (
                <button
                  key={q.id}
                  id={`palette-q-${actualIdx + 1}`}
                  disabled={!stage2Unlocked}
                  onClick={() => {
                    if (stage2Unlocked) setCurrentIndex(actualIdx);
                  }}
                  title={!stage2Unlocked ? 'Locked: Score ≥ 50% on Stage 1 to unlock' : undefined}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/40 shadow-xs'
                      : !stage2Unlocked
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isCodePassed
                      ? 'bg-emerald-500 text-white font-bold'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {actualIdx + 1}
                  {isCode && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white" title="Coding question" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Locked Stage 2 Guard Screen (If user clicks Stage 2 without unlocking) */}
      {isCurrentStage2 && !stage2Unlocked ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Stage 2 is Locked
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stage 2 contains 6 advanced questions (including 3 live code implementation challenges).
              To unlock Stage 2, you must complete the 4 Stage 1 Multiple Choice Questions and score at least <strong className="text-slate-900">50% (2 or more correct)</strong>.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Go to Stage 1 (Questions 1–4)
            </button>
            <button
              onClick={handleCheckStage1Gate}
              disabled={answeredStage1Count === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Verify Stage 1 Score & Unlock
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header Badges */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                currentQ.type === 'code' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
                {currentQ.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {currentQ.type === 'code' ? 'Code Challenge' : 'Multiple Choice'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {currentQ.difficulty}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700">
              {currentQ.points} Points
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Optional MCQ Code Snippet */}
            {currentQ.codeSnippet && currentQ.type !== 'code' && (
              <div 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner select-none"
                onCopy={(e) => { e.preventDefault(); triggerCopyPasteAlert(); }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <pre>
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Question Body: Code Editor or MCQ Options */}
          {currentQ.type === 'code' ? (
            <div className="pt-2">
              <CodingChallengeEditor
                question={currentQ}
                userCode={codeAnswers[currentQ.id] || currentQ.starterCode || ''}
                onChangeCode={(code) => handleUpdateCode(currentQ.id, code)}
                onExecutionComplete={(res) => handleCodeExecutionComplete(currentQ.id, res)}
                onPreventCopyPasteAlert={triggerCopyPasteAlert}
              />
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((option, optIdx) => {
                const isSelected = mcqAnswers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    id={`q-${currentIndex + 1}-opt-${optIdx}`}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start space-x-3.5 ${
                      isSelected
                        ? 'bg-blue-50/90 border-2 border-blue-600 text-slate-900 shadow-xs'
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
          )}

          {/* Bottom Actions and Stage Gating */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Special Button when on Question 4 (Stage 1 End) */}
            {currentIndex === 3 && !stage2Unlocked ? (
              <button
                id="btn-evaluate-stage-1"
                onClick={handleCheckStage1Gate}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Stage 1 & Unlock Stage 2</span>
              </button>
            ) : currentIndex < questions.length - 1 ? (
              <button
                onClick={() => {
                  if (currentIndex === 3 && !stage2Unlocked) {
                    handleCheckStage1Gate();
                  } else {
                    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
                  }
                }}
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
                <span>Submit & View Results</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* Stage 1 Gate Result Modal (Pass / Fail notification) */}
      {showStageGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            {stage1Passed ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Stage 1 Passed! ({stage1ScoreDetails?.pct}%)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Great work! You scored <strong className="text-slate-900">{stage1ScoreDetails?.correct} / {stage1ScoreDetails?.total}</strong> on the initial MCQs, surpassing the 50% qualifying threshold.
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    Stage 2 is now unlocked! Proceed to complete 6 advanced questions, including 3 live code implementation challenges.
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    id="btn-proceed-stage-2"
                    onClick={handleProceedToStage2}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Stage 2 (Questions 5–10)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Stage 1 Score: {stage1ScoreDetails?.pct}% (Below 50%)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You answered <strong className="text-slate-900">{stage1ScoreDetails?.correct} / {stage1ScoreDetails?.total}</strong> correctly. To unlock Stage 2, a score of at least 50% is required.
                  </p>
                  <p className="text-xs text-slate-500">
                    You may review and adjust your Stage 1 answers, or submit now to view your full diagnostic report.
                  </p>
                </div>
                <div className="flex items-center justify-between space-x-3 pt-2">
                  <button
                    onClick={() => {
                      setShowStageGateModal(false);
                      setCurrentIndex(0);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    Review Stage 1 Answers
                  </button>
                  <button
                    onClick={handleSubmitTest}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
                  >
                    Submit Test Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Submit Assessment Test?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have completed <strong className="text-slate-900">{totalAnsweredCount}</strong> out of <strong className="text-slate-900">{questions.length}</strong> items.
              Once submitted, our AI Lead Examiner will grade your MCQs and code outputs to generate an in-depth score report.
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
                    <span>Grading Assessment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Yes, Submit & View Results</span>
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
