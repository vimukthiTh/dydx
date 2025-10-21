import { useMemo } from 'react';

import { useOrderbook } from '../hooks/useDydxData';
import { formatNumber } from '../utils/number';

interface OrderbookProps {
  market: string;
}

const Orderbook = ({ market }: OrderbookProps) => {
  const { data, isLoading, error } = useOrderbook(market, Boolean(market));

  const [bids, asks] = useMemo(() => {
    if (!data) {
      return [[], []] as const;
    }
    return [data.bids.slice(0, 15), data.asks.slice(0, 15)] as const;
  }, [data]);

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Orderbook</h2>
          <p>{market ? `Live depth for ${market}` : 'Select a market to view bids and asks.'}</p>
        </div>
      </header>
      <div className="panel__content panel__content--scroll">
        {isLoading ? <p>Loading orderbook…</p> : null}
        {error ? <p className="form-field__error">Unable to load orderbook.</p> : null}

        {data && (
          <div className="orderbook">
            <div>
              <h3>Bids</h3>
              <table>
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((row, index) => (
                    <tr key={`bid-${index}`}>
                      <td>{formatNumber(row.price, 2)}</td>
                      <td>{formatNumber(row.size, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3>Asks</h3>
              <table>
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {asks.map((row, index) => (
                    <tr key={`ask-${index}`}>
                      <td>{formatNumber(row.price, 2)}</td>
                      <td>{formatNumber(row.size, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Orderbook;
