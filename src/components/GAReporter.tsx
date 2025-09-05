"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type GtagCommand = "config" | "event" | "js";

declare global {
  interface Window {
    gtag?: (
      command: GtagCommand,
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function isBlockedHost() {
  if (typeof window === "undefined") return false; // SSR guard
  const h = window.location.hostname;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "::1" ||
    h.endsWith(".local")
  );
}

export default function GAReporter({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag || !GA_MEASUREMENT_ID) return;
    if (isBlockedHost()) return; // 👈 don’t send hits on localhost/dev

    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}
