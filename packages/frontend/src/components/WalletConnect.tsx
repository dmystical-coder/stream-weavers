'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

/**
 * Wallet connection component with Celo-optimized wallet list
 */
export function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} className="connect-button">
                    <span className="connect-icon">🔗</span>
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className="connect-button wrong-network">
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="wallet-connected">
                  <button
                    onClick={openChainModal}
                    className="chain-button"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="chain-icon"
                      />
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} className="account-button">
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
