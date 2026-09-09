import { useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Google AdSense display slot. Renders a real <ins class="adsbygoogle"> unit
 * once VITE_ADSENSE_CLIENT (e.g. "ca-pub-XXXXXXXXXXXXXXXX") is configured via
 * the project's Keys/API keys UI. The AdSense script is injected exactly once
 * for the whole app. Until then a neutral placeholder is shown so the layout
 * can be reviewed without a live publisher account.
 */
export function AdSlot({
  slot,
  className,
  minHeight = 100,
  label,
}: {
  slot: string;
  className?: string;
  minHeight?: number;
  label?: string;
}) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

  useEffect(() => {
    if (!client) return;

    if (!document.querySelector("script[data-adsense]")) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-adsense", "true");
      document.head.appendChild(script);
    }

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // AdSense push can throw if the script failed to load; fail silently.
    }
  }, [client]);

  if (!client) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center border border-dashed border-border/70",
          className,
        )}
        style={{ minHeight }}
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {label ?? "Advertisement"}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={{ minHeight }}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
