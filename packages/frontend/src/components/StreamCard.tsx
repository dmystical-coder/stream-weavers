'use client';

import { useStreamDetails, useUnlockedBalance } from '@/hooks';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { parseEther, formatEther } from 'viem';
import { CELO_STREAMING_ADDRESS, CELO_STREAMING_ABI } from '@/config/contracts';

/**
 * Stream details card with progress visualization and withdraw button
 */
export function StreamCard() {
  const { streamDetails, isLoading } = useStreamDetails();
  const { balance } = useUnlockedBalance();
  const { isConnected } = useAccount();
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  if (!isConnected) {
    return (
      <div className="stream-card">
        <div className="stream-card-empty">
          <div className="empty-icon">🔗</div>
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to view your streaming balance</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="stream-card">
        <div className="stream-card-loading">
          <div className="loading-spinner" />
          <p>Loading stream data...</p>
        </div>
      </div>
    );
  }

  if (!streamDetails?.hasStream) {
    return (
      <div className="stream-card">
        <div className="stream-card-empty">
          <div className="empty-icon">📭</div>
          <h3>No Active Stream</h3>
          <p>You don&apos;t have an active payment stream on this contract</p>
        </div>
      </div>
    );
  }

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    
    writeContract({
      address: CELO_STREAMING_ADDRESS,
      abi: CELO_STREAMING_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    });
  };

  const handleMaxWithdraw = () => {
    setWithdrawAmount(formatEther(balance));
  };

  return (
    <div className="stream-card">
      <div className="stream-card-header">
        <h2>Your Stream</h2>
        <span className={`stream-badge ${streamDetails.isNativeCelo ? 'badge-celo' : 'badge-token'}`}>
          {streamDetails.isNativeCelo ? 'CELO' : 'ERC20'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="stream-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${streamDetails.progressPercent}%` }}
          />
        </div>
        <div className="progress-labels">
          <span>{streamDetails.progressPercent.toFixed(1)}% unlocked</span>
          <span>{streamDetails.durationDays.toFixed(1)} days total</span>
        </div>
      </div>

      {/* Stream Details */}
      <div className="stream-details">
        <div className="detail-row">
          <span className="detail-label">Total Cap</span>
          <span className="detail-value">{streamDetails.formattedCap} CELO</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Duration</span>
          <span className="detail-value">{streamDetails.durationDays.toFixed(2)} days</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Available Now</span>
          <span className="detail-value highlight">{formatEther(balance)} CELO</span>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="stream-withdraw">
        <div className="withdraw-input-group">
          <input
            type="number"
            placeholder="Amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="withdraw-input"
            step="0.001"
            min="0"
          />
          <button onClick={handleMaxWithdraw} className="max-button">
            MAX
          </button>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={isPending || isConfirming || !withdrawAmount}
          className="withdraw-button"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Withdraw'}
        </button>
        {isSuccess && (
          <div className="success-message">
            ✅ Withdrawal successful!
          </div>
        )}
      </div>
    </div>
  );
}
