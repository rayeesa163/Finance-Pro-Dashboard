import React, { useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useDashboardStore, Widget } from '@/store/dashboardStore';
import { WidgetWrapper } from './widgets/WidgetWrapper';
import { WatchlistWidget } from './widgets/WatchlistWidget';
import { StockChartWidget } from './widgets/StockChartWidget';
import { MoversWidget } from './widgets/MoversWidget';
import { StockTableWidget } from './widgets/StockTableWidget';
import { PerformanceWidget } from './widgets/PerformanceWidget';

const ROW_HEIGHT = 80;
const COLS = 12;

function WidgetContent({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'watchlist':
      return <WatchlistWidget />;
    case 'chart':
      return <StockChartWidget symbol={widget.config.symbol as string} />;
    case 'gainers':
      return <MoversWidget type="gainers" />;
    case 'losers':
      return <MoversWidget type="losers" />;
    case 'table':
      return <StockTableWidget />;
    case 'performance':
      return <PerformanceWidget />;
    default:
      return <div className="text-muted-foreground">Unknown widget type</div>;
  }
}

export function Dashboard() {
  const { widgets, layout, updateLayout, removeWidget } = useDashboardStore();
  const [containerWidth, setContainerWidth] = React.useState(1200);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      updateLayout(
        newLayout.map((item) => ({
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          minW: item.minW,
          minH: item.minH,
        }))
      );
    },
    [updateLayout]
  );

  return (
    <div ref={containerRef} className="w-full">
      <GridLayout
        className="layout"
        layout={layout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        isResizable={true}
        isDraggable={true}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="animate-fade-in">
            <WidgetWrapper
              id={widget.id}
              title={widget.title}
              onRemove={removeWidget}
            >
              <WidgetContent widget={widget} />
            </WidgetWrapper>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
