import type { Question } from '../../types';

interface AnswerOptionProps {
  option: string;
  selected: boolean;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  isUserChoice?: boolean;
  onClick: () => void;
}

export const AnswerOption = ({
  option,
  selected,
  disabled,
  showResult,
  isCorrect,
  isUserChoice,
  onClick,
}: AnswerOptionProps) => {
  let className = 'answer-option';
  let icon = null;

  if (showResult) {
    if (isCorrect) {
      className += ' correct';
      icon = <span style={{ marginRight: '0.5rem' }}>✓</span>;
    } else if (isUserChoice && !isCorrect) {
      className += ' incorrect';
      icon = <span style={{ marginRight: '0.5rem' }}>✗</span>;
    }
  } else if (selected) {
    className += ' selected';
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}
    >
      {icon}
      <span>{option}</span>
    </button>
  );
};

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string | string[];
  onSelectAnswer: (answer: string) => void;
  showResult?: boolean;
}

export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
}: QuestionCardProps) => {
  const categoryLabels: Record<string, string> = {
    ingredients: 'Ингредиенты',
    sets: 'Сеты',
    rolls: 'Роллы',
    general: 'Общие знания',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category badge */}
      {question.category && (
        <div>
          <span className="badge badge-gold">{categoryLabels[question.category] || question.category}</span>
        </div>
      )}

      {/* Question text */}
      <h2
        style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
          fontFamily: '"Noto Sans", sans-serif',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {question.text}
      </h2>

      {/* Answer options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {question.options.map((option) => {
          const isSelected = Array.isArray(selectedAnswer)
            ? selectedAnswer.includes(option)
            : selectedAnswer === option;

          const correctAns = question.correctAnswer;
          const isCorrect = Array.isArray(correctAns)
            ? correctAns.includes(option)
            : correctAns === option;

          return (
            <AnswerOption
              key={option}
              option={option}
              selected={isSelected}
              disabled={showResult}
              showResult={showResult}
              isCorrect={isCorrect}
              isUserChoice={isSelected}
              onClick={() => onSelectAnswer(option)}
            />
          );
        })}
      </div>

      {/* Explanation (shown in review mode) */}
      {showResult && question.explanation && (
        <div
          style={{
            background: 'rgba(232,184,109,0.08)',
            border: '1px solid rgba(232,184,109,0.2)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>💡 Пояснение: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
};
