"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window { gtag?: (...args: any[]) => void }
}

export default function GAReporter({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag || !GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}
