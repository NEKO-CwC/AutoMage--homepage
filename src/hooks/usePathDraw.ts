import { RefObject, useEffect } from 'react';
import { gsap, ScrollTrigger, safeContext } from '@/lib/gsap';

export interface PathDrawConfig {
  /** CSS selector within the SVG container to target paths */
  pathSelector: string;
  /** Duration of the draw animation in seconds */
  duration?: number;
  /** GSAP easing */
  ease?: string;
  /** Stagger between multiple paths in seconds */
  stagger?: number;
  /** ScrollTrigger configuration */
  scrollTrigger?: {
    /** CSS selector for trigger element (default: container parent) */
    trigger?: string;
    /** default 'top 80%' */
    start?: string;
    end?: string;
    /** default false (fire once) */
    scrub?: boolean | number;
  };
  /** If true, play once on enter and don't reverse */
  once?: boolean;
}

function safeGetLength(el: SVGGeometryElement): number {
  try {
    return el.getTotalLength();
  } catch {
    return 0;
  }
}

export function usePathDraw(
  containerRef: RefObject<HTMLElement | null>,
  config: PathDrawConfig,
  deps?: readonly unknown[]
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = safeContext(() => {
      // reduced-motion guard: skip animation, show final state immediately
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const allEls = Array.from(container.querySelectorAll<SVGElement>(config.pathSelector));
      // Filter to geometry elements that support getTotalLength
      const paths = allEls.filter(
        (el): el is SVGGeometryElement =>
          typeof (el as SVGGeometryElement).getTotalLength === 'function',
      );
      if (paths.length === 0) return;

      const duration = config.duration ?? 1.0;
      const ease = config.ease ?? 'power2.inOut';
      const stagger = config.stagger ?? 0.1;
      const once = config.once ?? true;

      if (prefersReducedMotion) {
        paths.forEach((path) => {
          const length = safeGetLength(path);
          if (length > 0) {
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
          }
        });
        return;
      }

      // Build ScrollTrigger config if provided
      let stConfig: ScrollTrigger.Vars | undefined;
      if (config.scrollTrigger) {
        stConfig = {
          trigger: config.scrollTrigger.trigger
            ? container.closest(config.scrollTrigger.trigger) ?? container
            : container,
          start: config.scrollTrigger.start ?? 'top 80%',
          end: config.scrollTrigger.end,
          scrub: config.scrollTrigger.scrub ?? false,
          once: once,
        };
      }

      // Filter to only paths that have valid length (are rendered)
      const validPaths = paths.filter((path) => {
        const length = safeGetLength(path);
        if (length > 0) {
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          return true;
        }
        return false;
      });

      if (validPaths.length === 0) return;

      if (stagger > 0 && validPaths.length > 1) {
        gsap.to(validPaths, {
          strokeDashoffset: 0,
          duration,
          ease,
          stagger,
          scrollTrigger: stConfig,
        });
      } else {
        validPaths.forEach((path) => {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration,
            ease,
            scrollTrigger: stConfig,
          });
        });
      }
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ? [...deps] : []);
}
