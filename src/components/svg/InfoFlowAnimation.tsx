'use client';

import { useRef, useMemo, useEffect, useSyncExternalStore } from 'react';
import { gsap, safeContext } from '@/lib/gsap';
import { useParticles } from '@/hooks/useParticles';
import type { PathConfig } from '@/hooks/useParticles';

const CONNECTIONS = [
  { id: 'p1', path: 'M100,200 C150,200 183,120 233,120', speed: 3.2 },
  { id: 'p2', path: 'M233,120 C283,120 316,280 366,280', speed: 3.8 },
  { id: 'p3', path: 'M366,280 C416,280 450,150 500,150', speed: 3.5 },
  { id: 'p4', path: 'M500,150 C550,150 583,250 633,250', speed: 3.0 },
  { id: 'p5', path: 'M633,250 C683,250 716,180 766,180', speed: 3.4 },
] as const;

const ALL_NODES = [
  { cx: 100, cy: 200, label: 'Staff' },
  { cx: 233, cy: 120, label: 'AI' },
  { cx: 366, cy: 280, label: 'Manager' },
  { cx: 500, cy: 150, label: 'Dream' },
  { cx: 633, cy: 250, label: 'Boss' },
  { cx: 766, cy: 180, label: 'Task' },
] as const;

function useIsDesktop() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia('(min-width: 1024px)');
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  );
}

export default function InfoFlowAnimation() {
  const containerRef = useRef<SVGSVGElement>(null);
  const isDesktop = useIsDesktop();

  const connections = isDesktop ? CONNECTIONS : CONNECTIONS.slice(0, 3);
  const nodes = isDesktop ? ALL_NODES : ALL_NODES.filter((_, i) => i < 3 || i === 5);
  const viewBox = isDesktop ? '0 0 800 400' : '0 100 800 200';

  const pathConfigs = useMemo<PathConfig[]>(
    () =>
      connections.map((conn) => ({
        id: conn.id,
        pathSelector: `[data-motion-path="${conn.id}"]`,
        speed: [2.5, 4.5],
      })),
    [connections],
  );

  useParticles(containerRef, {
    paths: pathConfigs,
    particlesPerPath: isDesktop ? 2 : 1,
    radius: [3, 5],
    trailCount: isDesktop ? 1 : 0,
    trailDelay: 0.08,
    trailScale: 0.6,
    trailOpacity: 0.3,
  }, [pathConfigs, isDesktop]);

  /* Node breathing pulse */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const svg = containerRef.current;
    if (!svg) return;

    const ctx = safeContext(() => {
      const rings = svg.querySelectorAll<SVGCircleElement>('[data-node-ring]');
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          opacity: 0.35,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    }, svg);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <svg
      ref={containerRef}
      viewBox={viewBox}
      className="w-full h-auto"
      aria-hidden="true"
      role="img"
    >
      <defs>
        <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((conn) => (
        <path
          key={conn.id}
          data-motion-path={conn.id}
          d={conn.path}
          fill="none"
          stroke="#1E3A5F"
          strokeWidth={1.5}
          opacity={0.25}
        />
      ))}

      {nodes.map((node) => (
        <g key={node.label}>
          <circle
            data-node-ring
            cx={node.cx}
            cy={node.cy}
            r={10}
            fill="#1E3A5F"
            opacity={0.15}
          />
          <circle cx={node.cx} cy={node.cy} r={5} fill="#1E3A5F" opacity={0.6} />
          <text
            x={node.cx}
            y={node.cy + 26}
            fontSize={12}
            fill="#475569"
            textAnchor="middle"
            fontFamily="inherit"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
