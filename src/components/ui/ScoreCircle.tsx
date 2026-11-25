import { useEffect, useState } from 'react';

interface ScoreCircleProps {
  percentage: number;
  size?: number;
}

export const ScoreCircle = ({ percentage, size = 160 }: ScoreCircleProps) => {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const strokeDashoffset = circumference - (animated / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 80) return 'var(--color-green)';
    if (pct >= 60) return 'var(--color-gold)';
    return 'var(--color-red)';
  };

  const getEmoji = (pct: number) => {
    if (pct >= 90) return '🏆';
    if (pct >= 80) return '⭐';
    if (pct >= 60) return '👍';
    return '📚';
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={10}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.1rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>{getEmoji(percentage)}</span>
        <span
          style={{
            fontSize: size > 140 ? '1.75rem' : '1.25rem',
            fontWeight: 800,
            color: getColor(percentage),
            lineHeight: 1,
          }}
        >
          {animated}%
        </span>
      </div>
    </div>
  );
};
