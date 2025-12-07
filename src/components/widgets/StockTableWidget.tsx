import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allStocks, formatPrice, formatPercent, formatNumber, Stock } from '@/data/mockStocks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap';
type SortDirection = 'asc' | 'desc';

export function StockTableWidget() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedStocks = useMemo(() => {
    return allStocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
          stock.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const direction = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * direction;
        }
        return ((aValue as number) - (bValue as number)) * direction;
      });
  }, [search, sortField, sortDirection]);

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-muted/50 border-border/50"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-border/50">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[140px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('symbol')}
                  className="h-8 -ml-2 font-semibold"
                >
                  Symbol
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('price')}
                  className="h-8 -ml-2 font-semibold"
                >
                  Price
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('changePercent')}
                  className="h-8 -ml-2 font-semibold"
                >
                  Change
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('volume')}
                  className="h-8 -ml-2 font-semibold"
                >
                  Volume
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('marketCap')}
                  className="h-8 -ml-2 font-semibold"
                >
                  Market Cap
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">Sector</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              
              return (
                <TableRow
                  key={stock.symbol}
                  className="border-border/50 cursor-pointer hover:bg-accent/50"
                >
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{stock.symbol}</span>
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 text-gain" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-loss" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {stock.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-medium">
                    {formatPrice(stock.price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'font-mono font-medium',
                        isPositive ? 'text-gain' : 'text-loss'
                      )}
                    >
                      {formatPercent(stock.changePercent)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-muted-foreground">
                    {formatNumber(stock.volume)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-muted-foreground">
                    {formatNumber(stock.marketCap)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {stock.sector}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
