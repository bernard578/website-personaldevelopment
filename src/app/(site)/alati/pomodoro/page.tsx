'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';

type Mode = 'focus' | 'short' | 'long';

export default function PomodoroPage() {
  const DURATIONS: Record<Mode, number> = {
    focus: 25, // minutes
    short: 5,
    long: 15,
  };

  const [mode, setMode] = useState<Mode>('focus');
  const [totalSeconds, setTotalSeconds] = useState(DURATIONS.focus * 60);
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus * 60);
  const [isRunning, setIsRunning] = useState(false);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const progress = useMemo(() => {
    if (totalSeconds === 0) return 0;
    return 100 - Math.round((secondsLeft / totalSeconds) * 100);
  }, [secondsLeft, totalSeconds]);

  // Tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 0) return prev - 1;
        // Auto-stop when finished
        setIsRunning(false);
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Switch modes
  const switchMode = (next: Mode) => {
    const secs = DURATIONS[next] * 60;
    setMode(next);
    setIsRunning(false);
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  // Reset current mode to full duration
  const handleReset = () => {
    const secs = DURATIONS[mode] * 60;
    setIsRunning(false);
    setSecondsLeft(secs);
    setTotalSeconds(secs);
  };

  return (
    <section className="px-2 md:px-0 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Pomodoro Timer</h1>

      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
        {/* Mode buttons */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          <Button
            variant={mode === 'focus' ? 'default' : 'outline'}
            className={mode === 'focus' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
            onClick={() => switchMode('focus')}
          >
            Fokus
          </Button>
          <Button
            variant={mode === 'short' ? 'default' : 'outline'}
            className={mode === 'short' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            onClick={() => switchMode('short')}
          >
            Kratka pauza
          </Button>
          <Button
            variant={mode === 'long' ? 'default' : 'outline'}
            className={mode === 'long' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            onClick={() => switchMode('long')}
          >
            Duga pauza
          </Button>
        </div>

        {/* Timer */}
        <div
          className="text-5xl md:text-6xl font-mono tabular-nums mb-4"
          aria-live="polite"
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>

        {/* Progress */}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6" aria-label="Napredak">
          <div
            className="h-full bg-indigo-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
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

        <p className="mt-4 text-xs text-gray-500">
          Klasični 25‑minutni fokus ili pauze od 5/15 min. Pauziraj ili resetiraj kad trebaš.
        </p>
      </div>
    </section>
  );
}
