import { PracticeQuestion } from '../types';

export const DEFAULT_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // STAGE 1: 4 Multiple Choice Questions
  {
    id: 'q-mcq-1',
    stage: 1,
    type: 'mcq',
    category: 'React & Frontend Architecture',
    question: 'In React 18, why does React StrictMode intentionally double-invoke component render and effect hooks during development mode?',
    codeSnippet: `function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchUserData(userId).then(setData);
  }, [userId]);
  return <div>{data?.name}</div>;
}`,
    options: [
      'To verify state setter idempotence and ensure cleanup logic prevents memory leaks upon remounting.',
      'It is an unpatched bug in the Vite development bundling server.',
      'To balance the Virtual DOM diff computation across two background Web Workers.',
      'Because state updates in React 18 are fully synchronous and trigger isolated rendering threads.',
    ],
    correctOptionIndex: 0,
    expectedKeywords: ['StrictMode', 'Idempotence', 'Cleanup', 'Remounting'],
    difficulty: 'Medium',
    points: 10,
    explanation: 'React 18 StrictMode mounts, unmounts, and remounts components in dev mode to flush out missing useEffect cleanup functions and detect impure side effects during render.',
  },
  {
    id: 'q-mcq-2',
    stage: 1,
    type: 'mcq',
    category: 'Node.js & Concurrency',
    question: 'What happens to incoming HTTP requests in a Node.js Express server when a synchronous CPU-bound cryptographic hash operation is executed in a route handler?',
    codeSnippet: `app.get('/hash', (req, res) => {
  // Heavy synchronous calculation:
  const hash = crypto.pbkdf2Sync(req.query.pass, 'salt', 500000, 64, 'sha512');
  res.send(hash.toString('hex'));
});`,
    options: [
      'Express automatically schedules each route execution onto an isolated OS thread from a threadpool.',
      'It blocks Node.js single-threaded Event Loop, preventing all other concurrent HTTP requests from progressing until complete.',
      'The V8 engine pauses only the calling client socket, leaving the event loop free for other clients.',
      'Node.js delegates synchronous cryptographic loops to the GPU automatically.',
    ],
    correctOptionIndex: 1,
    expectedKeywords: ['Event Loop', 'Single Threaded', 'Blocking', 'CPU Bound'],
    difficulty: 'Medium',
    points: 10,
    explanation: 'Node.js executes JavaScript on a single thread. Heavy synchronous CPU tasks freeze the Event Loop, blocking all incoming I/O and concurrent client connections.',
  },
  {
    id: 'q-mcq-3',
    stage: 1,
    type: 'mcq',
    category: 'Database & Indexing',
    question: 'Which index structure provides the lowest query latency for a high-traffic SQL query with `WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC`?',
    options: [
      'A composite B-Tree index on (tenant_id, status, created_at DESC)',
      'Three separate single-column Hash indexes on tenant_id, status, and created_at',
      'A Full-Text Search (FTS) index on created_at',
      'Clustered primary key index on tenant_id only',
    ],
    correctOptionIndex: 0,
    expectedKeywords: ['Composite Index', 'B-Tree', 'Index order'],
    difficulty: 'Medium',
    points: 10,
    explanation: 'A composite B-Tree index covering (tenant_id, status, created_at DESC) allows the database engine to perform an index seek for equality filters and traverse leaf nodes directly in sorted order without an in-memory sorting pass.',
  },
  {
    id: 'q-mcq-4',
    stage: 1,
    type: 'mcq',
    category: 'Security & Web APIs',
    question: 'What primary web application vulnerability is neutralized by storing session JWT authentication tokens inside `HttpOnly` and `SameSite=Strict` cookies instead of `localStorage`?',
    options: [
      'Cross-Site Scripting (XSS) payload access to tokens via JavaScript document.cookie',
      'SQL Injection in database parameter bindings',
      'DDoS volumetric layer 7 attacks',
      'Cross-Origin Resource Sharing (CORS) preflight failures',
    ],
    correctOptionIndex: 0,
    expectedKeywords: ['XSS', 'HttpOnly', 'Cookie Security', 'Document.cookie'],
    difficulty: 'Easy',
    points: 10,
    explanation: 'The `HttpOnly` cookie attribute prevents client-side scripts from reading authentication tokens via document.cookie, mitigating credential theft if an XSS vulnerability exists in third-party scripts.',
  },

  // STAGE 2: 6 Questions (3 Coding Implementation Challenges + 3 Technical & System Scenarios)
  {
    id: 'q-code-5',
    stage: 2,
    type: 'code',
    category: 'Coding Implementation & Algorithms',
    question: 'Problem 1: Two Sum Target Indices. Write a function `twoSum(nums, target)` that returns the 0-based indices `[i, j]` of the two numbers in `nums` that add up to `target`. Each input has exactly one solution, and you may not use the same element twice. Aim for O(n) time complexity.',
    language: 'javascript',
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your O(n) solution here:
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      {
        input: '[2, 7, 11, 15], 9',
        expectedOutput: '[0,1]',
        description: 'Standard positive array target sum',
      },
      {
        input: '[3, 2, 4], 6',
        expectedOutput: '[1,2]',
        description: 'Non-sequential indices target sum',
      },
      {
        input: '[3, 3], 6',
        expectedOutput: '[0,1]',
        description: 'Duplicate values',
      },
      {
        input: '[-1, -2, -3, -4, -5], -8',
        expectedOutput: '[2,4]',
        description: 'Negative numbers array',
      },
    ],
    difficulty: 'Easy',
    points: 15,
    explanation: 'Using a Hash Map gives O(n) time complexity and O(n) space complexity by storing each number with its index and checking if the required complement has already been seen.',
  },
  {
    id: 'q-code-6',
    stage: 2,
    type: 'code',
    category: 'Coding Implementation & Strings',
    question: 'Problem 2: Valid Palindrome Checker. Write a function `isPalindrome(s)` that determines if a string is a palindrome after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters. Return `true` or `false`.',
    language: 'javascript',
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your code here:
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    testCases: [
      {
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        description: 'Complex sentence with spaces and punctuation',
      },
      {
        input: '"race a car"',
        expectedOutput: 'false',
        description: 'Non-palindrome phrase',
      },
      {
        input: '" "',
        expectedOutput: 'true',
        description: 'Empty string / whitespace only',
      },
      {
        input: '"0P"',
        expectedOutput: 'false',
        description: 'Alphanumeric mismatch',
      },
    ],
    difficulty: 'Easy',
    points: 15,
    explanation: 'Sanitize the string with regex or two-pointer character checks and verify bidirectional equality in O(n) time and O(1) extra space.',
  },
  {
    id: 'q-code-7',
    stage: 2,
    type: 'code',
    category: 'Coding Implementation & Utilities',
    question: 'Problem 3: Deep Array Flattener. Write a function `flattenArray(arr)` that takes an array containing nested arrays of arbitrary depth and returns a single flat array containing all elements in order. (Do not use built-in Array.prototype.flat).',
    language: 'javascript',
    starterCode: `/**
 * @param {any[]} arr
 * @return {any[]}
 */
function flattenArray(arr) {
  // Write your recursive or iterative flattening function:
  const result = [];
  function helper(items) {
    for (const item of items) {
      if (Array.isArray(item)) {
        helper(item);
      } else {
        result.push(item);
      }
    }
  }
  helper(arr);
  return result;
}`,
    testCases: [
      {
        input: '[1, [2, [3, [4]], 5]]',
        expectedOutput: '[1,2,3,4,5]',
        description: 'Multi-level nested integers',
      },
      {
        input: '[[1, 2], [3, 4], [5]]',
        expectedOutput: '[1,2,3,4,5]',
        description: '2D array list',
      },
      {
        input: '[]',
        expectedOutput: '[]',
        description: 'Empty array edge case',
      },
      {
        input: '["a", ["b", ["c", "d"]]]',
        expectedOutput: '["a","b","c","d"]',
        description: 'Nested string array',
      },
    ],
    difficulty: 'Medium',
    points: 15,
    explanation: 'Recursive traversal or a stack-based loop flattens elements of arbitrary depth into a linear array preserving order.',
  },
  {
    id: 'q-scenario-8',
    stage: 2,
    type: 'mcq',
    category: 'Distributed Systems & Microservices',
    question: 'In a microservices architecture, when a downstream payment service experiences intermittent latency spikes (timeouts), what pattern should be implemented on the API gateway to prevent cascading failures across the entire cluster?',
    options: [
      'Circuit Breaker pattern with a graceful fallback response',
      'Infinite retry loop with zero delay backoff',
      'Increasing the HTTP request timeout to 120 seconds for all clients',
      'Restarting all upstream microservices instances immediately',
    ],
    correctOptionIndex: 0,
    expectedKeywords: ['Circuit Breaker', 'Cascading failure', 'Graceful degradation'],
    difficulty: 'Medium',
    points: 10,
    explanation: 'The Circuit Breaker pattern trips open when failures or timeouts exceed a threshold, failing fast and returning a fallback without exhausting gateway thread pools or cascading failure upstream.',
  },
  {
    id: 'q-scenario-9',
    stage: 2,
    type: 'mcq',
    category: 'Data Structures & Algorithms',
    question: 'Which data structure allows both O(1) key lookup and O(1) eviction of the least recently used element when implementing an LRU Cache with a capacity constraint?',
    options: [
      'Hash Map combined with a Doubly Linked List',
      'Standard Binary Search Tree (BST)',
      'Array combined with Binary Search',
      'Max Heap Priority Queue',
    ],
    correctOptionIndex: 0,
    expectedKeywords: ['LRU Cache', 'Doubly Linked List', 'Hash Map', 'O(1)'],
    difficulty: 'Medium',
    points: 10,
    explanation: 'The Hash Map provides O(1) node lookup by key, while the Doubly Linked List enables O(1) removal and re-insertion of nodes at the head/tail upon access or eviction.',
  },
  {
    id: 'q-scenario-10',
    stage: 2,
    type: 'mcq',
    category: 'System Design & High Availability',
    question: 'According to the CAP theorem, in the event of a network partition (P) between distributed database replicas across two regions, what tradeoff must the system architecture make?',
    options: [
      'Choose between Consistency (rejecting stale writes/reads) or Availability (accepting writes that may diverge temporarily).',
      'The system automatically guarantees both Consistency and 100% Availability without tradeoff.',
      'The database must switch entirely to synchronous file system locks on a single machine.',
      'Network partitions can be eliminated entirely by upgrading router bandwidth.',
    ],
    correctOptionIndex: 0,
    expectedKeywords: ['CAP Theorem', 'Partition Tolerance', 'Consistency vs Availability'],
    difficulty: 'Medium',
    points: 10,
    explanation: 'When network partitions inevitably occur in distributed systems, a system can either prioritize Consistency (CP) by refusing requests that cannot be coordinated, or Availability (AP) by serving potentially stale responses.',
  },
];
