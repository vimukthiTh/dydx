import { useQuery } from '@tanstack/react-query';

import {
  getAssetPositions,
  getOrderbook,
  getPerpetualMarkets,
  getPerpetualPositions,
  getRecentTrades,
} from '../api/dydx';
import { useDydxStore } from '../store/dydxStore';

export const useMarkets = (market?: string) => {
  const indexerClient = useDydxStore((state) => state.indexerClient);
  const networkKey = useDydxStore((state) => state.networkKey);

  return useQuery({
    queryKey: ['markets', networkKey, market ?? 'all'],
    queryFn: () => getPerpetualMarkets(indexerClient, market),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
};

export const useOrderbook = (market: string, enabled = true) => {
  const indexerClient = useDydxStore((state) => state.indexerClient);
  const networkKey = useDydxStore((state) => state.networkKey);

  return useQuery({
    queryKey: ['orderbook', networkKey, market],
    queryFn: () => getOrderbook(indexerClient, market),
    enabled: enabled && Boolean(market),
    refetchInterval: 2_500,
  });
};

export const useTrades = (market: string, enabled = true) => {
  const indexerClient = useDydxStore((state) => state.indexerClient);
  const networkKey = useDydxStore((state) => state.networkKey);

  return useQuery({
    queryKey: ['trades', networkKey, market],
    queryFn: () => getRecentTrades(indexerClient, market),
    enabled: enabled && Boolean(market),
    refetchInterval: 5_000,
  });
};

export const usePositions = () => {
  const indexerClient = useDydxStore((state) => state.indexerClient);
  const walletAddress = useDydxStore((state) => state.walletAddress);
  const subaccountNumber = useDydxStore((state) => state.subaccountNumber);
  const status = useDydxStore((state) => state.status);

  return useQuery({
    queryKey: ['positions', walletAddress, subaccountNumber],
    queryFn: async () => {
      if (!walletAddress || subaccountNumber === undefined) {
        throw new Error('Wallet not connected');
      }
      const [perpetualPositions, assetPositions] = await Promise.all([
        getPerpetualPositions(indexerClient, walletAddress, subaccountNumber),
        getAssetPositions(indexerClient, walletAddress, subaccountNumber),
      ]);

      return {
        perpetualPositions,
        assetPositions,
      };
    },
    enabled: status === 'connected' && Boolean(walletAddress) && subaccountNumber !== undefined,
    refetchInterval: 10_000,
  });
};
