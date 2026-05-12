# FocusFlow — React + Vite

An attention-aware task manager mobile UI built with React 18 + Vite 5.

## Tech Stack

- **React 18** — component-based UI
- **Vite 5** — lightning-fast dev server & bundler
- **CSS Modules** — scoped styles per component
- **Node.js** — runtime (v18+ recommended)

## Project Structure

```
focusflow/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                    # React entry point
    ├── App.jsx                     # Root — layout, tabs, header
    ├── App.module.css
    ├── index.css                   # Global CSS variables & resets
    ├── hooks/
    │   └── useFocusSession.js      # All business logic (tasks, timer, idle detection)
    └── components/
        ├── PhoneFrame.jsx          # iPhone-style wrapper
        ├── PhoneFrame.module.css
        ├── TasksTab.jsx            # Task list + add task
        ├── TasksTab.module.css
        ├── FocusTab.jsx            # Focus mode panel
        ├── FocusTab.module.css
        ├── AnalyticsTab.jsx        # Score, history, stats
        ├── AnalyticsTab.module.css
        ├── NudgeSheet.jsx          # Bottom sheet on idle
        └── NudgeSheet.module.css
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

### 4. Preview the production build
```bash
npm run preview
```

## Features

| Feature | Where |
|---|---|
| Task CRUD | `TasksTab.jsx` |
| Inactivity detection | `useFocusSession.js` → `resetIdle()` |
| Progressive focus mode | `FocusTab.jsx` |
| Non-intrusive nudge | `NudgeSheet.jsx` |
| Focus score algorithm | `useFocusSession.js` → `calcScore()` |
| Session analytics | `AnalyticsTab.jsx` |

## Idle Threshold

In `src/hooks/useFocusSession.js`, line 3:
```js
const IDLE_THRESHOLD = 30000 // 30 seconds (demo)
// Change to 480000 for 8 minutes (as per proposal)
```

## HCI Principles Implemented

- **Feedback** — live timer chip, pulsing pill, distraction counter
- **Visibility of system status** — focus badge always visible in header
- **Minimalist design** — non-active tasks fade from view in focus mode
- **User control** — nudge gives 3 response options (resume, pause, end)
- **Error prevention** — no accidental task deletion
