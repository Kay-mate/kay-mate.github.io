import { useState, useEffect } from 'react'

function App() {
  const [seconds, setSeconds] = useState(7)

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds])

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0')
    const remainingSeconds = (timeInSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }

  return (
    <section id="buzzer-root">
      <div>
        <h1>Countdown Timer</h1>
        <p>{formatTime(seconds)}</p>
        {seconds <= 0 && <p>Time's Up!</p>}
      </div>
    </section>
  )
}

export default App
