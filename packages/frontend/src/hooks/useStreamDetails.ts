'use client';

import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CELO_STREAMING_ADDRESS, CELO_STREAMING_ABI } from '@/config/contracts';

export interface StreamDetails {
  cap: bigint;
  unlockDuration: bigint;
  lastWithdrawal: bigint;
  tokenAddress: `0x${string}`;
  formattedCap: string;
  durationDays: number;
  isNativeCelo: boolean;
  hasStream: boolean;
  startTime: Date;
  endTime: Date;
  progressPercent: number;
}

/**
 * getStreamDetails helper - fetches all metadata for a specific address in one call
 */
export function useStreamDetails(userAddress?: `0x${string}`) {
  const { address: connectedAddress, isConnected } = useAccount();
  const address = userAddress || connectedAddress;

  const { data, isLoading, error, refetch } = useReadContract({
    address: CELO_STREAMING_ADDRESS,
    abi: CELO_STREAMING_ABI,
    functionName: 'streams',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Parse stream data
  const streamDetails: StreamDetails | null = data ? (() => {
    const [cap, unlockDuration, lastWithdrawal, tokenAddress] = data as [bigint, bigint, bigint, `0x${string}`];
    
    const hasStream = cap > 0n;
    const startTime = new Date(Number(lastWithdrawal) * 1000);
    const endTime = new Date((Number(lastWithdrawal) + Number(unlockDuration)) * 1000);
    
    // Calculate progress
    const now = Date.now() / 1000;
    const elapsed = now - Number(lastWithdrawal);
    const progressPercent = hasStream 
      ? Math.min(100, (elapsed / Number(unlockDuration)) * 100)
      : 0;

    return {
      cap,
      unlockDuration,
      lastWithdrawal,
      tokenAddress,
      formattedCap: formatEther(cap),
      durationDays: Number(unlockDuration) / 86400,
      isNativeCelo: tokenAddress === '0x0000000000000000000000000000000000000000',
      hasStream,
      startTime,
      endTime,
      progressPercent,
    };
  })() : null;

  return {
    streamDetails,
    isLoading,
    error,
    refetch,
    isConnected,
    address,
  };
}
