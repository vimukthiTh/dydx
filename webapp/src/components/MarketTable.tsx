import { useMemo } from 'react';

import { useMarkets } from '../hooks/useDydxData';
import { formatNumber, formatPercent, formatUsd } from '../utils/number';

interface MarketTableProps {
  selectedMarket: string;
  onSelect: (market: string) => void;
}

const MarketTable = ({ selectedMarket, onSelect }: MarketTableProps) => {
  const { data, isLoading, error } = useMarkets();

  const markets = useMemo(() => {
    if (!data?.markets) {
      return [];
    }
    return Object.entries(data.markets)
      .map(([ticker, market]) => ({
        ticker,
        oraclePrice: Number(market.oraclePrice),
        priceChange24H: Number(market.priceChange24H),
        volume24H: Number(market.volume24H),
        trades24H: market.trades24H,
        status: market.status,
        nextFundingRate: Number(market.nextFundingRate),
      }))
      .sort((a, b) => b.volume24H - a.volume24H);
  }, [data]);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Markets</h2>
          <p>Perpetual markets pulled from the dYdX indexer.</p>
        </div>
      </header>
      <div className="panel__content panel__content--scroll">
        {isLoading ? <p>Loading markets…</p> : null}
        {error ? <p className="form-field__error">Failed to load markets.</p> : null}
        {!isLoading && markets.length === 0 ? <p>No markets available.</p> : null}

        {markets.length > 0 ? (
          <table className="market-table">
            <thead>
              <tr>
                <th>Market</th>
                <th className="numeric">Price</th>
                <th className="numeric">24h</th>
                <th className="numeric">Volume 24h</th>
                <th className="numeric">Trades 24h</th>
                <th className="numeric">Funding %</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => {
                const isActiveRow = market.ticker === selectedMarket;
                return (
                  <tr
                    key={market.ticker}
                    className={isActiveRow ? 'market-table__row--active' : ''}
                    onClick={() => onSelect(market.ticker)}
                  >
                    <td>{market.ticker}</td>
                    <td className="numeric">{formatUsd(market.oraclePrice, 2)}</td>
                    <td className={`numeric ${market.priceChange24H >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {formatPercent(market.priceChange24H, 2)}
                    </td>
                    <td className="numeric">{formatUsd(market.volume24H, 0)}</td>
                    <td className="numeric">{formatNumber(market.trades24H, 0)}</td>
                    <td className="numeric">{formatPercent(market.nextFundingRate * 100, 4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  );
};

export default MarketTable;
