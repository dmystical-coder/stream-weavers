import { http, createConfig } from 'wagmi';
import { celo } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// RainbowKit configuration with Celo chain
export const config = getDefaultConfig({
  appName: 'StreamWeaver Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [celo],
  transports: {
    [celo.id]: http('https://forno.celo.org'),
  },
  ssr: true,
});

export { celo };
