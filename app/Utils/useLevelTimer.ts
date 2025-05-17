import { useEffect, useRef, useState } from "react";

export function useLevelTimer(delay: number = 30000) {
  const [level, setLevel] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setLevel((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay]);

  return level;
}
