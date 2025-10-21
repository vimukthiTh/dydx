export interface PerpetualMarket {
  clobPairId: string;
  ticker: string;
  status: string;
  oraclePrice: string;
  priceChange24H: string;
  volume24H: string;
  trades24H: number;
  nextFundingRate: string;
  initialMarginFraction: string;
  maintenanceMarginFraction: string;
  openInterest: string;
  atomicResolution: number;
  quantumConversionExponent: number;
  tickSize: string;
  stepSize: string;
  stepBaseQuantums: number;
  subticksPerTick: number;
  marketType: string;
  openInterestLowerCap: string;
  openInterestUpperCap: string;
  baseOpenInterest: string;
  defaultFundingRate1H: string;
}

export interface PerpetualMarketsResponse {
  markets: Record<string, PerpetualMarket>;
}

export interface OrderbookRow {
  price: string;
  size: string;
}

export interface OrderbookResponse {
  bids: OrderbookRow[];
  asks: OrderbookRow[];
}

export interface TradeEntry {
  id: string;
  market: string;
  size: string;
  price: string;
  side: 'BUY' | 'SELL';
  createdAt: string;
}

export interface TradesResponse {
  trades: TradeEntry[];
}

export interface Candle {
  startedAt: string;
  low: string;
  high: string;
  open: string;
  close: string;
  baseTokenVolume: string;
  usdVolume: string;
  trades: number;
}

export interface CandlesResponse {
  candles: Candle[];
}

export interface PerpetualPosition {
  market: string;
  status: string;
  realizedPnl: string;
  unrealizedPnl: string;
  realizedPnl24H: string;
  netFunding: string;
  size: string;
  side: 'LONG' | 'SHORT' | 'NET';
  entryPrice: string;
  createdAt: string;
}

export interface PerpetualPositionsResponse {
  positions: PerpetualPosition[];
}

export interface AssetPosition {
  asset: string;
  balance: string;
  transferRestricted: boolean;
}

export interface AssetPositionsResponse {
  positions: AssetPosition[];
}
