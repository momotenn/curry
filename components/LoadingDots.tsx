import { useEffect, useState } from 'react';

export default function LoadingDots() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // 0 → 1 → 2 → 3 → 0
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return <span>生成中{'.'.repeat(dotCount)}</span>;
}
