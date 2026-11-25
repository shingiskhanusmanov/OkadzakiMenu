import "./style.css";
import { pickRandomQuestions } from "./data/questionBank";
import type { Answer, TestAttempt, User } from "./types";
import {
  getAttemptsByUser,
  getLeaderboard,
  getOrCreateUser,
  getUserStats,
  saveTestAttempt,
  subscribeToLeaderboard,
} from "./services/storage";

type View = "welcome" | "dashboard" | "quiz" | "results" | "leaderboard"; // Here app defines its screen names

const app = document.querySelector<HTMLDivElement>("#app")!;
const publicAsset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path}`;
const totalQuestions = 20;
const quizDuration = 5 * 60;
let view: View = "welcome"; // remembers which screen is showing
let user: User | undefined; // this part holds signed-in user or undefined if nobody signed in
let activeAttempt: TestAttempt | undefined;
let currentQuestion = 0;
let selections: Record<string, string> = {};
let quizStartedAt = "";
let secondsLeft = quizDuration;
let timerId: number | undefined;
let quizQuestions = pickRandomQuestions(totalQuestions);
let stopLeaderboardSubscription: (() => void) | undefined;
let leaderboardLoadId = 0;

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character,
  );

const formatTime = (seconds: number): string =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; //formatTime Converts seconds into a two-digit MM:SS string. For example, 125 seconds becomes 02:05.
const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(
    new Date(date),
  );
const icon = (name: string): string =>
  `<span class="icon icon-${name}" aria-hidden="true"></span>`;

function logo(): string {
  return `<div class="brand" aria-label="Okadzaki"><img class="brand-logo" src="${publicAsset("unnamed.webp")}" alt="Okadzaki mascot"><span><strong>okadzaki</strong><small>ОБУЧЕНИЕ КОМАНДЫ</small></span></div>`;
}

function shell(content: string): string {
  const signedIn = Boolean(user);
  return `<div class="app-shell">
    <header class="topbar">${logo()}${signedIn ? `<nav>${navButton("dashboard", "Обзор", "grid")} ${navButton("leaderboard", "Рейтинг", "chart")}</nav><div class="topbar-user"><span class="user-dot">${escapeHtml(user!.nickname.slice(0, 1).toUpperCase())}</span><span>${escapeHtml(user!.nickname)}</span><button class="icon-button" data-action="logout" title="Выйти">${icon("logout")}</button></div>` : ""}</header>
    <main class="page">${content}</main>
    <footer class="footer"><span>okadzaki / алматы</span><span>Внутреннее обучение команды</span></footer>
  </div>`;
}

function navButton(target: View, label: string, iconName: string): string {
  return `<button class="nav-button ${view === target ? "active" : ""}" data-view="${target}">${icon(iconName)}${label}</button>`;
}

function renderWelcome(): void {
  stopLeaderboardSubscription?.();
  stopLeaderboardSubscription = undefined;
  app.innerHTML = `<div class="welcome-shell"><div class="welcome-art"><div class="developer-credit"><img src="${publicAsset("photo_2026-10-10_22-22-18.jpg")}" alt="Разработчик"><span>Разработчик</span></div><div class="art-ring ring-one"></div><div class="art-ring ring-two"></div><div class="art-copy"><span class="eyebrow">Алматы · обучение команды</span><h1>Знай меню.<br><em>Уверенно встречай гостей.</em></h1><p>Тренировочное пространство команды Okadzaki. Запоминай роллы, сеты и важные детали меню.</p><div class="art-note"><span class="note-line"></span><span>Для команды ресторана</span></div></div></div><section class="welcome-panel"><div>${logo()}<span class="panel-kicker">Обучение команды / 01</span><h2>Готовы к короткой<br><em>проверке меню?</em></h2><p class="muted">20 случайных вопросов, 5 минут и полезный разбор результата.</p><form id="login-form"><label for="nickname">Ваш никнейм</label><input id="nickname" name="nickname" autocomplete="nickname" placeholder="Например, Шынгысхан" maxlength="32" required><button class="primary-button" type="submit">Начать тест ${icon("arrow")}</button><p class="form-error" id="form-error"></p></form><div class="welcome-meta"><span>20 вопросов</span><span>5 минут</span><span>Синхронизация результатов</span></div></div></section></div>`;
  document
    .querySelector<HTMLFormElement>("#login-form")!
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.querySelector<HTMLInputElement>("#nickname")!;
      const nickname = input.value.trim();
      if (!nickname) {
        document.querySelector("#form-error")!.textContent =
          "Введите никнейм, чтобы продолжить.";
        input.focus();
        return;
      }
      const submit = document.querySelector<HTMLButtonElement>(
        '#login-form button[type="submit"]',
      )!;
      submit.disabled = true;
      try {
        user = await getOrCreateUser(nickname);
        await renderDashboard();
      } catch (error) {
        document.querySelector("#form-error")!.textContent =
          error instanceof Error ? error.message : "Не удалось подключиться к базе.";
      } finally {
        submit.disabled = false;
      }
    });
}

async function renderDashboard(): Promise<void> {
  view = "dashboard";
  stopLeaderboardSubscription?.();
  stopLeaderboardSubscription = undefined;
  app.innerHTML = shell('<p class="muted">Загружаем ваши результаты...</p>');
  const currentUser = user!;
  try {
  const [stats, userAttempts] = await Promise.all([
    getUserStats(currentUser.id),
    getAttemptsByUser(currentUser.id),
  ]);
  if (view !== "dashboard" || user !== currentUser) return;
  const attempts = userAttempts.slice(0, 4);
  app.innerHTML = shell(
    `<section class="page-heading"><div><span class="eyebrow">${formatDate(new Date().toISOString())} / личный обзор</span><h1>Рады вас видеть,<br><em>${escapeHtml(user!.nickname)}.</em></h1><p class="muted">Знание деталей помогает уверенно отвечать гостям.</p></div><button class="primary-button" data-action="new-test">Новый тест ${icon("arrow")}</button></section><section class="stat-grid"><div class="stat-card stat-feature"><span class="stat-label">Лучший результат</span><strong>${stats.bestPercentage || "--"}<small>%</small></strong><span class="stat-trend">${stats.testsTaken ? "Ваш личный рекорд" : "Пройдите первый тест"}</span></div><div class="stat-card"><span class="stat-label">Тестов пройдено</span><strong>${stats.testsTaken}</strong><span class="stat-trend">${stats.testsTaken ? "Продолжайте практику" : "Пока нет попыток"}</span></div><div class="stat-card"><span class="stat-label">Средний результат</span><strong>${stats.averageScore || "--"}<small>%</small></strong><span class="stat-trend">По всем попыткам</span></div><div class="stat-card"><span class="stat-label">Среднее время</span><strong>${stats.averageTimeSecs ? formatTime(stats.averageTimeSecs) : "--"}</strong><span class="stat-trend">За один тест</span></div></section><section class="dashboard-grid"><div class="panel history-panel"><div class="panel-heading"><div><span class="eyebrow">Ваш прогресс</span><h2>Последние тесты</h2></div><button class="text-button" data-view="leaderboard">Открыть рейтинг ${icon("arrow")}</button></div>${attempts.length ? `<div class="history-list">${attempts.map((attempt) => `<button class="history-row" data-attempt-id="${attempt.id}"><span class="history-date">${formatDate(attempt.completedAt)}</span><span class="history-score">${attempt.score}<small>/${attempt.totalQuestions}</small></span><span class="history-bar"><i style="width:${attempt.percentage}%"></i></span><span class="history-percent">${attempt.percentage}%</span>${icon("chevron")}</button>`).join("")}</div>` : `<div class="empty-state"><span class="empty-icon">+</span><h3>Первый тест уже ждёт.</h3><p>Пройдите тест, чтобы увидеть результат и историю обучения.</p></div>`}</div><aside class="panel focus-panel"><span class="eyebrow">Фокус обучения</span><h2>Знайте то,<br><em>что подаёте.</em></h2><p>Повторяйте знания через новые тесты, чтобы уверенно отвечать гостям.</p><button class="primary-button" data-action="new-test">Начать тест ${icon("arrow")}</button><div class="focus-foot"><span>400 вопросов</span><span>5 минут</span></div></aside></section>`,
  );
  bindShellEvents();
  } catch (error) {
    if (view !== "dashboard") return;
    app.innerHTML = shell(
      `<section class="panel empty-state" role="alert"><h3>Не удалось загрузить данные</h3><p>${escapeHtml(error instanceof Error ? error.message : "Неизвестная ошибка")}</p></section>`,
    );
    bindShellEvents();
  }
}

function renderQuiz(): void {
  view = "quiz";
  stopLeaderboardSubscription?.();
  stopLeaderboardSubscription = undefined;
  const question = quizQuestions[currentQuestion];
  const selected = selections[question.id];
  app.innerHTML = shell(
    `<section class="quiz-top"><div><span class="eyebrow">Текущий тест / ${escapeHtml(user!.nickname)}</span><h1>Проверка знания меню</h1></div><div class="timer ${secondsLeft < 60 ? "urgent" : ""}">${icon("clock")}<span id="timer">${formatTime(secondsLeft)}</span></div></section><div class="quiz-progress"><span>Вопрос ${currentQuestion + 1} <small>/ ${quizQuestions.length}</small></span><div class="progress-track"><i style="width:${((currentQuestion + 1) / quizQuestions.length) * 100}%"></i></div><span>${Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span></div><section class="question-layout"><div class="question-number">0${currentQuestion + 1}</div><div class="question-content"><span class="question-type">${question.type === "true-false" ? "Правда или ложь" : "Выберите один ответ"}</span><h2>${escapeHtml(question.text)}</h2><div class="answer-list">${question.options.map((option, index) => `<button class="answer-button ${selected === option ? "selected" : ""}" data-answer="${escapeHtml(option)}"><span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span>${selected === option ? icon("check") : ""}</button>`).join("")}</div><div class="quiz-actions"><button class="text-button" data-action="quit-quiz">Выйти из теста</button><button class="primary-button" data-action="next" ${selected ? "" : "disabled"}>${currentQuestion === quizQuestions.length - 1 ? "Завершить тест" : "Следующий вопрос"} ${icon("arrow")}</button></div></div></section>`,
  );
  bindShellEvents();
  document
    .querySelectorAll<HTMLButtonElement>("[data-answer]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        selections[question.id] = button.dataset.answer || "";
        renderQuiz();
      }),
    );
  if (timerId === undefined)
    timerId = window.setInterval(() => {
      secondsLeft -= 1;
      const timer = document.querySelector("#timer");
      if (timer) timer.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 0) void finishQuiz();
    }, 1000);
}

async function finishQuiz(): Promise<void> {
  if (timerId !== undefined) window.clearInterval(timerId);
  timerId = undefined;
  const answers: Answer[] = quizQuestions.map((question) => ({
    questionId: question.id,
    questionText: question.text,
    selectedAnswer: selections[question.id] || "No answer",
    correctAnswer: question.correctAnswer,
    isCorrect: selections[question.id] === question.correctAnswer,
    options: question.options,
  }));
  const score = answers.filter((answer) => answer.isCorrect).length;
  activeAttempt = {
    id: `attempt_${Date.now()}`,
    userId: user!.id,
    userNickname: user!.nickname,
    score,
    totalQuestions: quizQuestions.length,
    percentage: Math.round((score / quizQuestions.length) * 100),
    timeTakenSeconds: quizDuration - secondsLeft,
    startedAt: quizStartedAt,
    completedAt: new Date().toISOString(),
    answers,
  };
  await persistActiveAttempt();
}

async function persistActiveAttempt(): Promise<void> {
  if (!activeAttempt) return;
  try {
    await saveTestAttempt(activeAttempt);
    view = "results";
    renderResults();
  } catch (error) {
    app.innerHTML = shell(
      `<section class="panel empty-state" role="alert"><h3>Не удалось сохранить результат</h3><p>${escapeHtml(error instanceof Error ? error.message : "Неизвестная ошибка")}</p><button class="primary-button" data-action="retry-save">Повторить сохранение</button></section>`,
    );
    bindShellEvents();
  }
}

function renderResults(): void {
  stopLeaderboardSubscription?.();
  stopLeaderboardSubscription = undefined;
  const attempt = activeAttempt!;
  app.innerHTML = shell(
    `<section class="results-hero"><div><span class="eyebrow">Тест завершён / ${formatDate(attempt.completedAt)}</span><h1>Отличная работа,<br><em>${escapeHtml(attempt.userNickname)}.</em></h1><p class="muted">Каждая попытка помогает увереннее отвечать гостям.</p></div><div class="score-ring" style="--score:${attempt.percentage * 3.6}deg"><div><strong>${attempt.percentage}<small>%</small></strong><span>результат</span></div></div></section><section class="result-summary"><div><span class="stat-label">Правильных ответов</span><strong>${attempt.score}<small>/${attempt.totalQuestions}</small></strong></div><div><span class="stat-label">Времени затрачено</span><strong>${formatTime(attempt.timeTakenSeconds)}</strong></div><div><span class="stat-label">Ошибок</span><strong>${attempt.totalQuestions - attempt.score}</strong></div></section><section class="panel review-panel"><div class="panel-heading"><div><span class="eyebrow">Разбор ответов</span><h2>Повторите сложные темы</h2></div><button class="primary-button" data-action="new-test">Пройти ещё раз ${icon("arrow")}</button></div><div class="review-list">${attempt.answers.map((answer, index) => `<article class="review-item ${answer.isCorrect ? "review-correct" : "review-wrong"}"><div class="review-index">0${index + 1}</div><div><h3>${escapeHtml(answer.questionText)}</h3><p><span class="review-label">Ваш ответ</span> ${escapeHtml(String(answer.selectedAnswer))}</p>${!answer.isCorrect ? `<p class="correct-answer"><span class="review-label">Правильный ответ</span> ${escapeHtml(String(answer.correctAnswer))}</p>` : ""}</div><span class="review-status">${answer.isCorrect ? "Верно" : "Повторить"}</span></article>`).join("")}</div></section>`,
  );
  bindShellEvents();
}

function renderLeaderboard(): void {
  view = "leaderboard";
  stopLeaderboardSubscription?.();
  stopLeaderboardSubscription = undefined;
  app.innerHTML = shell('<p class="muted">Загружаем общий рейтинг...</p>');
  bindShellEvents();
  try {
    stopLeaderboardSubscription = subscribeToLeaderboard(() => {
      void renderLeaderboardEntries();
    });
    void renderLeaderboardEntries();
  } catch (error) {
    app.innerHTML = shell(
      `<section class="panel empty-state" role="alert"><h3>Не удалось загрузить рейтинг</h3><p>${escapeHtml(error instanceof Error ? error.message : "Неизвестная ошибка")}</p></section>`,
    );
    bindShellEvents();
  }
}

async function renderLeaderboardEntries(): Promise<void> {
  const requestId = ++leaderboardLoadId;
  try {
    const entries = await getLeaderboard();
    if (view !== "leaderboard" || requestId !== leaderboardLoadId) return;
    app.innerHTML = shell(
      `<section class="page-heading compact-heading"><div><span class="eyebrow">Ритм команды / рейтинг</span><h1>Учимся вместе,<br><em>подаём уверенно.</em></h1><p class="muted">Лучшие результаты всех сотрудников. Обновляется автоматически.</p></div><div class="leaderboard-badge">${icon("chart")} <span>Топ 20</span></div></section><section class="panel leaderboard-panel"><div class="leaderboard-head"><span>Место</span><span>Сотрудник</span><span>Лучший результат</span><span>Тестов</span></div>${entries.length ? entries.map((entry, index) => `<div class="leaderboard-row ${entry.userId === user!.id ? "current-user" : ""}"><strong class="rank">${String(index + 1).padStart(2, "0")}</strong><span class="leader-name"><span class="user-dot">${escapeHtml(entry.nickname.slice(0, 1).toUpperCase())}</span>${escapeHtml(entry.nickname)}${entry.userId === user!.id ? "<small>вы</small>" : ""}</span><strong>${entry.bestPercentage}%</strong><span>${entry.testsTaken}</span></div>`).join("") : '<div class="empty-state"><h3>Пока нет тестов.</h3><p>Пройдите тест, чтобы попасть в рейтинг команды.</p></div>'}</section>`,
    );
    bindShellEvents();
  } catch (error) {
    if (view !== "leaderboard" || requestId !== leaderboardLoadId) return;
    app.innerHTML = shell(
      `<section class="panel empty-state" role="alert"><h3>Не удалось загрузить рейтинг</h3><p>${escapeHtml(error instanceof Error ? error.message : "Неизвестная ошибка")}</p></section>`,
    );
    bindShellEvents();
  }
}

function bindShellEvents(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-view]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        navigate(button.dataset.view as View),
      ),
    );
  document
    .querySelectorAll<HTMLButtonElement>('[data-action="new-test"]')
    .forEach((button) => button.addEventListener("click", startQuiz));
  document
    .querySelector('[data-action="retry-save"]')
    ?.addEventListener("click", () => void persistActiveAttempt());
  document
    .querySelector('[data-action="logout"]')
    ?.addEventListener("click", () => {
      user = undefined;
      view = "welcome";
      renderWelcome();
    });
  document
    .querySelector('[data-action="next"]')
    ?.addEventListener("click", () => {
      if (currentQuestion === quizQuestions.length - 1) void finishQuiz();
      else {
        currentQuestion += 1;
        renderQuiz();
      }
    });
  document
    .querySelector('[data-action="quit-quiz"]')
    ?.addEventListener("click", () => {
      if (timerId !== undefined) window.clearInterval(timerId);
      timerId = undefined;
      void renderDashboard();
    });
  document
    .querySelectorAll<HTMLButtonElement>("[data-attempt-id]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        void getAttemptsByUser(user!.id)
          .then((attempts) => {
            const attempt = attempts.find(
              (item) => item.id === button.dataset.attemptId,
            );
            if (attempt) {
              activeAttempt = attempt;
              renderResults();
            }
          })
          .catch((error: unknown) => {
            app.innerHTML = shell(
              `<section class="panel empty-state" role="alert"><h3>Не удалось загрузить тест</h3><p>${escapeHtml(error instanceof Error ? error.message : "Неизвестная ошибка")}</p></section>`,
            );
            bindShellEvents();
          });
      }),
    );
}

function startQuiz(): void {
  currentQuestion = 0;
  selections = {};
  quizQuestions = pickRandomQuestions(totalQuestions);
  secondsLeft = quizDuration;
  quizStartedAt = new Date().toISOString();
  renderQuiz();
}

function navigate(nextView: View): void {
  // Stop the quiz timer when navigating away mid-quiz
  if (view === "quiz" && nextView !== "quiz") {
    if (timerId !== undefined) window.clearInterval(timerId);
    timerId = undefined;
  }
  if (nextView !== "leaderboard") {
    stopLeaderboardSubscription?.();
    stopLeaderboardSubscription = undefined;
  }
  if (nextView === "dashboard") void renderDashboard();
  if (nextView === "leaderboard") renderLeaderboard();
}

renderWelcome();
