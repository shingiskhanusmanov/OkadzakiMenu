import { useEffect, useRef } from 'react';
import { formatTime } from '../../services/quizEngine';
import { QUIZ_CONFIG } from '../../data/questionsData';

interface TimerProps {
  secondsLeft: number;
}

export const Timer = ({ secondsLeft }: TimerProps) => {
  const limit = QUIZ_CONFIG.timeLimitSeconds;
  const pct = secondsLeft / limit;

  let timerClass = 'timer-normal';
  if (secondsLeft <= 60) timerClass = 'timer-critical';
  else if (secondsLeft <= 120) timerClass = 'timer-warning';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'var(--color-surface-2)',
        border: `1px solid ${secondsLeft <= 60 ? 'rgba(224,82,82,0.4)' : 'var(--color-border)'}`,
        borderRadius: 10,
        padding: '0.4rem 0.875rem',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={timerClass}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span
        className={timerClass}
        style={{
          fontWeight: 700,
          fontSize: '1rem',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.05em',
          minWidth: '3.5rem',
        }}
      >
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
};
