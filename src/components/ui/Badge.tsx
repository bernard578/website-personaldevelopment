// src/components/Badge.tsx
export default function Badge({ children }: {children: React.ReactNode}) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
      {children}
    </span>
  )
}