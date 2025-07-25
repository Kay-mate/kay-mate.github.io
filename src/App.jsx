import { useState, useEffect, useRef } from 'react'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [inputSeconds, setInputSeconds] = useState('0')
  const [initialSeconds, setInitialSeconds] = useState(0)
  const circleRef = useRef(null)
  const audioRef = useRef(null)

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
    if (num >= 1 && num <= 30) {
      setInitialSeconds(num)
      setSeconds(num)
    } else {
      setInputSeconds(seconds.toString())
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
    color: 'black',
    fontSize: '3rem',
    fontFamily: 'monospace',
  }

  return (
    <section id="buzzer-root" className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Countdown Timer</h1>
      <div className="flex items-center space-x-8">
        <div style={containerStyle}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="60" stroke="#444" strokeWidth="10" fill="none" />
            <circle ref={circleRef} cx="70" cy="70" r="60" stroke="#3b82f6" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60} style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={textContainerStyle}>{seconds}</div>
        </div>
        <div className="flex flex-col space-y-4">
          {seconds <= 0 && <p className="text-red-500 font-semibold text-center">timeup</p>}
          <input type="text" inputMode="numeric" value={inputSeconds} onChange={handleInputChange} placeholder="1 - 30 seconds" className="w-32 p-2 rounded border border-gray-600 bg-gray-800 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={2} />
          <button onClick={handleSetTime} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Set Time</button>
        </div>
      </div>
      <audio ref={audioRef} src="/tuturu.mp3" preload="auto" />
    </section>
  )
}

export default App
