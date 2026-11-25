// ============================================
// MENU DATA TYPES
// ============================================

export type RollCategory = 'classic' | 'baked' | 'tempura' | 'special';

export interface MenuItem {
  id: string;
  name: string;
  category: RollCategory;
  ingredients: string[];
  description?: string;
  imageUrl?: string;
  allergens?: string[];
}

export interface SetItem {
  id: string;
  name: string;
  rolls: { rollId: string; quantity: number }[];
  totalPieces: number;
  price?: number;
  description?: string;
}

// ============================================
// QUIZ TYPES
// ============================================

export type QuestionType = 'multiple-choice' | 'multiple-select' | 'true-false';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | string[]; // string for single, string[] for multiple-select
  explanation?: string;
  category?: 'rolls' | 'sets' | 'ingredients' | 'general';
}

export interface QuizConfig {
  totalQuestions: number;
  timeLimitSeconds: number;
}

// ============================================
// USER & TEST TYPES
// ============================================

export interface User {
  id: string;
  nickname: string;
  createdAt: string;
}

export interface Answer {
  questionId: string;
  questionText: string;
  selectedAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  options: string[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  userNickname: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
  startedAt: string;
  completedAt: string;
  answers: Answer[];
}

// ============================================
// LEADERBOARD
// ============================================

export interface LeaderboardEntry {
  userId: string;
  nickname: string;
  bestScore: number;
  bestPercentage: number;
  testsTaken: number;
  bestTimeTakenSeconds: number;
}

// ============================================
// APP STATE
// ============================================

export interface QuizState {
  currentQuestionIndex: number;
  answers: Map<string, string | string[]>;
  startedAt: string;
  questions: Question[];
}
