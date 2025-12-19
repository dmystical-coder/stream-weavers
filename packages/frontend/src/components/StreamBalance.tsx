'use client';

import { useUnlockedBalance } from '@/hooks';
import { useEffect, useState } from 'react';

/**
 * Live-ticking balance counter component
 * Displays streaming balance with smooth animation effect
 */
export function StreamBalance() {
  const { displayBalance, isLoading } = useUnlockedBalance();
  const [prevBalance, setPrevBalance] = useState(displayBalance);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    if (parseFloat(displayBalance) > parseFloat(prevBalance)) {
      setIsIncreasing(true);
      const timer = setTimeout(() => setIsIncreasing(false), 200);
      return () => clearTimeout(timer);
    }
    setPrevBalance(displayBalance);
  }, [displayBalance, prevBalance]);

  if (isLoading) {
    return (
      <div className="balance-container">
        <div className="balance-label">Available Balance</div>
        <div className="balance-value animate-pulse">Loading...</div>
      </div>
    );
  }

  // Format balance with streaming effect
  const parts = displayBalance.split('.');
  const wholePart = parts[0] || '0';
  const decimalPart = (parts[1] || '00').slice(0, 8);

  return (
    <div className="balance-container">
      <div className="balance-label">
        <span className="streaming-dot" />
        Live Streaming Balance
      </div>
      <div className={`balance-value ${isIncreasing ? 'balance-pulse' : ''}`}>
        <span className="balance-whole">{wholePart}</span>
        <span className="balance-decimal">.{decimalPart}</span>
        <span className="balance-currency">CELO</span>
      </div>
      <div className="balance-subtext">
        Funds are continuously unlocking
      </div>
    </div>
  );
}
