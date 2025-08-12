'use client'
import { useState, useEffect } from 'react'

export default function PomodoroPage() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60) // 25 min
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <main className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">Pomodoro Timer</h1>
      <div className="text-6xl font-mono mb-6">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="space-x-4">
        <button
          onClick={() => setIsRunning(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsRunning(false)
            setSecondsLeft(25 * 60)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Reset
        </button>
      </div>
    </main>
  )
}
