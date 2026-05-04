import { useEffect, useRef, type MutableRefObject } from 'react';

type UseIntersectionObserverOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useIntersectionObserver<T extends Element>(
  callback: () => void,
  options?: UseIntersectionObserverOptions
): MutableRefObject<T | null> {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [callback, options]);

  return elementRef;
}
