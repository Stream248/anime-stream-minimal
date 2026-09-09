import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Banner ad for a script-tag ad network (e.g. Adsterra-style invoke.js).
 *
 * The network's snippet looks like:
 *   <script> atOptions = {...} </script>
 *   <script src="https://www.highrevenueformat.com/<KEY>/invoke.js"></script>
 *
 * invoke.js reads the global `atOptions` synchronously when it executes, so
 * only ONE banner can initialize per document. This component queues banner
 * mounts and renders each snippet inside an isolated <iframe> so every
 * placement on the page gets its own atOptions scope and can load in turn.
 */

const BANNER_KEY = "93622c268c78b525b7941e04fa67b223";
const BANNER_SRC = `https://www.highrevenueformat.com/${BANNER_KEY}/invoke.js`;

const WIDTH = 728;
const HEIGHT = 90;

// Simple FIFO so concurrent banners don't race on the shared loader.
let queue: (() => void)[] = [];
let running = false;

function runNext() {
  const next = queue.shift();
  if (!next) {
    running = false;
    return;
  }
  running = true;
  next();
}

function enqueueLoad(task: () => void) {
  queue.push(task);
  if (!running) runNext();
}

// Lets the injected script settle before releasing the next banner.
function releaseAfter(ms: number) {
  setTimeout(runNext, ms);
}

export function BannerAd({
  className,
  label = "Advertisement",
}: {
  className?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">(
    "idle",
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    enqueueLoad(() => {
      const host = containerRef.current;
      if (!host) {
        releaseAfter(200);
        return;
      }

      setState("loading");

      const iframe = document.createElement("iframe");
      iframe.width = String(WIDTH);
      iframe.height = String(HEIGHT);
      iframe.sandbox = "allow-scripts allow-popups allow-popups-to-escape-sandbox";
      iframe.style.border = "0";
      iframe.style.display = "block";

      iframe.onload = () => {
        setState("ready");
        releaseAfter(2500);
      };
      iframe.onerror = () => {
        setState("failed");
        releaseAfter(500);
      };

      host.appendChild(iframe);

      const doc = iframe.contentDocument;
      if (!doc) {
        setState("failed");
        releaseAfter(200);
        return;
      }

      doc.open();
      doc.write(
        `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">` +
          `<script>atOptions = ${JSON.stringify({
            key: BANNER_KEY,
            format: "iframe",
            height: HEIGHT,
            width: WIDTH,
            params: {},
          })};</script>` +
          `<script src="${BANNER_SRC}"></script>` +
          `</body></html>`,
      );
      doc.close();
    });
  }, []);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      {state === "failed" ? null : (
        <div
          ref={containerRef}
          style={{ width: WIDTH, height: HEIGHT }}
          aria-label={label}
        />
      )}
      {state !== "ready" && state !== "failed" && (
        <span className="absolute text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {label}
        </span>
      )}
    </div>
  );
}
