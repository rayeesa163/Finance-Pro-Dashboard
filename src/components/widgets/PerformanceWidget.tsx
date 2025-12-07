import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatPercent } from '@/data/mockStocks';

const performanceData = {
  totalValue: 127453.67,
  dayChange: 2345.89,
  dayChangePercent: 1.87,
  totalReturn: 27453.67,
  totalReturnPercent: 27.45,
  bestPerformer: { symbol: 'NVDA', percent: 134.5 },
  worstPerformer: { symbol: 'TSLA', percent: -15.3 },
};

export function PerformanceWidget() {
  const isPositiveDay = performanceData.dayChange >= 0;
  const isPositiveTotal = performanceData.totalReturn >= 0;

  return (
    <div className="space-y-4">
      {/* Portfolio Value */}
      <div className="text-center pb-4 border-b border-border/50">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Portfolio Value
        </p>
        <p className="text-3xl font-bold font-mono text-foreground">
          {formatPrice(performanceData.totalValue)}
        </p>
        <div
          className={cn(
            'inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-sm font-medium',
            isPositiveDay ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'
          )}
        >
          {isPositiveDay ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span className="font-mono">
            {formatPrice(performanceData.dayChange)} ({formatPercent(performanceData.dayChangePercent)})
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Return */}
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total Return</span>
          </div>
          <p
            className={cn(
              'font-mono font-semibold',
              isPositiveTotal ? 'text-gain' : 'text-loss'
            )}
          >
            {formatPercent(performanceData.totalReturnPercent)}
          </p>
        </div>

        {/* Best Performer */}
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-gain" />
            <span className="text-xs text-muted-foreground">Best</span>
          </div>
          <p className="font-mono font-semibold text-gain">
            {performanceData.bestPerformer.symbol} +{performanceData.bestPerformer.percent}%
          </p>
        </div>

        {/* Worst Performer */}
        <div className="p-3 rounded-lg bg-muted/50 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-loss" />
              <span className="text-xs text-muted-foreground">Worst Performer</span>
            </div>
            <p className="font-mono font-semibold text-loss">
              {performanceData.worstPerformer.symbol} {performanceData.worstPerformer.percent}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
