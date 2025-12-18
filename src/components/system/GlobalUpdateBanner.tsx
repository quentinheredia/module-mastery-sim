import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const CURRENT_BUILD = import.meta.env.VITE_BUILD_ID;

export const GlobalUpdateBanner = () => {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    if (!CURRENT_BUILD) return;

    let cancelled = false;

    const checkForUpdate = async () => {
      try {
        const res = await fetch("/build.json", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data: { build?: string } = await res.json();

        if (!cancelled && data.build && data.build !== CURRENT_BUILD) {
          setHasUpdate(true);
        }
      } catch {
        // Silent fail – banner is non-critical
      }
    };

    // Initial check
    checkForUpdate();

    // Re-check every 60s (safe for GitHub Pages)
    const interval = setInterval(checkForUpdate, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!hasUpdate) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/90 px-5 py-3 shadow-lg backdrop-blur">
        <RefreshCcw className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-medium">
          A new version of the site is available
        </span>
        <Button size="sm" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    </div>
  );
};
