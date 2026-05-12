import { useState } from 'react'
import PhoneFrame    from './components/PhoneFrame'
import TasksTab      from './components/TasksTab'
import FocusTab      from './components/FocusTab'
import AnalyticsTab  from './components/AnalyticsTab'
import NudgeSheet    from './components/NudgeSheet'
import { useFocusSession } from './hooks/useFocusSession'
import styles from './App.module.css'

const TABS = ['Tasks', 'Focus', 'Analytics']

export default function App() {
  const [activeTab, setActiveTab] = useState('Tasks')

  const {
    tasks, activeId, setActiveId, activeTask,
    isFocus, focusSecs, distCount, nudgeOpen,
    sessionHist,
    addTask, toggleDone, completeTask,
    startSessionWithTask, endSessionFinal,
    resumeNudge,
    fmt,
    totalFocusMins, totalDist, pctDone, avgScore,
  } = useFocusSession()

  const timerLabel = fmt(focusSecs)

  return (
    <PhoneFrame>
      {/* ── App header ── */}
      <div className={styles.header}>
        <span className={styles.appName}>FocusFlow</span>
        <div className={styles.headerRight}>
          {isFocus && (
            <span className={styles.timerChip}>{timerLabel}</span>
          )}
          <button
            className={`${styles.focusPill} ${isFocus ? styles.pillOn : ''}`}
            onClick={() => isFocus ? endSessionFinal(false) : startSessionWithTask(activeTask)}
          >
            <span className={`${styles.pillDot} ${isFocus ? styles.dotOn : ''}`} />
            <span>{isFocus ? 'Active' : 'Focus'}</span>
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Page content ── */}
      <div className={styles.content}>
        {activeTab === 'Tasks' && (
          <TasksTab
            tasks={tasks}
            activeId={activeId}
            setActiveId={setActiveId}
            toggleDone={toggleDone}
            addTask={addTask}
          />
        )}
        {activeTab === 'Focus' && (
          <FocusTab
            activeTask={activeTask}
            isFocus={isFocus}
            focusSecs={focusSecs}
            distCount={distCount}
            tasks={tasks}
            setActiveId={setActiveId}
            startSessionWithTask={startSessionWithTask}
            endSessionFinal={endSessionFinal}
            completeTask={completeTask}
            fmt={fmt}
          />
        )}
        {activeTab === 'Analytics' && (
          <AnalyticsTab
            totalFocusMins={totalFocusMins}
            totalDist={totalDist}
            pctDone={pctDone}
            avgScore={avgScore}
            sessionHist={sessionHist}
          />
        )}
      </div>

      {/* ── Nudge bottom sheet ── */}
      <NudgeSheet
        open={nudgeOpen}
        activeTask={activeTask}
        onResume={resumeNudge}
        onPause={() => endSessionFinal(false)}
        onEnd={() => endSessionFinal(false)}
      />
    </PhoneFrame>
  )
}
