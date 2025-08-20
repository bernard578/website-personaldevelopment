'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function StopwatchPage() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <section className="px-2 md:px-0 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Stopwatch</h1>

      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
        <div className="text-5xl md:text-6xl font-mono mb-6 tabular-nums">
          {minutes}:{remainingSeconds.toString().padStart(2, '0')}
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setIsRunning(true)}
            >
              Start
            </Button>
          ) : (
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => setIsRunning(false)}
            >
              Pauza
            </Button>
          )}

          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
