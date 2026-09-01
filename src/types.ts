export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roleTitle?: string;
  avatarUrl?: string;
  collegeOrCompany?: string;
  experienceLevel?: 'Entry Level / Fresher' | 'Junior (1-3 yrs)' | 'Mid-Senior (3-5+ yrs)' | 'Lead / Architect';
}

export interface JobRoleRecommendation {
  id: string;
  roleTitle: string;
  matchScore: number; // e.g. 92%
  category: string;
  experienceLevel: string;
  summary: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  interviewFocusTopics: string[];
  averageSalaryRange?: string;
  growthOutlook?: string;
}

export interface ResumeSuggestion {
  id: string;
  category: 'ATS & Keyword Optimization' | 'Impact & Quantifiable Metrics' | 'Skill Gap & Technology' | 'Project Presentation' | 'Career Strategy' | string;
  title: string;
  description: string;
  priority: 'High Priority' | 'Recommended' | 'Pro Tip' | string;
  actionItem: string;
  exampleBeforeAfter?: {
    before: string;
    after: string;
  };
}

export interface ResumeAnalysis {
  candidateName: string;
  email: string;
  phone: string;
  location?: string;
  linkedinOrGithub?: string;
  summary: string;
  education: {
    degree: string;
    institution: string;
    year: string;
    gpaOrGrade?: string;
    fieldOfStudy?: string;
  }[];
  workExperience: {
    title: string;
    company: string;
    duration: string;
    location?: string;
    highlights: string[];
  }[];
  technicalSkills: string[];
  softSkills: string[];
  toolsAndFrameworks: string[];
  certifications: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    outcomes?: string;
    liveUrlOrRepo?: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
  resumeSuggestions?: ResumeSuggestion[];
  recommendedJobRoles: JobRoleRecommendation[];
  rawText?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  isHidden?: boolean;
}

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'code' | 'scenario' | 'short_answer';
  category: string; // e.g. Technical Core, Data Structures & Algorithms, Coding Implementation, System Design
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctOptionIndex?: number;
  expectedKeywords?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  explanation?: string;
  // Coding challenge specific properties
  starterCode?: string;
  language?: string; // 'javascript' | 'python' | 'typescript'
  testCases?: TestCase[];
  solutionCode?: string;
  stage?: 1 | 2; // 1 for Stage 1 (MCQ 1-4), 2 for Stage 2 (Questions 5-10)
}

export interface PracticeUserAnswer {
  questionId: string;
  selectedOptionIndex?: number;
  textAnswer?: string;
  codeAnswer?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  outputLog?: string;
  timeSpentSeconds: number;
}

export interface PracticeQuestionResult {
  questionId: string;
  question: string;
  category: string;
  type: 'mcq' | 'code' | 'scenario' | 'short_answer';
  userAnswer: string;
  isCorrect: boolean;
  score: number; // 0 to points
  maxPoints: number;
  modelExplanation: string;
  keyTakeaway: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  codeExecutionDetails?: string;
}

export interface PracticeTestReport {
  id: string;
  candidateName: string;
  targetRole: string;
  totalScore: number; // percentage 0-100
  earnedPoints: number;
  maxPoints: number;
  accuracyRate: number;
  timeSpentSeconds: number;
  difficultyLevel: string;
  stage1Score?: {
    correctCount: number;
    totalCount: number;
    percentage: number;
    passed: boolean;
  };
  stage2Unlocked?: boolean;
  categoryBreakdown: {
    category: string;
    score: number;
    total: number;
    percentage: number;
  }[];
  results: PracticeQuestionResult[];
  strengths: string[];
  areasToReview: string[];
  recommendation: string;
  completedAt: string;
}

export interface InterviewQuestion {
  id: string;
  questionText: string;
  category: 'Introduction & Resume Overview' | 'Core Technical Competency' | 'Problem Solving & Architecture' | 'Behavioral & STAR Method' | 'Role-Specific Deep Dive';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimitSeconds: number;
  expectedKeyConcepts: string[];
  tipsForCandidate: string;
}

export interface SpokenAnswerRecord {
  questionId: string;
  questionText: string;
  category: string;
  transcript: string;
  timeSpentSeconds: number;
  fillerWordCounts: Record<string, number>;
  totalFillerWords: number;
  videoSnapshotBase64?: string;
  audioDurationSeconds: number;
}

export interface GrammarCorrection {
  originalSentence: string;
  suggestedImprovement: string;
  explanation: string;
}

export interface QuestionInterviewEvaluation {
  questionId: string;
  questionText: string;
  category: string;
  transcript: string;
  timeSpentSeconds: number;
  
  // Content, Relevance, and Marks Evaluation
  marksEarned?: number; // e.g. 23
  maxMarks?: number; // e.g. 25
  relevanceScore?: number; // 0 - 100%
  relevanceVerdict?: 'Highly Relevant & Technically Accurate' | 'Relevant with Minor Gaps' | 'Partially Relevant / Vague' | 'Irrelevant / Off-Topic / Insufficient';
  relevanceReasoning?: string;
  contentScore: number; // 0 - 100
  isAnswerCorrectAndRelevant: boolean;
  correctnessDetails: string;
  keyPointsCovered: string[];
  missedKeyPoints: string[];
  starMethodScore?: number; // 0 - 100 for behavioral questions
  
  // Grammar & Fluency
  grammarScore: number; // 0 - 100
  grammarIssues: GrammarCorrection[];
  fluencyAssessment: string;
  
  // Delivery & Word Usage
  wordCount: number;
  wordsPerMinute: number;
  fillerWordCounts: Record<string, number>;
  mostUsedWords: { word: string; count: number }[];
  
  // Model Answer
  idealModelAnswer: string;
  interviewerFeedback: string;
}

export interface DeliveryAssessment {
  overallConfidenceScore: number; // 0 - 100
  eyeContactAssessment: string;
  bodyLanguageAndPosture: string;
  speechClarityAndPace: string;
  pacingRating: 'Too Slow' | 'Optimal Pace' | 'Slightly Rushed' | 'Too Fast';
  averageWordsPerMinute: number;
}

export interface FinalInterviewReport {
  id: string;
  candidateName: string;
  targetRole: string;
  overallScore: number; // 0 - 100
  totalMarksEarned?: number; // e.g. 92
  totalMaxMarks?: number; // e.g. 100
  overallRelevanceScore?: number; // 0 - 100
  relevanceSummary?: string;
  hiringDecision: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Development';
  executiveSummary: string;
  
  // Overall Metrics
  grammarSummary: {
    overallGrammarScore: number;
    frequentErrors: GrammarCorrection[];
    vocabularyProficiency: string;
  };
  
  wordUsageSummary: {
    totalWordsSpoken: number;
    totalFillerWords: number;
    fillerWordsRatio: number; // percentage of fillers
    topCommonWords: { word: string; count: number }[];
    topFillerWords: { word: string; count: number }[];
    fillerWordImpact: 'Low (Clean speech)' | 'Moderate (Noticeable)' | 'High (Distracting)';
  };
  
  deliveryAssessment: DeliveryAssessment;
  
  // Proctoring & Sound Analysis Extensions
  proctorIntegrity?: {
    singleCandidateVerified: boolean;
    violationCount: number;
    integrityScore: number;
    statusMessage: string;
    details: string;
  };

  soundClarityAnalysis?: {
    overallClarityScore: number;
    averageDbLevel: number;
    vocalEnergy: string;
    backgroundNoiseLevel: 'Very Low / Studio Quality' | 'Moderate' | 'High';
    soundQualityNotes: string;
  };
  
  questionEvaluations: QuestionInterviewEvaluation[];
  
  topSuperpowerStrengths: string[];
  priorityActionItems: string[];
  studyRoadmap: string[];
  
  completedAt: string;
}

export type AppView = 'login' | 'upload_resume' | 'job_matching' | 'practice_test' | 'practice_report' | 'interview_session' | 'interview_report';
export type AppStep = AppView;
