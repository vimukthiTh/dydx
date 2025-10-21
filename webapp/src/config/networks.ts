import { Network } from '@dydxprotocol/v4-client-js';

export type SupportedNetworkKey = 'mainnet' | 'testnet';

export interface NetworkDescriptor {
  key: SupportedNetworkKey;
  label: string;
  description: string;
  restEndpoint: string;
  websocketEndpoint: string;
  createNetwork: () => Network;
}

export const NETWORKS: Record<SupportedNetworkKey, NetworkDescriptor> = {
  mainnet: {
    key: 'mainnet',
    label: 'Mainnet',
    description: 'dYdX Chain mainnet (production deployment).',
    restEndpoint: 'https://indexer.dydx.trade',
    websocketEndpoint: 'wss://indexer.dydx.trade/v4/ws',
    createNetwork: () => Network.mainnet(),
  },
  testnet: {
    key: 'testnet',
    label: 'Testnet',
    description: 'dYdX public testnet (reset intermittently).',
    restEndpoint: 'https://indexer.v4testnet.dydx.exchange',
    websocketEndpoint: 'wss://indexer.v4testnet.dydx.exchange/v4/ws',
    createNetwork: () => Network.testnet(),
  },
};

export const DEFAULT_NETWORK_KEY: SupportedNetworkKey = 'mainnet';

export const getNetworkDescriptor = (key: SupportedNetworkKey): NetworkDescriptor => NETWORKS[key];

