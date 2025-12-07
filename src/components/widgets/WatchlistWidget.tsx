import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { watchlistStocks, formatPrice, formatPercent, Stock } from '@/data/mockStocks';

export function WatchlistWidget() {
  const [stocks, setStocks] = useState<Stock[]>(watchlistStocks);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          const priceChange = (Math.random() - 0.5) * 0.5;
          const newPrice = Number((stock.price + priceChange).toFixed(2));
          const newChange = Number((stock.change + priceChange).toFixed(2));
          const newChangePercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
          
          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      {stocks.map((stock) => {
        const isPositive = stock.change >= 0;
        
        return (
          <div
            key={stock.symbol}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{stock.symbol}</span>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-gain" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-loss" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
            </div>
            
            <div className="text-right">
              <p className="font-mono text-sm font-medium text-foreground">
                {formatPrice(stock.price)}
              </p>
              <p
                className={cn(
                  'font-mono text-xs font-medium',
                  isPositive ? 'text-gain' : 'text-loss'
                )}
              >
                {formatPercent(stock.changePercent)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
