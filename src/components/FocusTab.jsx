import styles from './FocusTab.module.css'

export default function FocusTab({
  activeTask, isFocus, focusSecs, distCount,
  tasks, setActiveId,
  startSessionWithTask, endSessionFinal, completeTask, fmt,
}) {
  const pendingTasks = tasks.filter(t => !t.done)

  if (!isFocus) {
    if (!activeTask) {
      return (
        <div className={styles.container}>
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>
              <ClockIcon />
            </div>
            <h3 className={styles.emptyTitle}>No task selected</h3>
            <p className={styles.emptyDesc}>
              Go to Tasks, pick something to work on, then come back to start a focus session.
            </p>
          </div>
          {pendingTasks.length > 0 && (
            <div className={styles.quickPick}>
              <span className={styles.quickLabel}>Quick pick</span>
              <button
                className={styles.quickBtn}
                onClick={() => setActiveId(pendingTasks[0].id)}
              >
                {pendingTasks[0].name}
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <div className={styles.readyCard}>
          <span className={styles.readyLabel}>Ready to focus</span>
          <h3 className={styles.taskTitle}>{activeTask.name}</h3>
        </div>
        <div className={styles.actionGrid}>
          <button
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={() => startSessionWithTask(activeTask)}
          >
            <PlayIcon />
            <span>Start focus</span>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.ghost}`}
            onClick={() => setActiveId(null)}
          >
            <ListIcon />
            <span>Change task</span>
          </button>
        </div>
      </div>
    )
  }

  // Active session
  const m = String(Math.floor(focusSecs / 60)).padStart(2, '0')
  const s = String(focusSecs % 60).padStart(2, '0')

  return (
    <div className={styles.container}>
      <div className={styles.liveBadge}>
        <span className={styles.liveDot} />
        Focusing
      </div>

      <div className={`${styles.readyCard} ${styles.activeCard}`}>
        <span className={styles.readyLabel}>Current task</span>
        <h3 className={styles.taskTitle}>{activeTask?.name}</h3>
      </div>

      <div className={styles.liveStats}>
        <div className={styles.miniStat}>
          <span className={styles.statVal}>{m}:{s}</span>
          <span className={styles.statLbl}>Focus time</span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.statVal}>{distCount}</span>
          <span className={styles.statLbl}>Distractions</span>
        </div>
      </div>

      <div className={styles.actionGrid}>
        <button
          className={`${styles.actionBtn} ${styles.primary}`}
          onClick={completeTask}
        >
          <CheckIcon />
          <span>Complete</span>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={() => endSessionFinal(false)}
        >
          <StopIcon />
          <span>End session</span>
        </button>
      </div>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polygon points="4,3 13,8 4,13" fill="currentColor"/>
    </svg>
  )
}
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 8h8M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="4" width="8" height="8" rx="1" fill="currentColor"/>
    </svg>
  )
}
