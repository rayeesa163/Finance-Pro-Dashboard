export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  pe: number;
  sector: string;
}

export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const watchlistStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34, changePercent: 1.33, volume: 52436789, marketCap: 2780000000000, high52w: 199.62, low52w: 124.17, pe: 28.5, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.23, changePercent: -0.32, volume: 21345678, marketCap: 2810000000000, high52w: 384.30, low52w: 245.61, pe: 35.2, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.45, changePercent: 2.50, volume: 18765432, marketCap: 1780000000000, high52w: 153.78, low52w: 102.21, pe: 24.8, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: -0.87, changePercent: -0.49, volume: 34567890, marketCap: 1850000000000, high52w: 189.77, low52w: 118.35, pe: 62.3, sector: 'Consumer Cyclical' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 24.56, changePercent: 2.89, volume: 45678901, marketCap: 2160000000000, high52w: 974.00, low52w: 373.56, pe: 68.4, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.95, change: 8.32, changePercent: 1.67, volume: 12345678, marketCap: 1290000000000, high52w: 542.81, low52w: 274.38, pe: 32.1, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23, volume: 98765432, marketCap: 790000000000, high52w: 299.29, low52w: 152.37, pe: 72.5, sector: 'Consumer Cyclical' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 408.23, change: 1.89, changePercent: 0.47, volume: 3456789, marketCap: 880000000000, high52w: 425.10, low52w: 316.73, pe: 9.2, sector: 'Financial Services' },
];

export const topGainers: Stock[] = [
  { symbol: 'SMCI', name: 'Super Micro Computer', price: 923.45, change: 87.23, changePercent: 10.43, volume: 12345678, marketCap: 54000000000, high52w: 1229.00, low52w: 84.69, pe: 45.2, sector: 'Technology' },
  { symbol: 'ARM', name: 'ARM Holdings', price: 156.78, change: 12.34, changePercent: 8.54, volume: 23456789, marketCap: 163000000000, high52w: 164.00, low52w: 46.50, pe: 380.5, sector: 'Technology' },
  { symbol: 'COIN', name: 'Coinbase Global', price: 234.56, change: 15.67, changePercent: 7.16, volume: 8765432, marketCap: 58000000000, high52w: 283.48, low52w: 46.47, pe: 78.3, sector: 'Financial Services' },
  { symbol: 'PLTR', name: 'Palantir Technologies', price: 24.89, change: 1.45, changePercent: 6.19, volume: 56789012, marketCap: 55000000000, high52w: 27.50, low52w: 13.68, pe: 245.8, sector: 'Technology' },
  { symbol: 'MARA', name: 'Marathon Digital', price: 23.45, change: 1.23, changePercent: 5.54, volume: 34567890, marketCap: 6500000000, high52w: 31.30, low52w: 7.16, pe: -15.2, sector: 'Financial Services' },
];

export const topLosers: Stock[] = [
  { symbol: 'MRNA', name: 'Moderna Inc.', price: 98.76, change: -8.45, changePercent: -7.88, volume: 12345678, marketCap: 38000000000, high52w: 170.47, low52w: 62.55, pe: -4.5, sector: 'Healthcare' },
  { symbol: 'BABA', name: 'Alibaba Group', price: 72.34, change: -4.56, changePercent: -5.93, volume: 18765432, marketCap: 185000000000, high52w: 102.50, low52w: 66.63, pe: 12.8, sector: 'Consumer Cyclical' },
  { symbol: 'NIO', name: 'NIO Inc.', price: 5.67, change: -0.34, changePercent: -5.66, volume: 45678901, marketCap: 11000000000, high52w: 16.18, low52w: 4.76, pe: -2.8, sector: 'Consumer Cyclical' },
  { symbol: 'RIVN', name: 'Rivian Automotive', price: 10.23, change: -0.56, changePercent: -5.19, volume: 23456789, marketCap: 10000000000, high52w: 28.06, low52w: 8.26, pe: -1.9, sector: 'Consumer Cyclical' },
  { symbol: 'SNAP', name: 'Snap Inc.', price: 11.45, change: -0.52, changePercent: -4.34, volume: 34567890, marketCap: 18500000000, high52w: 17.90, low52w: 8.28, pe: -18.5, sector: 'Technology' },
];

export const allStocks: Stock[] = [...watchlistStocks, ...topGainers, ...topLosers].filter(
  (stock, index, self) => index === self.findIndex((s) => s.symbol === stock.symbol)
);

// Generate mock chart data
export function generateChartData(days: number = 90): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let basePrice = 150 + Math.random() * 50;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02;
    const change = (Math.random() - 0.48) * volatility * basePrice;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
    
    basePrice = close;
  }

  return data;
}

export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
