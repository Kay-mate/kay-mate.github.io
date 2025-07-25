import { useState, useEffect, useRef } from 'react'
import U from './TimerLogs'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [inputSeconds, setInputSeconds] = useState('0')
  const [initialSeconds, setInitialSeconds] = useState(0)
  const [showYT, setShowYT] = useState(false)
  const circleRef = useRef(null)
  const audioRef = useRef(null)
  const gradientId = 'progress-gradient'

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [seconds])

  useEffect(() => {
    if (!circleRef.current) return
    const radius = 60
    const circumference = 2 * Math.PI * radius
    const progress = seconds / initialSeconds || 0
    const offset = circumference - progress * circumference
    circleRef.current.style.strokeDashoffset = offset
  }, [seconds, initialSeconds])

  useEffect(() => {
    if (seconds === 0 && audioRef.current) {
      const timeout = setTimeout(() => {
        audioRef.current.play()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [seconds])

  const handleInputChange = (e) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) setInputSeconds(val)
  }

  const handleSetTime = () => {
    const num = Number(inputSeconds)
    if (num >= 1 && num <= 999) {
      setInitialSeconds(num)
      setSeconds(num)
      setShowYT(num === 69)
    } else {
      setInputSeconds(seconds.toString())
    }
  }

  const handleReset = () => {
    const num = Number(inputSeconds)
    if (num >= 1 && num <= 999) {
      setSeconds(num)
    }
  }

  const containerStyle = {
    position: 'relative',
    width: '140px',
    height: '140px',
  }

  const textContainerStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
    color: '#d8b4fe',
    fontSize: '3rem',
    fontFamily: 'monospace',
  }

  const radius = 60
  const circumference = 2 * Math.PI * radius

  return <section id="buzzer-root">
    <div id="main-wrapper">
      <h1 id="title">Countdown Timer</h1>
      <div id="controls-wrapper">
        <div style={containerStyle}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="60%" stopColor="#8839ef" />
                <stop offset="100%" stopColor="#ea76cb" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={radius} stroke="#4b2da8" strokeWidth="10" fill="none" />
            <circle ref={circleRef} cx="70" cy="70" r={radius} stroke={`url(#${gradientId})`} strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={circumference} id="progress-circle" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={textContainerStyle}>{seconds}</div>
        </div>
        <div id="input-wrapper">
          <input type="text" inputMode="numeric" value={inputSeconds} onChange={handleInputChange} placeholder="1 - 30 seconds" maxLength={3} id="time-input" />
          <button onClick={handleSetTime} id="set-button">Set Time</button>
          <button onClick={handleReset} id="set-button">Reset</button>
        </div>
      </div>
    </div>
    {showYT && <U />}
    <audio ref={audioRef} src="/tuturu.mp3" preload="auto" />
  </section>
}

export default App
