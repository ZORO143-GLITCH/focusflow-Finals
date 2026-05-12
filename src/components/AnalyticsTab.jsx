import styles from './AnalyticsTab.module.css'

export default function AnalyticsTab({ totalFocusMins, totalDist, pctDone, avgScore, sessionHist }) {
  return (
    <div className={styles.container}>
      <div className={styles.statGrid}>
        <StatCard value={`${totalFocusMins}m`} label="Focus time"    color="green" />
        <StatCard value={totalDist}             label="Distractions"  color="amber" />
      </div>

      <StatCard value={`${pctDone}%`} label="Tasks completed" color="purple" wide />

      <div className={styles.scoreCard}>
        <div className={styles.scoreRow}>
          <span className={styles.scoreLbl}>Session score</span>
          <span className={styles.scoreVal}>{avgScore ?? '—'}</span>
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${avgScore ?? 0}%` }} />
        </div>
      </div>

      <div className={styles.histCard}>
        <span className={styles.histTitle}>History</span>
        {sessionHist.length === 0 ? (
          <p className={styles.empty}>No sessions yet. Start your first focus session!</p>
        ) : (
          sessionHist.map((s, i) => <HistRow key={i} session={s} />)
        )}
      </div>
    </div>
  )
}

function StatCard({ value, label, color, wide }) {
  return (
    <div className={`${styles.statCard} ${wide ? styles.wide : ''}`}>
      <span className={`${styles.statVal} ${styles[color]}`}>{value}</span>
      <span className={styles.statLbl}>{label}</span>
    </div>
  )
}

function HistRow({ session }) {
  const color = session.score >= 70 ? 'var(--green)'
    : session.score >= 40 ? 'var(--amber)'
    : 'var(--red)'
  return (
    <div className={styles.histRow}>
      <div className={styles.histInfo}>
        <span className={styles.histTask}>{session.task}</span>
        <span className={styles.histMeta}>
          {session.time} · {Math.floor(session.focusSecs / 60)}m · {session.dist} distraction{session.dist !== 1 ? 's' : ''}
        </span>
      </div>
      <div className={styles.histRight}>
        <span className={styles.histScore} style={{ color }}>{session.score}</span>
        <span className={styles.histStatus}>{session.completed ? 'done' : 'paused'}</span>
      </div>
    </div>
  )
}
