import React, { useState } from 'react';
import { X, Settings, GripVertical, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WidgetWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove: (id: string) => void;
  onConfigure?: () => void;
  className?: string;
}

export function WidgetWrapper({
  id,
  title,
  children,
  onRemove,
  onConfigure,
  className,
}: WidgetWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'glass-card flex flex-col h-full overflow-hidden transition-all duration-200',
        isHovered && 'ring-1 ring-primary/30',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="widget-header cursor-move drag-handle">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/50" />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onConfigure && (
                <DropdownMenuItem onClick={onConfigure}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onRemove(id)} className="text-destructive">
                <X className="h-4 w-4 mr-2" />
                Remove Widget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="widget-content flex-1 overflow-auto">{children}</div>
    </div>
  );
}
