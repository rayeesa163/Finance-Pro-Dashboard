import React from 'react';
import { Plus, List, LineChart, TrendingUp, TrendingDown, Table2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardStore, WidgetType } from '@/store/dashboardStore';

const widgetOptions: { type: WidgetType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    type: 'watchlist', 
    label: 'Watchlist', 
    icon: <List className="h-4 w-4" />, 
    description: 'Track your favorite stocks' 
  },
  { 
    type: 'chart', 
    label: 'Stock Chart', 
    icon: <LineChart className="h-4 w-4" />, 
    description: 'Price chart with intervals' 
  },
  { 
    type: 'gainers', 
    label: 'Top Gainers', 
    icon: <TrendingUp className="h-4 w-4" />, 
    description: 'Best performing stocks' 
  },
  { 
    type: 'losers', 
    label: 'Top Losers', 
    icon: <TrendingDown className="h-4 w-4" />, 
    description: 'Worst performing stocks' 
  },
  { 
    type: 'table', 
    label: 'Market Table', 
    icon: <Table2 className="h-4 w-4" />, 
    description: 'Sortable stock table' 
  },
  { 
    type: 'performance', 
    label: 'Performance', 
    icon: <BarChart3 className="h-4 w-4" />, 
    description: 'Portfolio performance' 
  },
];

export function AddWidgetPanel() {
  const addWidget = useDashboardStore((state) => state.addWidget);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Widget
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose Widget Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {widgetOptions.map((option) => (
          <DropdownMenuItem
            key={option.type}
            onClick={() => addWidget(option.type)}
            className="flex items-start gap-3 py-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {option.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
