"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";

// BackgroundLayer renders gentle animated shapes behind the app.
// It respects prefers-reduced-motion and can be toggled off via props.
type BackgroundLayerProps = {
  enabled?: boolean;
  children: ReactNode;
};

export default function BackgroundLayer({ enabled = true, children }: BackgroundLayerProps) {
  const [isReduced, setIsReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(media.matches);
    const onChange = () => setIsReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const show = enabled && !isReduced;
  // Memoize indices so positions are stable across renders
  const shapes = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  return (
    <div className="relative min-h-dvh">
      {show && (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {shapes.map((i) => (
            <m.div
              key={i}
              className="absolute rounded-full opacity-10 bg-emerald-500/50 blur-3xl"
              initial={{ opacity: 0, scale: 0.9 }}
              // Small up/down motion loop; arrays in Framer create keyframe animations
              animate={{ opacity: 0.15, scale: 1, y: [0, 10, 0] }}
              transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 120 + (i % 5) * 40,
                height: 120 + (i % 5) * 40,
                top: `${(i * 13) % 90}%`,
                left: `${(i * 23) % 90}%`,
              }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}


