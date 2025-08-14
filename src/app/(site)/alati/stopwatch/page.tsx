'use client'
import { useState, useEffect } from 'react'

export default function StopwatchPage() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return (
    <main className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">Stopwatch</h1>
      <div className="text-6xl font-mono mb-6">
        {minutes}:{remainingSeconds.toString().padStart(2, '0')}
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
            setSeconds(0)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Reset
        </button>
      </div>
    </main>
  )
}
