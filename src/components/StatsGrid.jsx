export default function StatsGrid({ stats }) {
  const cards = [
    { label: 'Total tasks', value: stats.total, modifier: 'total' },
    { label: 'Completed', value: stats.completed, modifier: 'completed' },
    { label: 'Pending', value: stats.pending, modifier: 'pending' },
  ];

  return (
    <div className="stats" aria-label="Task statistics">
      <div className="stats-grid">
        {cards.map((card) => (
          <article
            key={card.modifier}
            className={`stat-card stat-card--${card.modifier}`}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
      <div className="progress" role="group" aria-label="Completion progress">
        <div className="progress-meta">
          <span>Overall completion</span>
          <strong>{stats.ratio}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.ratio}
        >
          <div className="progress-bar" style={{ width: `${stats.ratio}%` }} />
        </div>
      </div>
    </div>
  );
}
