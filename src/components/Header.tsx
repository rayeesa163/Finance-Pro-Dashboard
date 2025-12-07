import React, { useState, useEffect } from 'react';
import { Activity, Bell, Search, Moon, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddWidgetPanel } from './AddWidgetPanel';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre' | 'after'>('open');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple market status check (9:30 AM - 4:00 PM EST)
  useEffect(() => {
    const hours = currentTime.getHours();
    if (hours >= 9.5 && hours < 16) {
      setMarketStatus('open');
    } else if (hours >= 4 && hours < 9.5) {
      setMarketStatus('pre');
    } else if (hours >= 16 && hours < 20) {
      setMarketStatus('after');
    } else {
      setMarketStatus('closed');
    }
  }, [currentTime]);

  const statusColors = {
    open: 'bg-gain text-gain-foreground',
    closed: 'bg-loss text-loss-foreground',
    pre: 'bg-warning text-warning-foreground',
    after: 'bg-warning text-warning-foreground',
  };

  const statusLabels = {
    open: 'Market Open',
    closed: 'Market Closed',
    pre: 'Pre-Market',
    after: 'After Hours',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">FinBoard</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Real-Time Finance Dashboard</p>
            </div>
          </div>

          {/* Market Status */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[marketStatus]}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  marketStatus === 'open' ? 'bg-gain' : 'bg-current'
                }`}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
            {statusLabels[marketStatus]}
          </div>
        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks, symbols, or companies..."
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex text-xs font-mono text-muted-foreground mr-2">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <RefreshCcw className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          <AddWidgetPanel />
        </div>
      </div>
    </header>
  );
}
