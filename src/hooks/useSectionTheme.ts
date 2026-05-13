import { useEffect } from 'react';
import { gsap, ScrollTrigger, gsapReady } from '@/lib/gsap';

export interface ThemeZone {
  /** CSS selector for the trigger section */
  triggerSelector: string;
  /** Target background color */
  color: string;
  /** ScrollTrigger start offset (default 'top bottom') */
  startOffset?: string;
  /** ScrollTrigger end offset (default 'top center') */
  endOffset?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Controls page background color transitions tied to scroll position.
 *
 * Each zone creates a ScrollTrigger that animates the body background
 * from its current color to the zone's target color as the trigger
 * section scrolls through the specified range.
 *
 * Under reduced-motion, colors snap instantly on enter/leave.
 */
export function useSectionTheme(zones: ThemeZone[]): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !gsapReady()) return;

    const reduced = prefersReducedMotion();
    const triggers: ScrollTrigger[] = [];

    for (const zone of zones) {
      const el = document.querySelector(zone.triggerSelector);
      if (!el) continue;

      const start = zone.startOffset ?? 'top bottom';
      const end = zone.endOffset ?? 'top center';

      if (reduced) {
        /* Instant snap — no scrub animation */
        const st = ScrollTrigger.create({
          trigger: el,
          start,
          end,
          onEnter: () => {
            gsap.set('body', { backgroundColor: zone.color });
          },
          onLeaveBack: () => {
            gsap.set('body', { backgroundColor: 'var(--color-surface-page)' });
          },
        });
        triggers.push(st);
      } else {
        /* Smooth scrub-linked transition */
        const tween = gsap.to('body', {
          backgroundColor: zone.color,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: true,
          },
        });
        triggers.push(tween.scrollTrigger!);
      }
    }

    return () => {
      for (const st of triggers) {
        st.kill();
      }
    };
  }, [zones]);
}
