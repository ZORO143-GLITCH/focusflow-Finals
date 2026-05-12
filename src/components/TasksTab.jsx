import { useState } from 'react'
import styles from './TasksTab.module.css'

export default function TasksTab({ tasks, activeId, setActiveId, toggleDone, addTask }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    addTask(input)
    setInput('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add new task…"
        />
        <button className={styles.addBtn} onClick={handleAdd}>+</button>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 && (
          <p className={styles.empty}>No tasks yet. Add one above!</p>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isActive={activeId === task.id}
            onSelect={() => setActiveId(task.id)}
            onToggle={() => toggleDone(task.id)}
          />
        ))}
      </div>
    </div>
  )
}

function TaskCard({ task, isActive, onSelect, onToggle }) {
  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''} ${task.done ? styles.done : ''}`}
      onClick={onSelect}
    >
      <div
        className={`${styles.check} ${task.done ? styles.checked : ''}`}
        onClick={e => { e.stopPropagation(); onToggle() }}
      >
        {task.done && <CheckMark />}
      </div>
      <div className={styles.info}>
        <span className={`${styles.name} ${task.done ? styles.strikethrough : ''}`}>
          {task.name}
        </span>
        <span className={styles.sub}>{task.done ? 'Completed' : 'Pending'}</span>
      </div>
      {isActive && !task.done && (
        <span className={styles.badge}>Active</span>
      )}
    </div>
  )
}

function CheckMark() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
