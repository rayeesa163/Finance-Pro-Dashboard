# FinBoard Pro – Customizable Real‑Time Finance Dashboard

Build your own real‑time finance monitoring dashboard with pluggable data sources and drag‑and‑drop widgets.

> **Stack**: Next.js 14 (App Router) • TypeScript • Tailwind CSS • Zustand (state) • dnd-kit (drag & drop) • Recharts (charts) • Chart.js (optional) • Axios/Fetch • Vitest/RTL • ESLint/Prettier

---

## ✨ Features

* **Widget Builder**: Add, configure, duplicate, delete widgets.
* **Drag & Drop Layout**: Rearrange widgets with **dnd‑kit**, responsive grid.
* **Data Sources**: Pluggable adapters for Stocks (Alpha Vantage, Yahoo Finance (unofficial), Finnhub, Twelve Data, Polygon, Mock).
* **Visualizations**: Line, Area, Candlestick*, Bar; paginated/searchable Tables; KPI Cards (Watchlist, Gainers/Losers, Performance, Financials).
* **Real‑Time**: Polling or WebSocket/SSE (when provider supports) with per‑widget refresh intervals.
* **State & Persistence**: Global store via **Zustand**; autosave to `localStorage`; optional cloud sync (Supabase) per user.
* **Config Panels**: Per‑widget settings (symbol, interval, aggregation, theme, refresh rate).
* **Dark/Light Themes**: System aware, persisted.
* **Access‑friendly**: Keyboard‑navigable, ARIA‑labeled, color‑contrast‑safe.
* **Deploy‑ready**: Vercel one‑click.

* Candlestick via `recharts-candlestick` or a lightweight custom layer.

---

## 🏗️ Architecture

```
apps/
  web/ (Next.js app)
    app/
      (routes)
      dashboard/  → main builder page
      api/        → edge/serverless proxies (optional)
    components/   → UI primitives & widgets
    lib/          → adapters, utils, schema, constants
    store/        → Zustand slices (widgets, layout, user, theme)
    styles/
    tests/
packages/
  ui/ (optional shared UI lib)
```

Core concepts:

* **Widget** = visualization + data adapter + config schema.
* **Adapter** abstracts provider quirks into a common shape.
* **Registry** dynamically maps widget types to components & schemas.

---

## 🚀 Getting Started

### 1) Prerequisites

* Node.js ≥ 18
* pnpm (recommended) or npm/yarn

### 2) Clone & Install

```bash
git clone https://github.com/<your-username>/finboard-pro.git
cd finboard-pro
pnpm install
```

### 3) Environment

Create `.env.local` in `apps/web` (or project root if single app):

```bash
# Choose at least one provider
ALPHA_VANTAGE_API_KEY=your_key
FINNHUB_API_KEY=your_key
TWELVE_DATA_API_KEY=your_key
POLYGON_API_KEY=your_key

# Optional: Supabase for cloud sync
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

> You can run entirely with **Mock** data (no keys) for demo.

### 4) Run Dev Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5) Build & Start

```bash
pnpm build
pnpm start
```

---

## 🧩 Widgets (built‑in)

* **Price Chart**: Line/Area/Candlestick with ranges **1D / 1W / 1M / 6M / 1Y**.
* **Watchlist Table**: Search, filter, pagination, columns (Symbol, Price, %Change, Volume, Avg Vol, 52W range).
* **Market Gainers/Losers**: Top movers with sparkline.
* **Performance Card**: KPI set (Day/Week/Month returns).
* **Financials Card**: Revenue, EPS, PE, PB, Dividend (if provider data available).

Each widget supports:

* **Add/Remove/Duplicate**
* **Drag‑to‑reorder & resize**
* **Config panel**: symbol(s), interval, theme mode, refresh ms, provider.

---

## 🧱 State & Persistence

**Zustand** slices:

* `widgetsSlice`: instances, configs, runtime status
* `layoutSlice`: grid positions/sizes
* `userSlice`: auth/profile (optional)
* `themeSlice`: dark/light/system

Persisted to `localStorage` (key: `finboard:v1`). Optional Supabase sync per user when authenticated.

---

## 🔌 Data Adapters

All providers map to a common interface:

```ts
// lib/adapters/types.ts
export interface TimeSeriesPoint { t: number; o?: number; h?: number; l?: number; c: number; v?: number }
export type Interval = '1m'|'5m'|'15m'|'1h'|'1d'|'1w'|'1mo'

export interface Quote { symbol: string; price: number; change: number; changePct: number; ts: number }

export interface AdapterContext { signal?: AbortSignal }

export interface MarketAdapter {
  id: string; // 'alpha-vantage' | 'finnhub' | 'mock' | ...
  getIntraday(symbol: string, interval: Interval, ctx?: AdapterContext): Promise<TimeSeriesPoint[]>;
  getDaily(symbol: string, range: { from?: Date; to?: Date }, ctx?: AdapterContext): Promise<TimeSeriesPoint[]>;
  getQuote(symbol: string, ctx?: AdapterContext): Promise<Quote>;
  getTopMovers?(side: 'gainers'|'losers', ctx?: AdapterContext): Promise<Quote[]>;
  getFinancials?(symbol: string, ctx?: AdapterContext): Promise<Record<string, number|string>>;
}
```

Register adapters in `lib/adapters/index.ts`:

```ts
export const adapters: Record<string, MarketAdapter> = {
  mock: mockAdapter,
  'alpha-vantage': alphaVantageAdapter,
  finnhub: finnhubAdapter,
  polygon: polygonAdapter,
  'twelve-data': twelveDataAdapter,
}
```

Switch providers per widget via Config Panel.

---

## 📦 Adding a New Widget

1. **Define schema** (Zod) for config:

```ts
// lib/widgets/price-chart/schema.ts
import { z } from 'zod'
export const PriceChartConfig = z.object({
  symbol: z.string().min(1),
  provider: z.enum(['mock','alpha-vantage','finnhub','polygon','twelve-data']).default('mock'),
  interval: z.enum(['1m','5m','15m','1h','1d']).default('1d'),
  range: z.enum(['1D','1W','1M','6M','1Y']).default('1M'),
  refreshMs: z.number().int().min(0).default(30000),
  style: z.enum(['line','area','candle']).default('line'),
})
export type PriceChartConfigType = z.infer<typeof PriceChartConfig>
```

2. **Create component** using Recharts.
3. **Create settings panel** (controlled form with Zod + React Hook Form).
4. **Register** in the Widget Registry:

```ts
// lib/widgets/registry.ts
export const WIDGETS = {
  'price-chart': {
    name: 'Price Chart',
    component: dynamic(() => import('@/components/widgets/price-chart')),
    settings: dynamic(() => import('@/components/widgets/price-chart/settings')),
    defaultConfig: { symbol: 'AAPL', provider: 'mock', interval: '1d', range: '1M', refreshMs: 30000, style: 'line' },
    icon: 'Activity',
  },
  // ...
} as const
```

---

## 🔁 Real‑Time Updates

Two strategies:

1. **Polling** (default): each widget chooses `refreshMs`.
2. **SSE/WebSocket**: if your provider supports streams, use a Next.js `/api/stream` that fans out updates to clients.

Example polling hook:

```ts
export function usePolling<T>(fn: () => Promise<T>, ms: number, deps: any[] = []) { /* ... */ }
```

---

## 📊 Charts

* **Recharts** for simplicity.
* Candlesticks via composables or `recharts-candlestick` package.
* Synchronized tooltips across charts using shared state.

---

## 🗃️ Tables

* Virtualized table for watchlist using `@tanstack/react-table` + `react-virtual`.
* Search, column filters, sortable headers, pagination.

---

## 🔐 API Proxy (optional but recommended)

To keep keys safe & normalize responses, add route handlers under `app/api/markets/*` that call the external provider on the server and return normalized JSON. This avoids exposing API keys to the browser and helps with CORS/rate limits.

```
app/api/markets/[provider]/quote/route.ts
app/api/markets/[provider]/timeseries/route.ts
```

---

## 🧪 Testing

* **Vitest** + **@testing-library/react**
* Store tests for reducers/selectors.
* Adapter tests with mocked fetch.

```bash
pnpm test
```

---

## 🧹 Linting & Formatting

```bash
pnpm lint
pnpm format
```

---

## 🧰 Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest"
  }
}
```

---

## 🧭 Example User Flows

* **Create dashboard** → add Price Chart → set symbol `AAPL` → choose provider `Alpha Vantage` → set range `1M`, refresh `30s` → save.
* **Add Watchlist** → input symbols `AAPL, TSLA, MSFT` → table appears with live quotes.
* **Reorder** → Drag Price Chart over Watchlist.
* **Duplicate** → Copy widget, change symbol `TSLA`.

---

## 📦 Sample Data (Mock)

Enable **Mock Provider** in settings to demo without keys. Mock generates realistic OHLCV and quote ticks.

---

## ☁️ Deployment

### Vercel (recommended)

1. Push to GitHub.
2. Import in Vercel → set env vars → Deploy.
3. Ensure `edge`/`nodejs18.x` runtime for API routes.

### Netlify / AWS Amplify

* Configure Next.js adapter, set env vars, and add serverless functions for API proxy.

---

## 🔒 Notes on Providers & Limits

* **Alpha Vantage**: free but strict rate limits (5 req/min, 500/day). Cache aggressively, stagger polling.
* **Finnhub/Polygon/Twelve Data**: higher quotas on paid tiers, WebSocket available.
* Implement exponential backoff & circuit breakers on `429`.

---

## 🧭 Roadmap

* ✅ Candlestick charts
* ✅ Cloud sync (Supabase)
* ⏳ Multi‑dashboard profiles
* ⏳ Alerts (price/percent change) with toast & email
* ⏳ Strategy backtesting widget
* ⏳ Export/Import dashboard JSON

---

## 📚 Tech Choices

* **Why Zustand over Redux?** Smaller API surface, minimal boilerplate, selector‑based performance.
* **Why Recharts?** Simple, SSR‑friendly, good defaults; can swap to `visx` if needed.
* **Why dnd‑kit?** Accessible, composable, smoother than HTML5 DnD.

---

## 📝 License

MIT © Rayeesa

---

## 🙌 Credits

Inspired by real‑world terminals (Bloomberg/Refinitiv) and open finance APIs. Built by **Rayeesa Tabusum**.
