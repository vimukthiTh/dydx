import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { CompositeClient } from '@dydxprotocol/v4-client-js';

import { useDydxStore } from '../store/dydxStore';

interface TradeFormProps {
  market: string;
}

type PlaceOrderParams = Parameters<CompositeClient['placeOrder']>;
type OrderTypeValue = PlaceOrderParams[2];
type OrderSideValue = PlaceOrderParams[3];
type OrderTimeInForceValue = PlaceOrderParams[7];
type OrderExecutionValue = PlaceOrderParams[9];

const DEFAULT_EXECUTION: OrderExecutionValue = 'DEFAULT' as OrderExecutionValue;

const defaultClientId = () => Math.floor(Math.random() * 10 ** 9);

const TradeForm = ({ market }: TradeFormProps) => {
  const queryClient = useQueryClient();
  const { status, compositeClient, subaccount, networkKey } = useDydxStore();
  const [side, setSide] = useState<OrderSideValue>('BUY' as OrderSideValue);
  const [orderType, setOrderType] = useState<OrderTypeValue>('LIMIT' as OrderTypeValue);
  const [timeInForce, setTimeInForce] = useState<OrderTimeInForceValue>(
    'GTT' as OrderTimeInForceValue,
  );
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [clientId, setClientId] = useState(defaultClientId());
  const [goodTilSeconds, setGoodTilSeconds] = useState(60);
  const [postOnly, setPostOnly] = useState(false);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConnected = status === 'connected' && compositeClient && subaccount;
  const disablePriceField = orderType === 'MARKET';

  const tifRequiresDeadline = useMemo(() => timeInForce === 'GTT', [timeInForce]);

  const resetForm = () => {
    setSize('');
    setPrice('');
    setClientId(defaultClientId());
    setPostOnly(false);
    setReduceOnly(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isConnected || !market) {
      setFeedback({
        type: 'error',
        message: 'Connect a wallet and select a market first.',
      });
      return;
    }

    const parsedSize = Number(size);
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedSize) || parsedSize <= 0) {
      setFeedback({
        type: 'error',
        message: 'Enter a valid order size greater than zero.',
      });
      return;
    }
    if (!disablePriceField && (!Number.isFinite(parsedPrice) || parsedPrice <= 0)) {
      setFeedback({ type: 'error', message: 'Enter a valid limit price.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await compositeClient.placeOrder(
        subaccount,
        market,
        orderType,
        side,
        disablePriceField ? 0 : parsedPrice,
        parsedSize,
        Number(clientId),
        timeInForce,
        tifRequiresDeadline ? goodTilSeconds : undefined,
        DEFAULT_EXECUTION,
        postOnly,
        reduceOnly,
      );

      const hash = 'hash' in response ? response.hash.toString() : undefined;
      setFeedback({
        type: 'success',
        message: hash ? `Order submitted (tx: ${hash}).` : 'Order submitted.',
      });
      resetForm();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['positions'] }),
        queryClient.invalidateQueries({ queryKey: ['trades', networkKey, market] }),
        queryClient.invalidateQueries({ queryKey: ['orderbook', networkKey, market] }),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to place order.';
      setFeedback({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Trade</h2>
          <p>Submit a short-term dYdX order directly against the matching engine.</p>
        </div>
      </header>
      <div className="panel__content">
        <form className="trade-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="market">Market</label>
            <input id="market" type="text" value={market} readOnly />
          </div>

          <div className="form-field form-field--row">
            <div>
              <label htmlFor="side">Side</label>
              <select
                id="side"
                value={side}
                onChange={(event) => setSide(event.target.value as OrderSideValue)}
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
            <div>
              <label htmlFor="orderType">Order Type</label>
              <select
                id="orderType"
                value={orderType}
                onChange={(event) => setOrderType(event.target.value as OrderTypeValue)}
              >
                <option value="LIMIT">Limit</option>
                <option value="MARKET">Market</option>
              </select>
            </div>
          </div>

          <div className="form-field form-field--row">
            <div>
              <label htmlFor="size">Size</label>
              <input
                id="size"
                type="number"
                min="0"
                step="any"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                placeholder="Enter base asset size"
              />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder={disablePriceField ? 'Market order price not required' : 'Enter limit price'}
                disabled={disablePriceField}
              />
            </div>
          </div>

          <div className="form-field form-field--row">
            <div>
              <label htmlFor="timeInForce">Time In Force</label>
              <select
                id="timeInForce"
                value={timeInForce}
                onChange={(event) => setTimeInForce(event.target.value as OrderTimeInForceValue)}
              >
                <option value="GTT">GTT</option>
                <option value="IOC">IOC</option>
                <option value="FOK">FOK</option>
              </select>
            </div>
            {tifRequiresDeadline ? (
              <div>
                <label htmlFor="goodTil">Good-Til Time (seconds)</label>
                <input
                  id="goodTil"
                  type="number"
                  min="1"
                  value={goodTilSeconds}
                  onChange={(event) => setGoodTilSeconds(Number(event.target.value))}
                />
              </div>
            ) : null}
          </div>

          <div className="form-field form-field--row">
            <div>
              <label htmlFor="clientId">Client ID</label>
              <input
                id="clientId"
                type="number"
                min="1"
                value={clientId}
                onChange={(event) => setClientId(Number(event.target.value))}
              />
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={postOnly}
                  onChange={(event) => setPostOnly(event.target.checked)}
                />
                Post Only
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={reduceOnly}
                  onChange={(event) => setReduceOnly(event.target.checked)}
                />
                Reduce Only
              </label>
            </div>
          </div>

          <div className="trade-form__footer">
            <button className="button" type="submit" disabled={!isConnected || isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Place Order'}
            </button>
            {!isConnected ? <span className="form-field__hint">Connect to submit trades.</span> : null}
          </div>

          {feedback ? (
            <p
              className={feedback.type === 'success' ? 'form-field__success' : 'form-field__error'}
            >
              {feedback.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
};

export default TradeForm;
