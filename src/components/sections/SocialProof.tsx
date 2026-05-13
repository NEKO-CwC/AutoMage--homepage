'use client';

import { useRef, useEffect } from 'react';
import { gsap, safeContext } from '@/lib/gsap';

const testimonials = [
  {
    quote: 'AutoMage 让我们的信息流转效率提升了 10 倍',
    author: '张总监，某科技公司',
  },
  {
    quote: '终于不用每天催日报了，AI 汇总比人工还准确',
    author: '李 VP，某制造业集团',
  },
  {
    quote: '决策不再靠拍脑袋，系统给了我们两个清晰的选项',
    author: '王总，某互联网公司',
  },
];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = safeContext(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cards = cardRefs.current.filter(Boolean);

      if (prefersReducedMotion) {
        cards.forEach((card) => {
          gsap.set(card, { opacity: 1, y: 0 });
        });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 30 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-social"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto" style={{ maxWidth: 1200, padding: '0 24px' }}>
        {testimonials.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            style={{
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 32,
              opacity: 0,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                fontSize: '3rem',
                lineHeight: 1,
                color: 'var(--color-brand-accent)',
                opacity: 0.2,
                userSelect: 'none',
                marginBottom: 16,
              }}
            >
              &ldquo;
            </div>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                fontSize: '1rem',
                margin: 0,
              }}
            >
              {item.quote}
            </p>
            <p
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: '0.875rem',
                marginTop: 16,
                marginBottom: 0,
              }}
            >
              {item.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
