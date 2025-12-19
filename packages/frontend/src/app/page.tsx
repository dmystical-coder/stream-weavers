'use client';

import { StreamBalance, StreamCard, WalletConnect } from '@/components';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          StreamWeaver
        </div>
        <WalletConnect />
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!isConnected ? (
          <div className="hero">
            <h1>Real-Time Payment Streams</h1>
            <p>
              Watch your earnings flow in real-time. StreamWeaver brings 
              continuous payment visibility to the Celo ecosystem.
            </p>
            <WalletConnect />
          </div>
        ) : (
          <>
            <StreamBalance />
            <StreamCard />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Powered by <a href="https://celo.org" target="_blank" rel="noopener noreferrer">Celo</a> • 
          Contract: <code>0x1722...c282</code>
        </p>
      </footer>
    </div>
  );
}
