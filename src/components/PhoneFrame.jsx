import React from 'react'
import styles from './PhoneFrame.module.css'

export default function PhoneFrame({ children }) {
  const [time, setTime] = React.useState(() => {
    const d = new Date()
    let h = d.getHours() % 12 || 12
    const m = String(d.getMinutes()).padStart(2, '0')
    const ap = d.getHours() >= 12 ? 'PM' : 'AM'
    return `${h}:${m} ${ap}`
  })

  React.useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      let h = d.getHours() % 12 || 12
      const m = String(d.getMinutes()).padStart(2, '0')
      const ap = d.getHours() >= 12 ? 'PM' : 'AM'
      setTime(`${h}:${m} ${ap}`)
    }, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.phone}>
        {/* Status bar */}
        <div className={styles.statusBar}>
          <span className={styles.clock}>{time}</span>
          <div className={styles.icons}>
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>
        {/* Dynamic island */}
        <div className={styles.island} />
        {/* Screen content */}
        <div className={styles.screen}>{children}</div>
        {/* Home bar */}
        <div className={styles.homeBar}><div className={styles.homeBarInner}/></div>
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <rect x="0"  y="7" width="3" height="4" rx="1" fill="currentColor" opacity=".5"/>
      <rect x="4"  y="5" width="3" height="6" rx="1" fill="currentColor" opacity=".65"/>
      <rect x="8"  y="2.5" width="3" height="8.5" rx="1" fill="currentColor" opacity=".8"/>
      <rect x="12" y="0" width="2" height="11" rx="1" fill="currentColor"/>
    </svg>
  )
}
function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path d="M7 2.5C9 2.5 10.8 3.3 12 4.7L13.2 3.3C11.7 1.6 9.5.5 7 .5S2.3 1.6.8 3.3L2 4.7C3.2 3.3 5 2.5 7 2.5z" fill="currentColor" opacity=".5"/>
      <path d="M7 5.5C8.2 5.5 9.3 6 10 6.9L11.2 5.6C10.2 4.4 8.7 3.7 7 3.7s-3.2.7-4.2 1.9L4 6.9C4.7 6 5.8 5.5 7 5.5z" fill="currentColor" opacity=".75"/>
      <circle cx="7" cy="9" r="1.5" fill="currentColor"/>
    </svg>
  )
}
function BatteryIcon() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect x=".5" y=".5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity=".4"/>
      <rect x="2" y="2" width="13" height="7" rx="1.5" fill="currentColor" opacity=".7"/>
      <path d="M20 3.5v4a2 2 0 000-4z" fill="currentColor" opacity=".45"/>
    </svg>
  )
}
