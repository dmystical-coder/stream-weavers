# Celo Wallet Integration Guide

This guide covers integration with Celo-native wallets for the StreamWeaver Dashboard.

## Supported Wallets

### 1. Valora
Valora is the primary mobile wallet for Celo. Integration is handled automatically via WalletConnect v2.

**Deep Link Format:**
```
celo://wallet/wc?uri={encoded_wc_uri}
```

**Detection:**
```typescript
const isValora = /Valora/i.test(navigator.userAgent);
```

### 2. Opera Mini
Opera Mini has built-in Web3 support for Celo.

**Detection:**
```typescript
const isOpera = /Opera/i.test(navigator.userAgent);
const hasWeb3 = typeof window.ethereum !== 'undefined';
```

### 3. MetaMask
MetaMask requires adding Celo network manually or via `wallet_addEthereumChain`.

**Celo Mainnet Config:**
```typescript
{
  chainId: '0xa4ec', // 42220
  chainName: 'Celo Mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18
  },
  rpcUrls: ['https://forno.celo.org'],
  blockExplorerUrls: ['https://celoscan.io']
}
```

## WalletConnect v2 Setup

1. Get a Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Add to `.env.local`:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## RainbowKit Configuration

The dashboard uses RainbowKit with Celo-optimized settings:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celo } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'StreamWeaver Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [celo],
});
```

## Testing Wallet Connection

1. Install Valora on mobile or MetaMask on desktop
2. Ensure wallet is connected to Celo Mainnet
3. Click "Connect Wallet" on the dashboard
4. Select your wallet from the modal
5. Approve the connection in your wallet

## Troubleshooting

**"Wrong Network" Error:**
- Switch to Celo Mainnet in your wallet

**Connection Timeout:**
- Check internet connectivity
- Try refreshing the page
- Clear browser cache

**Mobile Issues:**
- Ensure WalletConnect modal opens in-app browser
- For Valora, use the QR code scanner
