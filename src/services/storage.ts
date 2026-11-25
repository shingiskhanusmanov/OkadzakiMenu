import type {
  LeaderboardEntry,
  TestAttempt,
  User,
} from "../types";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

interface UserRow {
  id: string;
  nickname: string;
  created_at: string;
}

interface AttemptRow {
  id: string;
  user_id: string;
  user_nickname: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
  started_at: string;
  completed_at: string;
  answers: TestAttempt["answers"];
}

export interface UserStats {
  testsTaken: number;
  averageScore: number;
  bestScore: number;
  bestPercentage: number;
  averageTimeSecs: number;
}

const localUsersKey = "okadzaki.training-users";
const localAttemptsKey = "okadzaki.test-attempts";

const readLocalUsers = (): User[] => {
  const value = localStorage.getItem(localUsersKey);
  return value ? (JSON.parse(value) as User[]) : [];
};

const readLocalAttempts = (): TestAttempt[] => {
  const value = localStorage.getItem(localAttemptsKey);
  return value ? (JSON.parse(value) as TestAttempt[]) : [];
};

const writeLocalAttempts = (attempts: TestAttempt[]): void => {
  localStorage.setItem(localAttemptsKey, JSON.stringify(attempts));
};

const toUser = (row: UserRow): User => ({
  id: row.id,
  nickname: row.nickname,
  createdAt: row.created_at,
});

const toAttempt = (row: AttemptRow): TestAttempt => ({
  id: row.id,
  userId: row.user_id,
  userNickname: row.user_nickname,
  score: row.score,
  totalQuestions: row.total_questions,
  percentage: row.percentage,
  timeTakenSeconds: row.time_taken_seconds,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  answers: row.answers,
});

export const getOrCreateUser = async (nickname: string): Promise<User> => {
  if (!isSupabaseConfigured()) {
    const normalized = nickname.trim();
    const users = readLocalUsers();
    const existing = users.find(
      (user) => user.nickname.toLowerCase() === normalized.toLowerCase(),
    );
    if (existing) return existing;

    const user: User = {
      id: crypto.randomUUID(),
      nickname: normalized,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(localUsersKey, JSON.stringify([...users, user]));
    return user;
  }

  const { data, error } = await getSupabaseClient().rpc(
    "get_or_create_training_user",
    { p_nickname: nickname.trim() },
  );

  if (error) throw new Error(`Could not load the user: ${error.message}`);

  const user = (data as UserRow[] | null)?.[0];
  if (!user) throw new Error("The server did not return a user record.");
  return toUser(user);
};

export const saveTestAttempt = async (
  attempt: TestAttempt,
): Promise<void> => {
  if (!isSupabaseConfigured()) {
    const attempts = readLocalAttempts();
    if (!attempts.some((item) => item.id === attempt.id)) {
      writeLocalAttempts([attempt, ...attempts]);
    }
    return;
  }

  const supabase = getSupabaseClient();
  const { data: existing, error: lookupError } = await supabase
    .from("test_attempts")
    .select("user_id")
    .eq("id", attempt.id)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Could not verify the test result: ${lookupError.message}`);
  }
  if (existing) {
    if (existing.user_id !== attempt.userId) {
      throw new Error("This test result ID already belongs to another user.");
    }
    return;
  }

  const { error } = await supabase.from("test_attempts").insert({
    id: attempt.id,
    user_id: attempt.userId,
    user_nickname: attempt.userNickname,
    score: attempt.score,
    total_questions: attempt.totalQuestions,
    percentage: attempt.percentage,
    time_taken_seconds: attempt.timeTakenSeconds,
    started_at: attempt.startedAt,
    completed_at: attempt.completedAt,
    answers: attempt.answers,
  });

  if (error) {
    if (error.code === "23505") {
      const { data: duplicate, error: duplicateLookupError } = await supabase
        .from("test_attempts")
        .select("user_id")
        .eq("id", attempt.id)
        .maybeSingle();

      if (!duplicateLookupError && duplicate?.user_id === attempt.userId) return;
    }
    throw new Error(`Could not save the test result: ${error.message}`);
  }
};

export const getAttemptsByUser = async (
  userId: string,
): Promise<TestAttempt[]> => {
  if (!isSupabaseConfigured()) {
    return readLocalAttempts()
      .filter((attempt) => attempt.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime(),
      );
  }

  const { data, error } = await getSupabaseClient()
    .from("test_attempts")
    .select(
      "id,user_id,user_nickname,score,total_questions,percentage,time_taken_seconds,started_at,completed_at,answers",
    )
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) throw new Error(`Could not load your test history: ${error.message}`);
  return (data as AttemptRow[]).map(toAttempt);
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  if (!isSupabaseConfigured()) {
    const users = readLocalUsers();
    const attempts = readLocalAttempts();

    return users
      .map((user) => {
        const userAttempts = attempts.filter(
          (attempt) => attempt.userId === user.id,
        );
        if (userAttempts.length === 0) return undefined;

        const best = userAttempts.reduce((current, attempt) =>
          attempt.percentage > current.percentage ||
          (attempt.percentage === current.percentage &&
            attempt.timeTakenSeconds < current.timeTakenSeconds)
            ? attempt
            : current,
        );

        return {
          userId: user.id,
          nickname: user.nickname,
          bestScore: best.score,
          bestPercentage: best.percentage,
          testsTaken: userAttempts.length,
          bestTimeTakenSeconds: best.timeTakenSeconds,
        };
      })
      .filter((entry): entry is LeaderboardEntry => Boolean(entry))
      .sort(
        (a, b) =>
          b.bestPercentage - a.bestPercentage ||
          a.bestTimeTakenSeconds - b.bestTimeTakenSeconds,
      )
      .slice(0, 20);
  }

  const { data, error } = await getSupabaseClient().rpc(
    "get_training_leaderboard",
  );

  if (error) throw new Error(`Could not load the leaderboard: ${error.message}`);
  return (data as {
    user_id: string;
    nickname: string;
    best_score: number;
    best_percentage: number;
    tests_taken: number;
    best_time_taken_seconds: number;
  }[]).map((entry) => ({
    userId: entry.user_id,
    nickname: entry.nickname,
    bestScore: entry.best_score,
    bestPercentage: entry.best_percentage,
    testsTaken: entry.tests_taken,
    bestTimeTakenSeconds: entry.best_time_taken_seconds,
  }));
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  const attempts = await getAttemptsByUser(userId);

  if (attempts.length === 0) {
    return {
      testsTaken: 0,
      averageScore: 0,
      bestScore: 0,
      bestPercentage: 0,
      averageTimeSecs: 0,
    };
  }

  const best = attempts.reduce((currentBest, attempt) =>
    attempt.percentage > currentBest.percentage ? attempt : currentBest,
  );

  return {
    testsTaken: attempts.length,
    averageScore: Math.round(
      attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
        attempts.length,
    ),
    bestScore: best.score,
    bestPercentage: best.percentage,
    averageTimeSecs: Math.round(
      attempts.reduce((sum, attempt) => sum + attempt.timeTakenSeconds, 0) /
        attempts.length,
    ),
  };
};

export const subscribeToLeaderboard = (
  onUpdate: () => void,
): (() => void) => {
  if (!isSupabaseConfigured()) {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key === localAttemptsKey) onUpdate();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }

  const channel = getSupabaseClient()
    .channel("leaderboard-test-attempts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "test_attempts" },
      onUpdate,
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        console.error("Leaderboard realtime connection failed.", error);
      }
    });

  return () => {
    void getSupabaseClient().removeChannel(channel);
  };
};
