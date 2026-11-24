import { useEffect, useState } from "react";
import type { RefObject } from "react";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once the element has scrolled into view (never flips back). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  threshold = 0.3,
) {
  const [inView, setInView] = useState(
    () => prefersReducedMotion() || !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const element = ref.current;
    if (inView || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, inView]);

  return inView;
}
