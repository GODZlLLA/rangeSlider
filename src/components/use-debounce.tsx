import { useCallback, useRef } from 'react';

type Debounce = (fn: () => void) => void;

// 大量のイベントを間引いて◯◯秒後に処理させるカスタムhook
export const useDebounce = (timeout: number): Debounce => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounce: Debounce = useCallback(
    (fn) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        fn();
      }, timeout);
    },
    [timeout]
  );
  return debounce;
};