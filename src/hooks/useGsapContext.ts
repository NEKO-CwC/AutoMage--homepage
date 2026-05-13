import { useRef, useEffect } from 'react';
import { safeContext } from '@/lib/gsap';

export function useGsapContext(
  callback: () => void | (() => void),
  deps?: readonly unknown[]
) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) return;
    const ctx = safeContext(callback, scope.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ? [...deps] : []);

  return scope;
}
