import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'watchlist' | 'chart' | 'gainers' | 'losers' | 'table' | 'performance';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

interface DashboardState {
  widgets: Widget[];
  layout: LayoutItem[];
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateLayout: (layout: LayoutItem[]) => void;
  updateWidgetConfig: (id: string, config: Record<string, unknown>) => void;
}

const defaultWidgets: Widget[] = [
  { id: 'watchlist-1', type: 'watchlist', title: 'Watchlist', config: {} },
  { id: 'chart-1', type: 'chart', title: 'Stock Chart', config: { symbol: 'AAPL', interval: 'daily' } },
  { id: 'gainers-1', type: 'gainers', title: 'Top Gainers', config: {} },
  { id: 'losers-1', type: 'losers', title: 'Top Losers', config: {} },
  { id: 'table-1', type: 'table', title: 'Market Overview', config: {} },
];

const defaultLayout: LayoutItem[] = [
  { i: 'watchlist-1', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
  { i: 'chart-1', x: 3, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
  { i: 'gainers-1', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  { i: 'losers-1', x: 9, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
  { i: 'table-1', x: 0, y: 4, w: 12, h: 3, minW: 6, minH: 2 },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      layout: defaultLayout,
      addWidget: (type) => {
        const id = `${type}-${Date.now()}`;
        const titles: Record<WidgetType, string> = {
          watchlist: 'Watchlist',
          chart: 'Stock Chart',
          gainers: 'Top Gainers',
          losers: 'Top Losers',
          table: 'Market Overview',
          performance: 'Performance',
        };
        
        const defaultConfigs: Record<WidgetType, Record<string, unknown>> = {
          watchlist: {},
          chart: { symbol: 'AAPL', interval: 'daily' },
          gainers: {},
          losers: {},
          table: {},
          performance: {},
        };

        const sizes: Record<WidgetType, { w: number; h: number; minW: number; minH: number }> = {
          watchlist: { w: 3, h: 4, minW: 2, minH: 3 },
          chart: { w: 6, h: 4, minW: 4, minH: 3 },
          gainers: { w: 3, h: 2, minW: 2, minH: 2 },
          losers: { w: 3, h: 2, minW: 2, minH: 2 },
          table: { w: 6, h: 3, minW: 4, minH: 2 },
          performance: { w: 4, h: 3, minW: 3, minH: 2 },
        };

        set((state) => ({
          widgets: [...state.widgets, { id, type, title: titles[type], config: defaultConfigs[type] }],
          layout: [...state.layout, { i: id, x: 0, y: Infinity, ...sizes[type] }],
        }));
      },
      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          layout: state.layout.filter((l) => l.i !== id),
        }));
      },
      updateLayout: (layout) => {
        set({ layout });
      },
      updateWidgetConfig: (id, config) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, config: { ...w.config, ...config } } : w
          ),
        }));
      },
    }),
    {
      name: 'finboard-dashboard',
    }
  )
);
