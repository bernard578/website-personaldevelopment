"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tools = [
  { href: "/alati", label: "Svi alati", icon: "📂" },
  { href: "/alati/pomodoro", label: "Pomodoro Timer", icon: "⏳" },
  { href: "/alati/stopwatch", label: "Stopwatch", icon: "⏱️" },
  { href: "/alati/compound-interest-calculator", label: "Kalkulator složene kamate", icon: "💰" },
  { href: "/alati/pdv-kalkulator", label: "PDV kalkulator", icon: "🧮" },
];

export default function AlatiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const crumbs = getBreadcrumb(pathname);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Top bar (mobile) */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h1 className="text-xl font-semibold tracking-tight">Alati</h1>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm shadow-sm"
        >
          {open ? "Zatvori" : "Alati"} <span className="text-lg">🧰</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Sidebar */}
        <aside
          className={[
            "col-span-12 md:col-span-4 lg:col-span-3",
            "rounded-xl border border-gray-200 dark:border-gray-800",
            "bg-white/70 dark:bg-gray-900/70 backdrop-blur",
            "shadow-sm p-2 md:p-3",
            "md:sticky md:top-6",
            open ? "block" : "hidden md:block",
          ].join(" ")}
        >
          <SidebarNav pathname={pathname} />
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/50 backdrop-blur p-4 md:p-6 shadow-sm">
            {/* Breadcrumbs */}
            <nav className="mb-4 md:mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                {crumbs.map((c, i) => (
                  <li key={c.href ?? c.label} className="inline-flex items-center">
                    {c.href ? (
                      <Link href={c.href} className="hover:underline">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-200">{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && <span className="mx-2 text-gray-300">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarNav({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Navigacija alata">
      <div className="px-2 pt-2 pb-3">
        <h2 className="px-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          Alati
        </h2>
      </div>
      <ul className="space-y-1">
        {tools.map((t) => {
          const active =
            pathname === t.href || (t.href !== "/alati" && pathname?.startsWith(t.href));
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full",
                    active
                      ? "bg-white/90"
                      : "bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600",
                  ].join(" ")}
                />
                <span className="w-5 text-center">{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type Crumb = { label: string; href?: string };

function getBreadcrumb(pathname: string | null): Crumb[] {
  const base: Crumb[] = [{ label: "Alati", href: "/alati" }];
  if (!pathname || pathname === "/alati") return base;

  if (pathname.startsWith("/alati/pomodoro")) {
    return [...base, { label: "Pomodoro" }];
  }
  if (pathname.startsWith("/alati/stopwatch")) {
    return [...base, { label: "Stopwatch" }];
  }
  if (pathname.startsWith("/alati/compound-interest-calculator")) {
    return [...base, { label: "Kalkulator složene kamate" }];
  }
  if (pathname.startsWith("/alati/pdv-kalkulator")) {
    return [...base, { label: "PDV kalkulator" }];
  }

  return base;
}
