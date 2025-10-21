# dYdX Perpetual Trading Web App

React + TypeScript + Vite front-end for interacting with the dYdX v4 perpetual exchange. The app
uses the official `@dydxprotocol/v4-client-js` SDK to pull market data from the indexer, displays
portfolio information, and submits signed orders via the validator RPC.

> **Security notice**  
> The mnemonic you provide is kept in-memory inside the browser session and never leaves the client.
> Only connect with accounts you control and understand the risks before trading on mainnet. Test on
> the public testnet first.

## Features

- Network selector (mainnet & public testnet) with local wallet onboarding.
- Live market list, orderbook, and trades backed by the indexer REST API.
- Positions and balances viewer for the connected subaccount.
- Order ticket for short-term limit/market orders with post-only and reduce-only flags.
- React Query caching, Zustand-powered client state, and Node polyfills for cosmjs compatibility.

## Getting Started

```bash
cd webapp
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173). Provide a 12 or 24 word mnemonic and
subaccount number to connect. Orders are sent to the selected network (testnet or mainnet).

### Environment

- Node.js 20+
- Vite 7
- React 19 + TypeScript 5.9

## Project Structure

```
src/
  api/             # Thin wrappers over the dYdX indexer REST client
  components/      # UI building blocks (connection panel, markets, orderbook, etc.)
  config/          # Network metadata and selector helpers
  hooks/           # React Query hooks for markets, orderbook, trades, positions
  store/           # Zustand store managing connection state and clients
  utils/           # Formatting helpers
```

## Deployment Notes

- Ensure the host serving the app allows outgoing requests to the selected dYdX indexer and
  validator endpoints.
- For production builds run `npm run build` and deploy the generated `dist/` folder with a static
  web server.
- Consider adding your own session storage or hardware-wallet integrations before shipping to end
  users.

## References

- Trading guide: https://docs.dydx.xyz/interaction/trading
- SDK: https://www.npmjs.com/package/@dydxprotocol/v4-client-js
