import type { Question, Answer, TestAttempt } from "../types";
import { questionsBank } from "../data/questionBank";
import { QUIZ_CONFIG } from "../data/questionsData";

// Shuffle array in place (Fisher-Yates)
export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Pick N random questions from bank, shuffle answers
export const pickQuestions = (
  count: number = QUIZ_CONFIG.totalQuestions,
): Question[] => {
  const shuffled = shuffle(questionsBank);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q) => ({
    ...q,
    options: shuffle(q.options),
  }));
};

// Check if an answer is correct
export const checkAnswer = (
  question: Question,
  selectedAnswer: string | string[],
): boolean => {
  if (Array.isArray(question.correctAnswer)) {
    if (!Array.isArray(selectedAnswer)) return false;
    const correct = [...question.correctAnswer].sort();
    const selected = [...selectedAnswer].sort();
    return JSON.stringify(correct) === JSON.stringify(selected);
  }
  return selectedAnswer === question.correctAnswer;
};

// Build answer records from user selections
export const buildAnswers = (
  questions: Question[],
  userSelections: Map<string, string | string[]>,
): Answer[] => {
  return questions.map((q) => {
    const selected = userSelections.get(q.id) ?? "";
    const isCorrect = checkAnswer(q, selected);
    return {
      questionId: q.id,
      questionText: q.text,
      selectedAnswer: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      options: q.options,
    };
  });
};

// Calculate score from answers
export const calculateScore = (
  answers: Answer[],
): { score: number; percentage: number } => {
  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / answers.length) * 100);
  return { score, percentage };
};

// Build a full test attempt object
export const buildTestAttempt = (params: {
  userId: string;
  userNickname: string;
  questions: Question[];
  userSelections: Map<string, string | string[]>;
  startedAt: string;
}): TestAttempt => {
  const { userId, userNickname, questions, userSelections, startedAt } = params;
  const completedAt = new Date().toISOString();
  const timeTakenSeconds = Math.round(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  );

  const answers = buildAnswers(questions, userSelections);
  const { score, percentage } = calculateScore(answers);

  return {
    id: `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    userNickname,
    score,
    totalQuestions: questions.length,
    percentage,
    timeTakenSeconds,
    startedAt,
    completedAt,
    answers,
  };
};

// Format seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// Format seconds to human-readable (e.g. "7:32")
export const formatTimePretty = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// Format date to Russian locale
export const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
