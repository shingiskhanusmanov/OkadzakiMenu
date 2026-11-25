import { Link, useLocation } from "react-router-dom";

const LOGO_URL =
  "https://cdn-kz19.foodpicasso.com/assets/2026/08/11/31e1e3b701c7607a369f47d62a2edf9b---svg_original_919c8_convert.svg";

interface NavbarProps {
  nickname?: string;
  onLogout?: () => void;
}

export const Navbar = ({ nickname, onLogout }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(13,13,13,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <img
            src={LOGO_URL}
            alt="Okadzaki"
            style={{ height: 32, width: "auto", filter: "brightness(1.1)" }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-gold)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "none",
            }}
            className="nav-subtitle"
          >
            Staff Training
          </span>
        </Link>

        {/* Navigation */}
        {nickname && (
          <nav
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="nav-label">Главная</span>
            </Link>
            <Link
              to="/menu"
              className={`nav-link ${isActive("/menu") ? "active" : ""}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="nav-label">Меню</span>
            </Link>
            <Link
              to="/leaderboard"
              className={`nav-link ${isActive("/leaderboard") ? "active" : ""}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span className="nav-label">Рейтинг</span>
            </Link>
          </nav>
        )}

        {/* Right side */}
        {nickname && (
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nickname}
            </span>
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: "0.375rem 0.875rem", fontSize: "0.8rem" }}
            >
              Выйти
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .nav-label { display: none; }
          .nav-link { padding: 0.5rem; }
        }
        @media (min-width: 480px) {
          .nav-subtitle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
