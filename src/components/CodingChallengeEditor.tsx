import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Terminal, 
  Sparkles, 
  AlertTriangle,
  Code2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { PracticeQuestion, TestCase } from '../types';
import { executeCodeAgainstTestCases, CodeExecutionResult } from '../lib/codeRunner';

interface CodingChallengeEditorProps {
  question: PracticeQuestion;
  userCode: string;
  onChangeCode: (code: string) => void;
  onExecutionComplete: (result: CodeExecutionResult) => void;
  onPreventCopyPasteAlert?: () => void;
}

export const CodingChallengeEditor: React.FC<CodingChallengeEditorProps> = ({
  question,
  userCode,
  onChangeCode,
  onExecutionComplete,
  onPreventCopyPasteAlert,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<CodeExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'testcases' | 'console'>('testcases');
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);

  // Initialize code with starter code if empty
  useEffect(() => {
    if (!userCode && question.starterCode) {
      onChangeCode(question.starterCode);
    }
  }, [question.id, question.starterCode]);

  const handleRunCode = () => {
    setIsRunning(true);
    try {
      const result = executeCodeAgainstTestCases(
        userCode || question.starterCode || '',
        question.testCases || []
      );
      setLastResult(result);
      onExecutionComplete(result);
    } catch (e: any) {
      console.error('Execution failure', e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    if (question.starterCode) {
      onChangeCode(question.starterCode);
      setLastResult(null);
    }
  };

  // Block copy/paste with polite prompt
  const handleCopyPasteBlock = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (onPreventCopyPasteAlert) {
      onPreventCopyPasteAlert();
    }
  };

  const testCases = question.testCases || [];
  const currentTestCase = testCases[activeTestCaseIdx];

  return (
    <div className="space-y-4">
      
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-4 py-2.5 rounded-t-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-100">
            solution.js ({question.language || 'javascript'})
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono">
            Sandboxed Runner
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetCode}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1"
            title="Reset to starter template"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            id={`btn-run-code-${question.id}`}
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-emerald-950 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run & Validate Output</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Textarea with strictly enforced Anti-Cheat (Copy, Paste, Cut prevention) */}
      <div className="relative">
        <textarea
          id={`code-editor-${question.id}`}
          value={userCode}
          onChange={(e) => onChangeCode(e.target.value)}
          onCopy={handleCopyPasteBlock}
          onPaste={handleCopyPasteBlock}
          onCut={handleCopyPasteBlock}
          onContextMenu={(e) => e.preventDefault()}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full h-72 p-4 bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed rounded-b-2xl border border-t-0 border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y selection:bg-emerald-900 selection:text-white"
          placeholder="// Type your code here. Note: Copy-paste is disabled for assessment integrity."
        />
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="text-[10px] text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            Copy-Paste Disabled 🔒
          </span>
        </div>
      </div>

      {/* Test Case & Output Execution Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-3">
        
        {/* Tab Strip */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('testcases')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'testcases'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Cases ({testCases.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                activeTab === 'console'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Execution Output & Logs</span>
              {lastResult && (
                <span className={`w-2 h-2 rounded-full ${lastResult.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              )}
            </button>
          </div>

          {lastResult && (
            <div className="flex items-center space-x-1.5">
              {lastResult.passed ? (
                <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Passed ({lastResult.passedTests}/{lastResult.totalTests})</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-rose-400 font-bold text-xs bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/60">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{lastResult.passedTests}/{lastResult.totalTests} Passed</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tab Content 1: Test Cases */}
        {activeTab === 'testcases' && (
          <div className="space-y-3">
            {/* Case selector pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {testCases.map((tc, idx) => {
                const tcResult = lastResult?.testResults?.[idx];
                const hasRun = !!tcResult;
                const isPassed = tcResult?.passed;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTestCaseIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition-all ${
                      activeTestCaseIdx === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Case {idx + 1}</span>
                    {hasRun && (
                      isPassed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-400" />
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {currentTestCase && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
                {currentTestCase.description && (
                  <div className="text-slate-400 italic text-[11px]">
                    Scenario: {currentTestCase.description}
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Input Arguments:</span>
                  <div className="bg-slate-900 px-3 py-1.5 rounded-lg text-amber-300 font-mono">
                    {currentTestCase.input}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Expected Output:</span>
                  <div className="bg-slate-900 px-3 py-1.5 rounded-lg text-emerald-300 font-mono">
                    {currentTestCase.expectedOutput}
                  </div>
                </div>

                {lastResult?.testResults?.[activeTestCaseIdx] && (
                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Your Actual Output:</span>
                    <div className={`px-3 py-1.5 rounded-lg font-mono ${
                      lastResult.testResults[activeTestCaseIdx].passed
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    }`}>
                      {lastResult.testResults[activeTestCaseIdx].actual}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Execution Logs & System Output */}
        {activeTab === 'console' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 max-h-48 overflow-y-auto">
            {lastResult?.runtimeError && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                <strong>Runtime Error:</strong> {lastResult.runtimeError}
              </div>
            )}
            
            {lastResult && lastResult.logs.length > 0 ? (
              <div className="space-y-1 text-slate-300">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stdout Logs:</span>
                {lastResult.logs.map((log, i) => (
                  <div key={i} className="text-slate-300 font-mono text-xs">
                    &gt; {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-xs py-2">
                Click &quot;Run &amp; Validate Output&quot; above to execute and see console output and assertions.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
