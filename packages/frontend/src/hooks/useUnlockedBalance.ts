'use client';

import { useReadContract, useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import { CELO_STREAMING_ADDRESS, CELO_STREAMING_ABI } from '@/config/contracts';

interface StreamData {
  cap: bigint;
  unlockDuration: bigint;
  lastWithdrawal: bigint;
  tokenAddress: `0x${string}`;
}

/**
 * Hook for real-time unlocked balance with smooth interpolation
 * - Polls contract every 2 seconds
 * - Interpolates locally every 100ms for smooth "ticking" animation
 */
export function useUnlockedBalance() {
  const { address, isConnected } = useAccount();
  const [displayBalance, setDisplayBalance] = useState<string>('0.00');
  const [interpolatedBalance, setInterpolatedBalance] = useState<bigint>(0n);

  // Fetch stream data for local interpolation
  const { data: streamData } = useReadContract({
    address: CELO_STREAMING_ADDRESS,
    abi: CELO_STREAMING_ABI,
    functionName: 'streams',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 2000, // Poll every 2 seconds
    },
  });

  // Fetch actual unlocked balance for reference
  const { data: contractBalance, refetch } = useReadContract({
    address: CELO_STREAMING_ADDRESS,
    abi: CELO_STREAMING_ABI,
    functionName: 'unlockedBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 2000,
    },
  });

  // Local interpolation for smooth ticking effect
  const calculateLocalBalance = useCallback(() => {
    if (!streamData) return 0n;
    
    const [cap, unlockDuration, lastWithdrawal] = streamData as [bigint, bigint, bigint, `0x${string}`];
    
    if (cap === 0n || unlockDuration === 0n) return 0n;

    const now = BigInt(Math.floor(Date.now() / 1000));
    const timeElapsed = now - lastWithdrawal;
    
    // Formula: (cap * timeElapsed) / unlockDuration
    const unlocked = (cap * timeElapsed) / unlockDuration;
    
    // Cap at maximum
    return unlocked > cap ? cap : unlocked;
  }, [streamData]);

  // Update display every 100ms for smooth animation
  useEffect(() => {
    if (!isConnected || !streamData) {
      setDisplayBalance('0.00');
      setInterpolatedBalance(0n);
      return;
    }

    const interval = setInterval(() => {
      const balance = calculateLocalBalance();
      setInterpolatedBalance(balance);
      setDisplayBalance(formatEther(balance));
    }, 100);

    return () => clearInterval(interval);
  }, [isConnected, streamData, calculateLocalBalance]);

  // Sync with contract balance periodically
  useEffect(() => {
    if (contractBalance !== undefined) {
      // Only update if significantly different (more than 0.001 CELO)
      const diff = contractBalance > interpolatedBalance 
        ? contractBalance - interpolatedBalance 
        : interpolatedBalance - contractBalance;
      
      if (diff > 1000000000000000n) { // 0.001 CELO threshold
        setInterpolatedBalance(contractBalance);
        setDisplayBalance(formatEther(contractBalance));
      }
    }
  }, [contractBalance, interpolatedBalance]);

  return {
    balance: interpolatedBalance,
    displayBalance,
    isLoading: !streamData,
    refetch,
  };
}
