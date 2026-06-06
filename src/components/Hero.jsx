export default function Hero({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <div className="hero">
      <div className="hero-text">
        <p className="eyebrow">Personal workflow</p>
        <h1>LumaFlow</h1>
        <p className="subtitle">
          A focused task workspace with a clean, adaptive interface.
        </p>
      </div>
      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-pressed={!isDark}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        <span aria-hidden="true" className="theme-toggle__icon">
          {isDark ? '☀' : '☾'}
        </span>
        <span>{isDark ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  );
}
