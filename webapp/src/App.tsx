import { useMemo, useState } from 'react';

import ConnectionPanel from './components/ConnectionPanel';
import MarketTable from './components/MarketTable';
import Orderbook from './components/Orderbook';
import PositionsPanel from './components/PositionsPanel';
import TradeForm from './components/TradeForm';
import TradesTable from './components/TradesTable';
import { useMarkets } from './hooks/useDydxData';
import { formatPercent, formatUsd } from './utils/number';
import './App.css';

const DEFAULT_MARKET = 'ETH-USD';

const App = () => {
  const [selectedMarket, setSelectedMarket] = useState(DEFAULT_MARKET);
  const { data: selectedMarketData } = useMarkets(selectedMarket);

  const marketSummary = useMemo(() => {
    if (!selectedMarket || !selectedMarketData?.markets[selectedMarket]) {
      return null;
    }
    const market = selectedMarketData.markets[selectedMarket];
    return {
      price: Number(market.oraclePrice),
      change: Number(market.priceChange24H),
      volume: Number(market.volume24H),
    };
  }, [selectedMarket, selectedMarketData]);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>dYdX Perpetual Trading</h1>
          <p>
            Trade perpetual contracts on the dYdX Chain. Connect a mnemonic, pick a market, and
            submit signed orders directly to the validator RPC.
          </p>
        </div>
        {marketSummary ? (
          <div className="market-summary">
            <div>
              <span className="market-summary__label">Market</span>
              <strong>{selectedMarket}</strong>
            </div>
            <div>
              <span className="market-summary__label">Price</span>
              <strong>{formatUsd(marketSummary.price, 2)}</strong>
            </div>
            <div>
              <span className="market-summary__label">24h Change</span>
              <strong
                className={marketSummary.change >= 0 ? 'text-positive' : 'text-negative'}
              >
                {formatPercent(marketSummary.change, 2)}
              </strong>
            </div>
            <div>
              <span className="market-summary__label">24h Volume</span>
              <strong>{formatUsd(marketSummary.volume, 0)}</strong>
            </div>
          </div>
        ) : null}
      </header>

      <main className="app__grid">
        <div className="app__column">
          <ConnectionPanel />
          <PositionsPanel />
        </div>

        <div className="app__column">
          <TradeForm market={selectedMarket} />
          <Orderbook market={selectedMarket} />
        </div>

        <div className="app__column">
          <MarketTable selectedMarket={selectedMarket} onSelect={setSelectedMarket} />
          <TradesTable market={selectedMarket} />
        </div>
      </main>

      <footer className="app__footer">
        <p>
          Built with the official <code>@dydxprotocol/v4-client-js</code> package. Review the code,
          keep secrets local, and test on public testnet before trading on mainnet.
        </p>
      </footer>
    </div>
  );
};

export default App;
