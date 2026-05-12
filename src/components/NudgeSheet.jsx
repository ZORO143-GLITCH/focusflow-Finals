import styles from './NudgeSheet.module.css'

export default function NudgeSheet({ open, activeTask, onResume, onPause, onEnd }) {
  if (!open) return null
  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.handle} />
        <div className={styles.head}>
          <div className={styles.iconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className={styles.title}>Still there?</h3>
          <p className={styles.sub}>
            {activeTask
              ? `You've been idle. Ready to get back to "${activeTask.name}"?`
              : "You've been idle for a while. Ready to resume?"}
          </p>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.resume}`} onClick={onResume}>
            Resume focus
          </button>
          <button className={`${styles.btn} ${styles.pause}`} onClick={onPause}>
            Pause session
          </button>
          <button className={`${styles.btn} ${styles.end}`} onClick={onEnd}>
            End session
          </button>
        </div>
      </div>
    </div>
  )
}
