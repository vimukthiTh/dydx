import { useState } from 'react';
import type { FormEvent } from 'react';

import { DEFAULT_NETWORK_KEY, NETWORKS } from '../config/networks';
import type { SupportedNetworkKey } from '../config/networks';
import { useDydxStore } from '../store/dydxStore';

const MIN_MNEMONIC_WORDS = 12;

const ConnectionPanel = () => {
  const {
    networkKey,
    setNetwork,
    connect,
    disconnect,
    status,
    walletAddress,
    subaccountNumber,
    lastError,
  } = useDydxStore();
  const [mnemonic, setMnemonic] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkKey>(
    networkKey ?? DEFAULT_NETWORK_KEY,
  );
  const [subaccount, setSubaccount] = useState(subaccountNumber ?? 0);

  const isConnected = status === 'connected';
  const isBusy = status === 'connecting';

  const handleNetworkChange = (nextNetwork: SupportedNetworkKey) => {
    setSelectedNetwork(nextNetwork);
    setNetwork(nextNetwork);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!mnemonic.trim()) {
      return;
    }
    await connect({
      mnemonic,
      subaccountNumber: Number(subaccount ?? 0),
      networkKey: selectedNetwork,
    });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const mnemonicWordCount = mnemonic.trim().split(/\s+/).filter(Boolean).length;
  const mnemonicError =
    mnemonic.trim().length > 0 && mnemonicWordCount < MIN_MNEMONIC_WORDS
      ? `Enter at least ${MIN_MNEMONIC_WORDS} words`
      : undefined;

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Connection</h2>
          <p>Select network, connect your wallet, and manage subaccounts.</p>
        </div>
        <div className="panel__actions">
          {isConnected ? (
            <button className="button button--secondary" onClick={handleDisconnect}>
              Disconnect
            </button>
          ) : null}
        </div>
      </header>

      <div className="panel__content">
        <form className="connection-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="network">Network</label>
            <div className="network-options">
              {Object.values(NETWORKS).map((network) => (
                <button
                  key={network.key}
                  type="button"
                  onClick={() => handleNetworkChange(network.key)}
                  className={`network-pill ${selectedNetwork === network.key ? 'network-pill--active' : ''}`}
                  disabled={isBusy}
                >
                  <div className="network-pill__label">{network.label}</div>
                  <div className="network-pill__description">{network.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="mnemonic">Secret Recovery Phrase</label>
            <textarea
              id="mnemonic"
              placeholder="Enter your 12 or 24 word mnemonic..."
              value={mnemonic}
              onChange={(event) => setMnemonic(event.target.value)}
              rows={3}
              spellCheck={false}
              disabled={isBusy || isConnected}
              required
            />
            <p className="form-field__hint">
              The phrase stays local in your browser session and is never sent to a server. Consider
              using a fresh trading account.
            </p>
            {mnemonicError ? <p className="form-field__error">{mnemonicError}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="subaccount">Subaccount Number</label>
            <input
              id="subaccount"
              type="number"
              min={0}
              value={subaccount}
              onChange={(event) => setSubaccount(Number(event.target.value))}
              disabled={isBusy || isConnected}
            />
          </div>

          <div className="connection-form__footer">
            <button className="button" type="submit" disabled={isBusy || isConnected || !!mnemonicError}>
              {isBusy ? 'Connecting…' : 'Connect'}
            </button>
            {walletAddress ? (
              <div className="connection-form__status">
                <span className="badge badge--success">Connected</span>
                <span className="mono">{walletAddress}</span>
                <span>Subaccount #{subaccountNumber}</span>
              </div>
            ) : (
              <div className="connection-form__status">
                <span className="badge">Disconnected</span>
              </div>
            )}
          </div>

          {lastError ? <p className="form-field__error">{lastError}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default ConnectionPanel;
