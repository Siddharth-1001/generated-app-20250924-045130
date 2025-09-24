import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Rss, Trash2, Pencil } from 'lucide-react';
import { DeleteMonitorAlert } from './DeleteMonitorAlert';
import { Button } from './ui/button';
import type { Monitor } from '@shared/types';
interface MonitorListProps {
  onEdit: (monitor: Monitor) => void;
}
export function MonitorList({ onEdit }: MonitorListProps) {
  const { monitors, selectedMonitorId, selectMonitor, loadingMonitors } = useStore(
    useShallow((state) => ({
      monitors: state.monitors,
      selectedMonitorId: state.selectedMonitorId,
      selectMonitor: state.selectMonitor,
      loadingMonitors: state.loadingMonitors,
    }))
  );
  if (loadingMonitors) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (monitors.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground p-4">
        <p>No monitors created yet. Click "Create Monitor" to start.</p>
      </div>
    );
  }
  return (
    <nav className="flex flex-col gap-1">
      {monitors.map((monitor) => (
        <div
          key={monitor.id}
          onClick={() => selectMonitor(monitor.id)}
          className={cn(
            'group flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/10',
            selectedMonitorId === monitor.id && 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 shadow-sm'
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Rss className={cn("h-4 w-4 flex-shrink-0 transition-colors duration-200", selectedMonitorId === monitor.id ? "text-primary" : "text-muted-foreground")} />
            <div className="flex flex-col items-start overflow-hidden">
              <span className="font-medium truncate">r/{monitor.subreddit}</span>
              {monitor.keywords && (
                <span className="text-xs text-muted-foreground/80 truncate w-full">
                  {monitor.keywords}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(monitor);
              }}
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit monitor</span>
            </Button>
            <DeleteMonitorAlert monitor={monitor}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete monitor</span>
              </Button>
            </DeleteMonitorAlert>
          </div>
        </div>
      ))}
    </nav>
  );
}