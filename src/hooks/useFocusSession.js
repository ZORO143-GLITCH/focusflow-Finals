import { useState, useEffect, useRef, useCallback } from 'react'

const IDLE_THRESHOLD = 30000 // 30s demo (change to 480000 for 8 min)

const INITIAL_TASKS = [
  { id: 1, name: 'Review HCI design principles', done: false },
  { id: 2, name: 'Write introduction section',   done: false },
  { id: 3, name: 'Prepare evaluation plan',      done: false },
  { id: 4, name: 'Read usability heuristics',    done: false },
]

export function useFocusSession() {
  const [tasks,        setTasks]        = useState(INITIAL_TASKS)
  const [nextId,       setNextId]       = useState(5)
  const [activeId,     setActiveId]     = useState(null)
  const [isFocus,      setIsFocus]      = useState(false)
  const [focusSecs,    setFocusSecs]    = useState(0)
  const [distCount,    setDistCount]    = useState(0)
  const [sessionHist,  setSessionHist]  = useState([])
  const [nudgeOpen,    setNudgeOpen]    = useState(false)

  const tickRef       = useRef(null)
  const idleRef       = useRef(null)
  const sessionStart  = useRef(null)
  const isFocusRef    = useRef(false)
  const distCountRef  = useRef(0)
  const focusSecsRef  = useRef(0)

  // keep refs in sync
  useEffect(() => { isFocusRef.current = isFocus }, [isFocus])
  useEffect(() => { distCountRef.current = distCount }, [distCount])
  useEffect(() => { focusSecsRef.current = focusSecs }, [focusSecs])

  const calcScore = (ft, d, tot) => {
    if (tot === 0) return 0
    return Math.round(Math.max(0, Math.min(100, (ft / Math.max(tot, 1)) * 100 - d * 8)))
  }

  const resetIdle = useCallback(() => {
    clearTimeout(idleRef.current)
    idleRef.current = setTimeout(() => {
      if (isFocusRef.current) {
        distCountRef.current += 1
        setDistCount(distCountRef.current)
        setNudgeOpen(true)
      }
    }, IDLE_THRESHOLD)
  }, [])

  const onActivity = useCallback(() => {
    clearTimeout(idleRef.current)
    resetIdle()
  }, [resetIdle])

  const startSession = useCallback((taskId) => {
    const id = taskId ?? null
    setActiveId(id)
    setIsFocus(true)
    setFocusSecs(0)
    setDistCount(0)
    focusSecsRef.current = 0
    distCountRef.current = 0
    sessionStart.current = Date.now()

    clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      focusSecsRef.current += 1
      setFocusSecs(focusSecsRef.current)
    }, 1000)

    resetIdle()
    document.addEventListener('mousemove',  onActivity)
    document.addEventListener('keydown',    onActivity)
    document.addEventListener('scroll',     onActivity)
    document.addEventListener('touchstart', onActivity)
  }, [onActivity, resetIdle])

  const endSession = useCallback((completed) => {
    clearInterval(tickRef.current)
    clearTimeout(idleRef.current)
    document.removeEventListener('mousemove',  onActivity)
    document.removeEventListener('keydown',    onActivity)
    document.removeEventListener('scroll',     onActivity)
    document.removeEventListener('touchstart', onActivity)

    const dur   = Math.floor((Date.now() - sessionStart.current) / 1000)
    const score = calcScore(focusSecsRef.current, distCountRef.current, dur)

    setSessionHist(prev => {
      const taskName = prev[0]?.task // we look up below
      return [
        {
          task:      taskName ?? '—',
          dur,
          focusSecs: focusSecsRef.current,
          dist:      distCountRef.current,
          score,
          completed,
          time:      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]
    })

    setIsFocus(false)
    setNudgeOpen(false)
  }, [onActivity])

  // Capture task name at session start then save on end
  const sessionTaskRef = useRef(null)

  const startSessionWithTask = useCallback((task) => {
    sessionTaskRef.current = task?.name ?? '—'
    startSession(task?.id)
  }, [startSession])

  const endSessionFinal = useCallback((completed) => {
    clearInterval(tickRef.current)
    clearTimeout(idleRef.current)
    document.removeEventListener('mousemove',  onActivity)
    document.removeEventListener('keydown',    onActivity)
    document.removeEventListener('scroll',     onActivity)
    document.removeEventListener('touchstart', onActivity)

    const dur   = Math.floor((Date.now() - (sessionStart.current || Date.now())) / 1000)
    const score = calcScore(focusSecsRef.current, distCountRef.current, dur)

    setSessionHist(prev => [
      {
        task:      sessionTaskRef.current ?? '—',
        dur,
        focusSecs: focusSecsRef.current,
        dist:      distCountRef.current,
        score,
        completed,
        time:      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ])

    setIsFocus(false)
    setNudgeOpen(false)
  }, [onActivity])

  const addTask = useCallback((name) => {
    if (!name.trim()) return
    setTasks(prev => [...prev, { id: nextId, name: name.trim(), done: false }])
    setNextId(n => n + 1)
  }, [nextId])

  const toggleDone = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
    if (activeId === id && isFocus) endSessionFinal(true)
  }, [activeId, isFocus, endSessionFinal])

  const completeTask = useCallback(() => {
    if (!activeId) return
    setTasks(prev => prev.map(t => t.id === activeId ? { ...t, done: true } : t))
    endSessionFinal(true)
  }, [activeId, endSessionFinal])

  const resumeNudge = useCallback(() => {
    setNudgeOpen(false)
    resetIdle()
  }, [resetIdle])

  const fmt = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const activeTask    = tasks.find(t => t.id === activeId) ?? null
  const totalFocusMins= Math.floor(sessionHist.reduce((a, s) => a + s.focusSecs, 0) / 60)
  const totalDist     = sessionHist.reduce((a, s) => a + s.dist, 0)
  const pctDone       = tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0
  const avgScore      = sessionHist.length
    ? Math.round(sessionHist.reduce((a, s) => a + s.score, 0) / sessionHist.length)
    : null

  return {
    tasks, activeId, setActiveId, activeTask,
    isFocus, focusSecs, distCount, nudgeOpen,
    sessionHist,
    addTask, toggleDone, completeTask,
    startSessionWithTask, endSessionFinal,
    resumeNudge,
    fmt,
    totalFocusMins, totalDist, pctDone, avgScore,
  }
}
