import { FILTER_TABS, SORT_LABELS } from '../constants/app.js';

export default function Toolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  resultsCount,
  totalCount,
}) {
  const filterId = 'toolbar-filter-group';
  const sortId = 'toolbar-sort-group';

  return (
    <div className="toolbar">
      <div className="toolbar-row toolbar-row--primary">
        <label className="search-field">
          <span className="visually-hidden">Search tasks</span>
          <input
            className="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks"
            type="search"
          />
        </label>
        <label className="sort-field">
          <span className="visually-hidden">Sort tasks</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_LABELS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="toolbar-row toolbar-row--secondary">
        <div
          id={filterId}
          className="filters"
          role="tablist"
          aria-label="Task filters"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={filter === tab.value}
              className={
                filter === tab.value ? 'filter filter--active' : 'filter'
              }
              onClick={() => onFilterChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="results-summary" aria-live="polite">
          Showing <strong>{resultsCount}</strong> of {totalCount}
        </p>
      </div>
    </div>
  );
}
