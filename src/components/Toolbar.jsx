import { FILTER_TABS, SORT_LABELS } from '../constants/app.js';
import { useRovingTabIndex } from '../hooks/useRovingTabIndex.js';

export default function Toolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  resultsCount,
  totalCount,
  completedCount,
  onClearCompleted,
}) {
  const filterId = 'toolbar-filter-group';
  const { onKeyDown, getTabIndex, setRef } = useRovingTabIndex(FILTER_TABS.length);

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
            aria-label="Search tasks"
          />
        </label>
        <label className="sort-field">
          <span className="visually-hidden">Sort tasks</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort tasks"
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
          onKeyDown={onKeyDown}
        >
          {FILTER_TABS.map((tab, index) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                ref={setRef(index)}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={getTabIndex(index)}
                className={isActive ? 'filter filter--active' : 'filter'}
                onClick={() => onFilterChange(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="toolbar-meta">
          <p className="results-summary" aria-live="polite">
            Showing <strong>{resultsCount}</strong> of {totalCount}
          </p>
          {completedCount > 0 && onClearCompleted ? (
            <button
              type="button"
              className="btn-link"
              onClick={onClearCompleted}
            >
              Clear completed ({completedCount})
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
