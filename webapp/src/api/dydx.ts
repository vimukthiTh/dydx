import { IndexerClient } from '@dydxprotocol/v4-client-js';

import type {
  AssetPositionsResponse,
  OrderbookResponse,
  PerpetualMarketsResponse,
  PerpetualPositionsResponse,
  TradesResponse,
} from '../types/dydx';

export const getPerpetualMarkets = async (
  client: IndexerClient,
  market?: string,
): Promise<PerpetualMarketsResponse> => {
  const response = await client.markets.getPerpetualMarkets(market);
  return response as PerpetualMarketsResponse;
};

export const getOrderbook = async (
  client: IndexerClient,
  market: string,
): Promise<OrderbookResponse> => {
  const response = await client.markets.getPerpetualMarketOrderbook(market);
  return response as OrderbookResponse;
};

export const getRecentTrades = async (
  client: IndexerClient,
  market: string,
  limit = 50,
): Promise<TradesResponse> => {
  const response = await client.markets.getPerpetualMarketTrades(market, undefined, undefined, limit);
  return response as TradesResponse;
};

export const getPerpetualPositions = async (
  client: IndexerClient,
  address: string,
  subaccountNumber: number,
): Promise<PerpetualPositionsResponse> => {
  const response = await client.account.getSubaccountPerpetualPositions(address, subaccountNumber);
  return response as PerpetualPositionsResponse;
};

export const getAssetPositions = async (
  client: IndexerClient,
  address: string,
  subaccountNumber: number,
): Promise<AssetPositionsResponse> => {
  const response = await client.account.getSubaccountAssetPositions(address, subaccountNumber);
  return response as AssetPositionsResponse;
};
