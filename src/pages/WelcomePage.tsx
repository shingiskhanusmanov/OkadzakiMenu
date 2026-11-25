import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGO_URL =
  "https://cdn-kz19.foodpicasso.com/assets/2026/08/11/31e1e3b701c7607a369f47d62a2edf9b---svg_original_919c8_convert.svg";

interface WelcomePageProps {
  onLogin: (nickname: string) => void;
}

export const WelcomePage = ({ onLogin }: WelcomePageProps) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("Введи наххуй твой никнейм");
      return;
    }
    if (trimmed.length < 2) {
      setError("Никнейм должен быть минимум 2 символа");
      return;
    }
    onLogin(trimmed);
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,184,109,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(232,184,109,0.04) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Japanese decorative text */}
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "10%",
          fontSize: "clamp(4rem, 12vw, 10rem)",
          color: "rgba(232,184,109,0.04)",
          fontFamily: "serif",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        岡崎
      </div>
      <div
        style={{
          position: "absolute",
          left: "3%",
          bottom: "10%",
          fontSize: "clamp(3rem, 8vw, 7rem)",
          color: "rgba(232,184,109,0.03)",
          fontFamily: "serif",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        美味
      </div>

      {/* Main card */}
      <div
        className="page-enter"
        style={{
          width: "100%",
          maxWidth: 460,
          position: "relative",
        }}
      >
        <div
          className="card"
          style={{
            padding: "clamp(2rem, 5vw, 3rem)",
            borderColor: "rgba(232,184,109,0.15)",
            background: "rgba(22,22,22,0.95)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,184,109,0.08)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src={LOGO_URL}
              alt="Okadzaki"
              style={{
                height: 56,
                width: "auto",
                marginBottom: "1.25rem",
                filter: "brightness(1.05)",
              }}
            />
            <h1
              style={{
                margin: "0 0 0.5rem",
                fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
                letterSpacing: "0.06em",
              }}
              className="text-gold-gradient"
            >
              Staff Training
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              Проверь свои знания меню Окадзаки
            </p>
          </div>

          <div className="divider" />

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="nickname"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Ваш никнейм
              </label>
              <input
                id="nickname"
                type="text"
                className="input-field"
                placeholder="Например: Айгерим"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError("");
                }}
                maxLength={30}
                autoFocus
                autoComplete="off"
              />
              {error && (
                <p
                  style={{
                    margin: "0.5rem 0 0",
                    fontSize: "0.8rem",
                    color: "var(--color-red)",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "0.5rem", width: "100%" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Начать тест
            </button>
          </form>

          {/* Info footer */}
          <div
            style={{
              marginTop: "1.75rem",
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
            }}
          >
            {[
              { icon: "📝", text: "20 вопросов" },
              { icon: "⏱", text: "10 минут" },
              { icon: "🏆", text: "Рейтинг" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "var(--color-text-dim)",
                }}
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Almaty label */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.75rem",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
          }}
        >
          ОКАДЗАКИ · АЛМАТЫ
        </p>
      </div>
    </div>
  );
};
