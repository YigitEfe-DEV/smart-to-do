# LumaFlow

A polished React workspace for capturing and clearing tasks with speed.

## Overview

LumaFlow is a lightweight task app with a calm visual style, local persistence, and a responsive layout that works on desktop and mobile. Tasks live in your browser via `localStorage`; nothing leaves your device.

## Features

- **Quick task capture** — type, press Enter, done.
- **Inline editing** — clean editing flow with autofocus and Escape support.
- **Removal with confirmation** — destructive actions go through an accessible modal.
- **Filter & search** — toggle between All, Active, and Completed; search across all text.
- **Sortable lists** — order by newest, oldest, or alphabetical.
- **Statistics dashboard** — total, completed, pending, and a live completion progress bar.
- **Bulk clear** — wipe completed tasks in one click.
- **Light and dark themes** — auto-persisted; switches without a page reload.
- **Loading state** — surfaces only while storage hydrates and the artwork warms up.
- **Contextual empty states** — different copy for "no tasks", "no matches", and filtered empties.
- **Storage error toast** — surfaces if your browser blocks persistence.
- **Responsive design** — first-class mobile, tablet, and desktop layouts.
- **Accessibility** — keyboard-navigable filter tabs, visible focus rings, ARIA labels, and `prefers-reduced-motion` support.

## Getting Started

```bash
npm install
npm run dev
```

The development server starts on http://localhost:5173 by default.

### Build

```bash
npm run build
```

The static bundle lands in `dist/` and can be served from any static host.

### Preview

```bash
npm run preview
```

## Keyboard Shortcuts

| Action | Shortcut |
| --- | --- |
| Submit composer | `Enter` |
| Submit edit form | `Enter` |
| Cancel edit | `Escape` |
| Cycle filters | `←` / `→` (or `Home` / `End`) |
| Dismiss confirm dialog | `Escape` |

## Project Structure

```
src/
├── App.jsx              # Composition root
├── main.jsx             # Entry + theme pre-paint
├── components/          # Reusable presentational components
│   ├── Button.jsx
│   ├── Composer.jsx
│   ├── ConfirmDialog.jsx
│   ├── Hero.jsx
│   ├── StatsGrid.jsx
│   ├── TaskItem.jsx
│   ├── TaskList.jsx
│   ├── Toast.jsx
│   └── Toolbar.jsx
├── constants/           # App-wide constants and storage keys
│   └── app.js
├── hooks/               # State and effect hooks
│   ├── useDebouncedValue.js
│   ├── useRovingTabIndex.js
│   ├── useSort.js
│   ├── useTasks.js
│   └── useTheme.js
├── styles.css           # Single design-system stylesheet
└── utils/               # Pure helpers
    ├── storage.js
    └── tasks.js
```

## Design Notes

- CSS custom properties on `:root` provide colors, spacing, radii, and motion tokens.
- Light/dark themes are driven by `data-theme` on `<html>` and pre-applied before paint.
- The grid uses an 8-point spacing scale via `--space-*` tokens.
- Transitions respect `prefers-reduced-motion`.

## Persistence

Tasks, the active sort, and the theme are saved to `localStorage` under these keys:

- `task-manager-tasks`
- `task-manager-sort`
- `task-manager-theme`

Clearing site data will reset the workspace.

## Notes

- Your tasks stay in the browser via `localStorage`.
- The theme preference is also remembered automatically.

## License

MIT
