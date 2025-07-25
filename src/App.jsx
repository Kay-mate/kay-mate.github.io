import { useState, useEffect, useRef } from 'react'

function App() {
  const [seconds, setSeconds] = useState(7)
  const [inputSeconds, setInputSeconds] = useState('7')
  const [initialSeconds, setInitialSeconds] = useState(7)
  const circleRef = useRef(null)

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1)
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

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0')
    const remainingSeconds = (timeInSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }

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

  return (
    <section id="buzzer-root" className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Countdown Timer</h1>
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90" width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" stroke="#444" strokeWidth="10" fill="none" />
          <circle ref={circleRef} cx="70"   cy="70" r="60" stroke="#3b82f6" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60} style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-4xl font-mono">{formatTime(seconds)}</p>
        </div>
      </div>
      {seconds <= 0 && <p className="mt-4 text-red-500 font-semibold">timeup</p>}

      <div className="mt-8 flex flex-col items-center space-y-3">
        <input type="text" inputMode="numeric" value={inputSeconds} onChange={handleInputChange} placeholder="1 - 30 seconds" className="w-32 p-2 rounded border border-gray-600 bg-gray-800 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={2} />
        <button onClick={handleSetTime} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Set Time
        </button>
      </div>
    </section>
  )
}

export default App
