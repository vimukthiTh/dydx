import {
  BECH32_PREFIX,
  CompositeClient,
  IndexerClient,
  LocalWallet,
  SubaccountInfo,
} from '@dydxprotocol/v4-client-js';
import { create } from 'zustand';

import { DEFAULT_NETWORK_KEY, getNetworkDescriptor } from '../config/networks';
import type { SupportedNetworkKey } from '../config/networks';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ConnectParams {
  mnemonic: string;
  subaccountNumber: number;
  networkKey?: SupportedNetworkKey;
}

interface DydxState {
  networkKey: SupportedNetworkKey;
  status: ConnectionStatus;
  indexerClient: IndexerClient;
  compositeClient?: CompositeClient;
  localWallet?: LocalWallet;
  subaccount?: SubaccountInfo;
  walletAddress?: string;
  subaccountNumber?: number;
  lastError?: string;
  setNetwork: (network: SupportedNetworkKey) => void;
  connect: (params: ConnectParams) => Promise<void>;
  disconnect: () => void;
}

const buildIndexerClient = (networkKey: SupportedNetworkKey): IndexerClient => {
  const descriptor = getNetworkDescriptor(networkKey);
  const network = descriptor.createNetwork();
  return new IndexerClient(network.indexerConfig);
};

export const useDydxStore = create<DydxState>((set, get) => ({
  networkKey: DEFAULT_NETWORK_KEY,
  status: 'disconnected',
  indexerClient: buildIndexerClient(DEFAULT_NETWORK_KEY),
  setNetwork: (networkKey) => {
    set({
      networkKey,
      indexerClient: buildIndexerClient(networkKey),
      status: 'disconnected',
      compositeClient: undefined,
      localWallet: undefined,
      subaccount: undefined,
      walletAddress: undefined,
      subaccountNumber: undefined,
      lastError: undefined,
    });
  },
  connect: async ({ mnemonic, subaccountNumber, networkKey }) => {
    const targetNetworkKey = networkKey ?? get().networkKey;
    set({
      status: 'connecting',
      lastError: undefined,
      networkKey: targetNetworkKey,
      indexerClient:
        targetNetworkKey === get().networkKey ? get().indexerClient : buildIndexerClient(targetNetworkKey),
    });

    try {
      const descriptor = getNetworkDescriptor(targetNetworkKey);
      const network = descriptor.createNetwork();
      const [client, wallet] = await Promise.all([
        CompositeClient.connect(network),
        LocalWallet.fromMnemonic(mnemonic.trim(), BECH32_PREFIX),
      ]);
      const subaccount = SubaccountInfo.forLocalWallet(wallet, subaccountNumber);

      set({
        status: 'connected',
        compositeClient: client,
        localWallet: wallet,
        subaccount,
        walletAddress: wallet.address,
        subaccountNumber,
        lastError: undefined,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to connect to dYdX. Please try again.';
      console.error(message);
      set({
        status: 'error',
        compositeClient: undefined,
        localWallet: undefined,
        subaccount: undefined,
        walletAddress: undefined,
        subaccountNumber: undefined,
        lastError: message,
      });
    }
  },
  disconnect: () => {
    set((state) => ({
      status: 'disconnected',
      compositeClient: undefined,
      localWallet: undefined,
      subaccount: undefined,
      walletAddress: undefined,
      subaccountNumber: undefined,
      lastError: undefined,
      indexerClient: buildIndexerClient(state.networkKey),
    }));
  },
}));
