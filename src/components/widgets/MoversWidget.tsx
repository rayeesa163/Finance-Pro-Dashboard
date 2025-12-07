import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { topGainers, topLosers, formatPrice, formatPercent, Stock } from '@/data/mockStocks';

interface MoversWidgetProps {
  type: 'gainers' | 'losers';
}

export function MoversWidget({ type }: MoversWidgetProps) {
  const stocks = type === 'gainers' ? topGainers.slice(0, 5) : topLosers.slice(0, 5);
  const isGainers = type === 'gainers';

  return (
    <div className="space-y-2">
      {stocks.map((stock, index) => (
        <div
          key={stock.symbol}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer',
            'hover:bg-accent/50 group animate-fade-in'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Rank */}
          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              isGainers
                ? 'bg-gain/20 text-gain'
                : 'bg-loss/20 text-loss'
            )}
          >
            {index + 1}
          </div>

          {/* Stock Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{stock.symbol}</span>
              {isGainers ? (
                <TrendingUp className="h-3 w-3 text-gain" />
              ) : (
                <TrendingDown className="h-3 w-3 text-loss" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-mono text-sm font-medium text-foreground">
              {formatPrice(stock.price)}
            </p>
            <p
              className={cn(
                'font-mono text-xs font-bold',
                isGainers ? 'text-gain' : 'text-loss'
              )}
            >
              {formatPercent(stock.changePercent)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
