'use client';

import { useEffect, useRef } from 'react';
import { gsap, gsapReady } from '@/lib/gsap';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  const panelId = `faq-panel-${question.replace(/\s+/g, '-').slice(0, 20)}`;
  const particleRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !wasOpen.current && gsapReady()) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = particleRef.current;
      if (el && !reduced) {
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { y: 0, opacity: 1, scale: 1 },
          {
            y: 8,
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(el, { opacity: 0 });
            },
          },
        );
      }
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div style={{ borderBottom: '1px solid var(--color-border-default)', padding: '24px 0' }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between text-left"
        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
      >
        <span
          className="font-semibold"
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {question}
        </span>

        {/* Chevron + particle */}
        <span style={{ position: 'relative', flexShrink: 0, marginLeft: 16, width: 20, height: 20 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              display: 'block',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 300ms var(--ease-out)',
            }}
          >
            <polyline points="5,7 10,13 15,7" />
          </svg>
          <div
            ref={particleRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 12,
              left: 7,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-brand-accent)',
              pointerEvents: 'none',
              opacity: 0,
            }}
          />
        </span>
      </button>

      {/* grid trick: 0fr→1fr animates height to content size without max-height hack */}
      <div
        id={panelId}
        role="region"
        aria-hidden={!isOpen}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms var(--ease-out)',
          position: 'relative',
        }}
      >
        {/* Left border draw */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'var(--color-brand-accent)',
            transform: isOpen ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'top',
            transition: 'transform 300ms var(--ease-out)',
            zIndex: 1,
          }}
        />
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.65,
              paddingTop: 16,
              fontSize: '0.95rem',
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
