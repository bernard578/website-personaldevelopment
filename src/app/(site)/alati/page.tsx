import Link from 'next/link';

export const revalidate = 60;

export default function AlatiPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-8">Alati</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/alati/pomodoro" className="text-indigo-600 hover:underline">
            Pomodoro Timer
          </Link>
        </li>
        <li>
          <Link href="/alati/stopwatch" className="text-indigo-600 hover:underline">
            Stopwatch
          </Link>
        </li>
      </ul>
    </section>
  );
}
