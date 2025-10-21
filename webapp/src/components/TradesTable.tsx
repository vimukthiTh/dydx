import { useTrades } from '../hooks/useDydxData';
import { formatNumber, formatSide } from '../utils/number';

interface TradesTableProps {
  market: string;
}

const TradesTable = ({ market }: TradesTableProps) => {
  const { data, isLoading, error } = useTrades(market, Boolean(market));

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Recent Trades</h2>
          <p>Latest fills streamed from the indexer.</p>
        </div>
      </header>
      <div className="panel__content panel__content--scroll">
        {isLoading ? <p>Loading trades…</p> : null}
        {error ? <p className="form-field__error">Unable to load trades.</p> : null}
        {!data?.trades?.length && !isLoading ? <p>No trades yet.</p> : null}

        {data?.trades?.length ? (
          <table className="trades-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Side</th>
                <th className="numeric">Price</th>
                <th className="numeric">Size</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.trades.slice(0, 30).map((trade) => (
                <tr key={trade.id}>
                  <td className="mono">{trade.id}</td>
                  <td className={trade.side === 'BUY' ? 'text-positive' : 'text-negative'}>
                    {formatSide(trade.side)}
                  </td>
                  <td className="numeric">{formatNumber(trade.price, 2)}</td>
                  <td className="numeric">{formatNumber(trade.size, 4)}</td>
                  <td>{new Date(trade.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  );
};

export default TradesTable;
