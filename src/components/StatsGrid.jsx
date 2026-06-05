export default function StatsGrid({ stats }) {
  const cards = [
    { label: 'Total tasks', value: stats.total, modifier: 'total' },
    { label: 'Completed', value: stats.completed, modifier: 'completed' },
    { label: 'Pending', value: stats.pending, modifier: 'pending' },
  ];

  return (
    <div className="stats-grid" aria-label="Task statistics">
      {cards.map((card) => (
        <article key={card.modifier} className={`stat-card stat-card--${card.modifier}`}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </div>
  );
}
