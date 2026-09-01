// Safe JavaScript / TypeScript execution engine for browser sandboxed code execution
import { TestCase } from '../types';

export interface CodeExecutionResult {
  passed: boolean;
  passedTests: number;
  totalTests: number;
  logs: string[];
  testResults: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }[];
  runtimeError?: string;
}

/**
 * Executes candidate's JavaScript/TypeScript code against provided test cases in a sandboxed Function environment.
 */
export function executeCodeAgainstTestCases(
  userCode: string,
  testCases: TestCase[]
): CodeExecutionResult {
  const logs: string[] = [];
  const testResults: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }[] = [];

  if (!testCases || testCases.length === 0) {
    return {
      passed: true,
      passedTests: 0,
      totalTests: 0,
      logs: ['No automated test cases configured.'],
      testResults: [],
    };
  }

  // Intercept console.log safely
  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: any[]) => {
      logs.push('[Error] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    warn: (...args: any[]) => {
      logs.push('[Warn] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
  };

  try {
    // Strip typescript type annotations in a basic safe manner if any
    let cleanedCode = userCode
      .replace(/:\s*(string|number|boolean|any|void|string\[\]|number\[\]|Record<[^>]+>)/g, '')
      .trim();

    // Prepare runner wrapper
    // We execute the user code inside a sandbox scope that extracts the primary function
    const wrappedCode = `
      "use strict";
      const console = arguments[0];
      ${cleanedCode}
      
      // Look for candidate declared function or exported identifier
      return (typeof solution === 'function' ? solution : 
             typeof solve === 'function' ? solve : 
             typeof main === 'function' ? main : 
             typeof twoSum === 'function' ? twoSum :
             typeof reverseString === 'function' ? reverseString :
             typeof isPalindrome === 'function' ? isPalindrome :
             typeof maxSubArray === 'function' ? maxSubArray :
             typeof isValid === 'function' ? isValid :
             typeof fib === 'function' ? fib :
             typeof flattenArray === 'function' ? flattenArray :
             typeof debounce === 'function' ? debounce :
             typeof deepClone === 'function' ? deepClone :
             typeof groupAnagrams === 'function' ? groupAnagrams :
             null);
    `;

    // Construct the evaluator function
    const runner = new Function(wrappedCode);
    const candidateFunc = runner(customConsole);

    if (typeof candidateFunc !== 'function') {
      return {
        passed: false,
        passedTests: 0,
        totalTests: testCases.length,
        logs,
        testResults: testCases.map(tc => ({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: 'Function Not Found',
          passed: false,
          error: 'Could not find a callable function (e.g. `function solution(...)` or `function solve(...)`). Ensure your solution defines a function.',
        })),
        runtimeError: 'No callable entry function detected in submission.',
      };
    }

    let passedCount = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      let actualOutputStr = '';
      let isTestCasePassed = false;
      let testError: string | undefined = undefined;

      try {
        // Parse arguments from test case input string (e.g. "[2, 7, 11, 15], 9" or "'racecar'")
        let parsedArgs: any[];
        try {
          // Try evaluating input as argument tuple
          const argParser = new Function(`return [${tc.input}];`);
          parsedArgs = argParser();
        } catch (e) {
          // If parsing as list fails, pass as single string or raw value
          parsedArgs = [tc.input];
        }

        // Call the candidate function
        const rawResult = candidateFunc(...parsedArgs);
        actualOutputStr = normalizeOutput(rawResult);

        const normalizedExpected = normalizeExpected(tc.expectedOutput);
        isTestCasePassed = actualOutputStr === normalizedExpected;

        if (isTestCasePassed) {
          passedCount++;
        }
      } catch (err: any) {
        testError = err.message || String(err);
        actualOutputStr = `Runtime Error: ${testError}`;
        isTestCasePassed = false;
      }

      testResults.push({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: actualOutputStr,
        passed: isTestCasePassed,
        error: testError,
      });
    }

    return {
      passed: passedCount === testCases.length,
      passedTests: passedCount,
      totalTests: testCases.length,
      logs,
      testResults,
    };
  } catch (outerErr: any) {
    return {
      passed: false,
      passedTests: 0,
      totalTests: testCases.length,
      logs,
      testResults: testCases.map(tc => ({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: 'Compilation / Syntax Error',
        passed: false,
        error: outerErr.message || String(outerErr),
      })),
      runtimeError: outerErr.message || 'Syntax or evaluation error in code.',
    };
  }
}

function normalizeOutput(val: any): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

function normalizeExpected(valStr: string): string {
  const trimmed = valStr.trim();
  try {
    const parsed = JSON.parse(trimmed);
    return JSON.stringify(parsed);
  } catch {
    return trimmed;
  }
}
