import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { cn } from '@/lib/utils';
import { generateChartData, formatPrice } from '@/data/mockStocks';
import { Button } from '@/components/ui/button';

type ChartType = 'line' | 'area';
type TimeInterval = '1D' | '1W' | '1M' | '3M' | '1Y';

interface StockChartWidgetProps {
  symbol?: string;
}

export function StockChartWidget({ symbol = 'AAPL' }: StockChartWidgetProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [interval, setInterval] = useState<TimeInterval>('3M');

  const chartData = useMemo(() => {
    const days: Record<TimeInterval, number> = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365,
    };
    return generateChartData(days[interval]);
  }, [interval]);

  const lastPrice = chartData[chartData.length - 1]?.close || 0;
  const firstPrice = chartData[0]?.close || 0;
  const priceChange = lastPrice - firstPrice;
  const changePercent = ((priceChange / firstPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  const intervals: TimeInterval[] = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h4 className="text-xl font-bold text-foreground">{symbol}</h4>
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatPrice(lastPrice)}
            </span>
          </div>
          <p
            className={cn(
              'font-mono text-sm font-medium',
              isPositive ? 'text-gain' : 'text-loss'
            )}
          >
            {isPositive ? '+' : ''}
            {formatPrice(priceChange)} ({isPositive ? '+' : ''}
            {changePercent}%)
          </p>
        </div>

        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
          {intervals.map((int) => (
            <Button
              key={int}
              variant="ghost"
              size="sm"
              onClick={() => setInterval(int)}
              className={cn(
                'h-7 px-3 text-xs font-medium',
                interval === int
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {int}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142 76% 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" opacity={0.5} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (interval === '1D') return date.toLocaleTimeString('en-US', { hour: '2-digit' });
                if (interval === '1W' || interval === '1M')
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return date.toLocaleDateString('en-US', { month: 'short' });
              }}
            />
            <YAxis
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 10%)',
                border: '1px solid hsl(217 33% 22%)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px hsl(222 47% 4% / 0.5)',
              }}
              labelStyle={{ color: 'hsl(210 40% 98%)' }}
              formatter={(value: number) => [formatPrice(value), 'Price']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            {chartType === 'area' ? (
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? 'hsl(142 76% 45%)' : 'hsl(0 84% 60%)'}
                strokeWidth={2}
                fill={isPositive ? 'url(#colorGain)' : 'url(#colorLoss)'}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="close"
                stroke={isPositive ? 'hsl(142 76% 45%)' : 'hsl(0 84% 60%)'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
