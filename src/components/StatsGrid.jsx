export default function StatsGrid({ stats }) {
  const cards = [
    { label: 'Total tasks', value: stats.total, modifier: 'total' },
    { label: 'Completed', value: stats.completed, modifier: 'completed' },
    { label: 'Pending', value: stats.pending, modifier: 'pending' },
    {
      label: 'Completion',
      value: `${stats.ratio}%`,
      modifier: 'ratio',
      hint: stats.total === 0 ? 'Add a task to track progress.' : null,
    },
  ];

  return (
    <div className="stats-grid" aria-label="Task statistics">
      {cards.map((card) => (
        <article key={card.modifier} className={`stat-card stat-card--${card.modifier}`}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          {card.hint ? <small className="stat-hint">{card.hint}</small> : null}
        </article>
      ))}
    </div>
  );
}
