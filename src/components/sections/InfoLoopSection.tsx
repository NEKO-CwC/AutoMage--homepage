'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, safeContext } from '@/lib/gsap';

/* ── Loop Nodes ── */
interface LoopNodeData {
  id: string;
  label: string;
  icon: string;
  inspectorTitle: string;
  inspectorText: string;
  angle: number;
}

const LOOP_NODES: LoopNodeData[] = [
  { id: 'staff', label: 'Staff', icon: '👤', inspectorTitle: 'Staff 提交日报', inspectorText: '今天提交了 23 条一线记录', angle: 0 },
  { id: 'ai', label: 'AI', icon: '🤖', inspectorTitle: 'AI 自动汇总', inspectorText: '识别 4 个风险、2 个依赖、1 个异常', angle: 60 },
  { id: 'manager', label: 'Manager', icon: '👁', inspectorTitle: 'Manager 审阅确认', inspectorText: '审阅通过 3 条，标记 1 条需补充', angle: 120 },
  { id: 'dream', label: 'Dream', icon: '💡', inspectorTitle: 'Dream 生成草案', inspectorText: '生成 A/B 两个决策选项', angle: 180 },
  { id: 'boss', label: 'Boss', icon: '✓', inspectorTitle: 'Boss 确认决策', inspectorText: '选择 B，并设定优先级', angle: 240 },
  { id: 'task', label: 'Task', icon: '→', inspectorTitle: '任务自动回流', inspectorText: '自动生成 5 个任务，分配到 3 人', angle: 300 },
];

const LOOP_RADIUS = 180;
const CENTER = 220;
const SVG_SIZE = 440;

/* ── Helpers ── */
function nodePosition(angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + LOOP_RADIUS * Math.cos(rad),
    y: CENTER + LOOP_RADIUS * Math.sin(rad),
  };
}

function buildCirclePath(): string {
  // SVG arc: full circle as two semicircles
  const r = LOOP_RADIUS;
  return `M ${CENTER} ${CENTER - r} A ${r} ${r} 0 1 1 ${CENTER - 0.001} ${CENTER - r}`;
}

const CIRCLE_PATH_D = buildCirclePath();

/* ── Component ── */
export default function InfoLoopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const trail1Ref = useRef<SVGCircleElement>(null);
  const trail2Ref = useRef<SVGCircleElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeGlowRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const iconRefs = useRef<(SVGGElement | null)[]>([]);
  const loopBackRef = useRef<SVGPathElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // ── Scroll-driven animation ──
  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const reduced = prefersReducedMotion();
    const ctx = safeContext(() => {
      if (reduced) return;

      const trailEls = [trail1Ref.current, trail2Ref.current].filter(Boolean) as SVGCircleElement[];
      const PARTICLE_DURATION = 6;

      // Place a circle element at a progress fraction (0–1 → 0°–360°)
      const placeAtProgress = (el: SVGCircleElement, p: number) => {
        const angleDeg = Math.min(1, Math.max(0, p)) * 360;
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        el.setAttribute('cx', String(CENTER + LOOP_RADIUS * Math.cos(rad)));
        el.setAttribute('cy', String(CENTER + LOOP_RADIUS * Math.sin(rad)));
      };

      // Pin the section — scrub: true for instant scroll→progress mapping
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          scrub: true,
          start: 'top top',
          end: '+=2000',
        },
      });

      // Initialize particle + trail positions (React doesn't manage cx/cy/opacity)
      if (particleRef.current) {
        const startRad = ((-90) * Math.PI) / 180;
        const startX = CENTER + LOOP_RADIUS * Math.cos(startRad);
        const startY = CENTER + LOOP_RADIUS * Math.sin(startRad);
        [particleRef.current, ...trailEls].forEach((el) => {
          el.setAttribute('cx', String(startX));
          el.setAttribute('cy', String(startY));
          el.setAttribute('opacity', '0');
        });
      }

      // Drive particle position + opacity via rAF + scroll listener
      // (gsap.ticker is broken in Turbopack, eventCallback doesn't fire during scrub)
      let rafId = 0;
      const updateParticle = () => {
        rafId = 0;
        if (!particleRef.current) return;
        const scrubP = tl.progress(); // 0–1 from ScrollTrigger
        const pTime = scrubP * (tl.duration() || 7);
        const particleP = Math.min(1, pTime / PARTICLE_DURATION);

        // Position
        placeAtProgress(particleRef.current, particleP);
        trailEls.forEach((trail, i) => {
          placeAtProgress(trail, Math.max(0, particleP - (i + 1) * 0.02));
        });

        // Opacity: fade in during first 5%, full during middle, fade out during last 5%
        const fadeIn = Math.min(1, scrubP / 0.05);
        const fadeOut = Math.min(1, (1 - scrubP) / 0.05);
        const opacity = Math.min(fadeIn, fadeOut);
        particleRef.current.setAttribute('opacity', String(opacity));
        trailEls.forEach((trail, i) => {
          trail.setAttribute('opacity', String(opacity * (0.3 - i * 0.1)));
        });
      };
      const scheduleUpdate = () => {
        if (!rafId) rafId = requestAnimationFrame(updateParticle);
      };
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      // Initial position
      scheduleUpdate();

      // Node activation based on progress
      const nodeCount = LOOP_NODES.length;
      for (let i = 0; i < nodeCount; i++) {
        const startTime = (i / nodeCount) * 6;
        const endTime = ((i + 1) / nodeCount) * 6;

        // Node becomes active
        tl.call(
          () => setActiveIndex(i),
          undefined,
          startTime,
        );

        // Animate node size
        if (nodeRefs.current[i]) {
          tl.to(
            nodeRefs.current[i],
            { attr: { r: 20 }, duration: 0.3, ease: 'power2.out' },
            startTime,
          );
          if (i > 0) {
            tl.to(
              nodeRefs.current[i - 1],
              { attr: { r: 14 }, duration: 0.3, ease: 'power2.out' },
              startTime,
            );
          }
        }

        // Glow pulse
        if (nodeGlowRefs.current[i]) {
          tl.fromTo(
            nodeGlowRefs.current[i],
            { attr: { r: 20 }, opacity: 0.4 },
            { attr: { r: 28 }, opacity: 0, duration: 0.6, ease: 'power2.out' },
            startTime,
          );
        }

        // Label opacity
        if (labelRefs.current[i]) {
          tl.to(labelRefs.current[i], { opacity: 1, duration: 0.3 }, startTime);
          if (i > 0 && labelRefs.current[i - 1]) {
            tl.to(labelRefs.current[i - 1], { opacity: 0.4, duration: 0.3 }, startTime);
          }
        }
      }

      // Celebration at completion
      tl.call(() => setIsComplete(true), undefined, 6);

      // All nodes flash
      nodeRefs.current.forEach((node) => {
        if (!node) return;
        tl.to(node, { attr: { r: 22 }, duration: 0.15, yoyo: true, repeat: 1 }, 6);
      });

      // Loop-back path draws
      if (loopBackRef.current) {
        const len = loopBackRef.current.getTotalLength();
        gsap.set(loopBackRef.current, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(loopBackRef.current, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 6.2);
      }

      // Particle fades out at end
      if (particleRef.current) {
        tl.to(particleRef.current, { opacity: 0, duration: 0.3 }, 6.8);
      }

      // Clean up on unmount
      return () => {
        window.removeEventListener('scroll', scheduleUpdate);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ── Inspector cross-fade ──
  useEffect(() => {
    if (!inspectorRef.current) return;
    const reduced = prefersReducedMotion();
    if (reduced) return;

    gsap.fromTo(
      inspectorRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
    );
  }, [activeIndex, prefersReducedMotion]);

  const currentNode = LOOP_NODES[activeIndex];

  return (
    <section
      id="section-loop"
      ref={sectionRef}
      aria-label="组织信息回路模拟器"
      style={{
        background: 'var(--color-surface-deep)',
        paddingTop: 'calc(var(--space-section) + 60px)',
        paddingBottom: 'var(--space-section)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        {/* Title */}
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-text-on-dark)',
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          信息如何在你的组织中流动
        </h2>
        <p
          className="text-center"
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-on-dark-muted)',
            marginBottom: 48,
          }}
        >
          六个节点，一个闭环
        </p>

        {/* Desktop: Circular path + Inspector */}
        <div className="hidden md:flex items-center justify-center gap-12">
          {/* SVG Loop */}
          <div style={{ width: SVG_SIZE, height: SVG_SIZE, flexShrink: 0 }}>
            <svg
              ref={svgRef}
              width={SVG_SIZE}
              height={SVG_SIZE}
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              fill="none"
              style={{ overflow: 'visible' }}
            >
              {/* Background circle */}
              <path
                d={CIRCLE_PATH_D}
                stroke="var(--color-loop-path)"
                strokeWidth={2}
                fill="none"
                opacity={0.3}
              />

              {/* Loop-back dashed path (draws on completion) */}
              <path
                ref={loopBackRef}
                d={CIRCLE_PATH_D}
                stroke="var(--color-loop-path-active)"
                strokeWidth={2}
                fill="none"
                strokeDasharray="6 4"
                opacity={0.5}
              />

              {/* Motion path (invisible, for particle tracking) */}
              <path
                d={CIRCLE_PATH_D}
                fill="none"
                stroke="transparent"
                data-loop-circle
              />

              {/* Nodes */}
              {LOOP_NODES.map((node, i) => {
                const pos = nodePosition(node.angle);
                return (
                  <g key={node.id}>
                    {/* Glow ring */}
                    <circle
                      ref={(el) => { nodeGlowRefs.current[i] = el; }}
                      cx={pos.x}
                      cy={pos.y}
                      r={20}
                      fill="var(--color-loop-node-glow)"
                      opacity={0}
                    />

                    {/* Node circle */}
                    <circle
                      ref={(el) => { nodeRefs.current[i] = el; }}
                      cx={pos.x}
                      cy={pos.y}
                      r={14}
                      fill={i === activeIndex ? 'var(--color-loop-node-active)' : 'var(--color-loop-node-inactive)'}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={1}
                    />

                    {/* Icon */}
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={14}
                      fill="var(--color-text-on-dark)"
                      className="pointer-events-none select-none"
                    >
                      {node.icon}
                    </text>

                    {/* Label */}
                    <text
                      ref={(el) => { labelRefs.current[i] = el; }}
                      x={pos.x}
                      y={pos.y + 30}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={i === activeIndex ? 600 : 400}
                      fill="var(--color-text-on-dark)"
                      opacity={i === 0 ? 1 : 0.4}
                      className="pointer-events-none select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}

              {/* Light particle — cx/cy/opacity managed by GSAP (not React) to avoid re-render resets */}
              <circle
                ref={particleRef}
                r={6}
                fill="var(--color-loop-particle)"
              />

              {/* Trail circles — same: GSAP-managed */}
              <circle
                ref={trail1Ref}
                r={4}
                fill="var(--color-loop-particle)"
              />
              <circle
                ref={trail2Ref}
                r={2}
                fill="var(--color-loop-particle)"
              />
            </svg>
          </div>

          {/* Inspector Panel */}
          <div
            ref={inspectorRef}
            role="status"
            aria-live="polite"
            style={{
              width: 320,
              background: 'var(--color-surface-dark)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              flexShrink: 0,
            }}
          >
            {/* Current node header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-brand-accent)',
                  opacity: 0.15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                {currentNode.icon}
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-on-dark)' }}>
                {currentNode.inspectorTitle}
              </span>
            </div>

            {/* Data display */}
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-on-dark-muted)', lineHeight: 1.65, marginBottom: 24 }}>
              {currentNode.inspectorText}
            </p>

            {/* Mini progress dots */}
            <div className="flex items-center gap-2">
              {LOOP_NODES.map((node, i) => (
                <div
                  key={node.id}
                  style={{
                    width: i === activeIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-full)',
                    background: i === activeIndex
                      ? 'var(--color-brand-accent)'
                      : i < activeIndex
                        ? 'var(--color-loop-node-active)'
                        : 'rgba(255,255,255,0.15)',
                    opacity: i < activeIndex ? 0.6 : 1,
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
            </div>

            {/* Completion message */}
            {isComplete && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-signal-success)',
                }}
              >
                闭环完成 — 信息从一线回到一线
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Vertical flow */}
        <div className="md:hidden flex flex-col items-center gap-6">
          {LOOP_NODES.map((node, i) => {
            const isActive = i === activeIndex;
            return (
              <div key={node.id} className="flex items-center gap-4 w-full" style={{ maxWidth: 360 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: isActive ? 'var(--color-loop-node-active)' : 'var(--color-surface-dark)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                    boxShadow: isActive ? 'var(--shadow-node-glow)' : 'none',
                    transition: 'all 300ms ease',
                  }}
                  role="img"
                  aria-label={`${node.label} — ${node.inspectorText}`}
                >
                  {node.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-on-dark)' }}>
                    {node.inspectorTitle}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-on-dark-muted)' }}>
                    {node.inspectorText}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Connecting line */}
          <svg width="2" height={LOOP_NODES.length * 70} className="absolute left-[23px] top-0 pointer-events-none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--color-loop-path)" strokeWidth={2} opacity={0.3} />
          </svg>
        </div>
      </div>
    </section>
  );
}
