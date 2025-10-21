import { usePositions } from '../hooks/useDydxData';
import { useDydxStore } from '../store/dydxStore';
import { formatNumber, formatUsd } from '../utils/number';

const PositionsPanel = () => {
  const { status } = useDydxStore();
  const { data, isLoading, error } = usePositions();

  const perpetualPositions = data?.perpetualPositions.positions ?? [];
  const assetPositions = data?.assetPositions.positions ?? [];

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Portfolio</h2>
          <p>Your live positions and balances.</p>
        </div>
      </header>
      <div className="panel__content panel__content--scroll">
        {status !== 'connected' ? <p>Connect a wallet to view balances.</p> : null}
        {isLoading ? <p>Loading positions…</p> : null}
        {error ? <p className="form-field__error">Unable to load positions.</p> : null}

        {assetPositions.length ? (
          <div className="positions-section">
            <h3>Assets</h3>
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th className="numeric">Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assetPositions.map((position) => (
                  <tr key={position.asset}>
                    <td>{position.asset}</td>
                    <td className="numeric">{formatNumber(position.balance, 4)}</td>
                    <td>{position.transferRestricted ? 'Restricted' : 'Available'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {perpetualPositions.length ? (
          <div className="positions-section">
            <h3>Perpetuals</h3>
            <table>
              <thead>
                <tr>
                  <th>Market</th>
                  <th className="numeric">Size</th>
                  <th className="numeric">Entry</th>
                  <th className="numeric">Unrealized PnL</th>
                  <th className="numeric">Realized 24h</th>
                </tr>
              </thead>
              <tbody>
                {perpetualPositions.map((position) => (
                  <tr key={position.market}>
                    <td>{position.market}</td>
                    <td className="numeric">
                      {formatNumber(position.size, 4)} {position.side}
                    </td>
                    <td className="numeric">{formatUsd(position.entryPrice, 2)}</td>
                    <td className="numeric">{formatUsd(position.unrealizedPnl, 2)}</td>
                    <td className="numeric">{formatUsd(position.realizedPnl24H, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!isLoading && status === 'connected' && !perpetualPositions.length && !assetPositions.length ? (
          <p>No open positions.</p>
        ) : null}
      </div>
    </section>
  );
};

export default PositionsPanel;
