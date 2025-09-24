import { useEffect, useState, useMemo } from 'react';
import { MonitorList } from '@/components/MonitorList';
import { PostGrid } from '@/components/PostGrid';
import { CreateMonitorDialog } from '@/components/CreateMonitorDialog';
import { useStore, SortKey } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Github, Menu, PlusCircle, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Monitor, RedditPost } from '@shared/types';
const SidebarContent = ({ onEditMonitor }: { onEditMonitor: (monitor: Monitor) => void }) => (
  <div className="flex h-full max-h-screen flex-col gap-2">
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <a href="/" className="flex items-center gap-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M12 12a5 5 0 0 1 0 10"/></svg>
        <span className="">ZenithFeed</span>
      </a>
    </div>
    <div className="flex-1 overflow-y-auto">
      <div className="py-4 px-2">
        <MonitorList onEdit={onEditMonitor} />
      </div>
    </div>
    <div className="mt-auto p-4 border-t">
      <a href="https://github.com/cloudflare/workers-sdk/tree/main/templates/workers-vite-react" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <Github className="w-4 h-4" />
        Built with ❤️ at Cloudflare
      </a>
    </div>
  </div>
);
export function HomePage() {
  const { fetchMonitors, refreshPosts, setSortKey } = useStore(
    useShallow((state) => ({
      fetchMonitors: state.fetchMonitors,
      refreshPosts: state.refreshPosts,
      setSortKey: state.setSortKey,
    }))
  );
  const { selectedMonitorId, monitors, loadingPosts, posts, sortKey } = useStore(
    useShallow((state) => ({
      selectedMonitorId: state.selectedMonitorId,
      monitors: state.monitors,
      loadingPosts: state.loadingPosts,
      posts: state.posts,
      sortKey: state.sortKey,
    }))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [monitorToEdit, setMonitorToEdit] = useState<Monitor | null>(null);
  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);
  const handleEditMonitor = (monitor: Monitor) => {
    setMonitorToEdit(monitor);
    setIsDialogOpen(true);
  };
  const handleOpenCreateDialog = () => {
    setMonitorToEdit(null);
    setIsDialogOpen(true);
  };
  const sortedPosts = useMemo(() => {
    const postsCopy = [...posts];
    switch (sortKey) {
      case 'score':
        return postsCopy.sort((a, b) => b.score - a.score);
      case 'comments':
        return postsCopy.sort((a, b) => b.num_comments - a.num_comments);
      case 'new':
      default:
        return postsCopy.sort((a, b) => b.created_utc - a.created_utc);
    }
  }, [posts, sortKey]);
  const selectedMonitor = monitors.find((m) => m.id === selectedMonitorId);
  const title = selectedMonitor ? `r/${selectedMonitor.subreddit}` : 'ZenithFeed';
  const keywords = selectedMonitor?.keywords;
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
        <ThemeToggle className="fixed top-4 right-4 z-50" />
        <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
          <aside className="hidden border-r bg-slate-100/40 dark:bg-slate-900/40 md:block">
            <SidebarContent onEditMonitor={handleEditMonitor} />
          </aside>
          <main className="flex flex-1 flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-slate-100/40 dark:bg-slate-900/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-full max-w-xs">
                  <SidebarContent onEditMonitor={handleEditMonitor} />
                </SheetContent>
              </Sheet>
              <div className="flex-1">
                <h1 className="text-xl font-semibold tracking-tight truncate">{title}</h1>
                {keywords && <p className="text-sm text-muted-foreground truncate">Keywords: {keywords}</p>}
              </div>
              <div className="flex items-center gap-2">
                {posts.length > 0 && (
                  <Select onValueChange={(value: SortKey) => setSortKey(value)} defaultValue={sortKey}>
                    <SelectTrigger className="w-[130px] h-9 hidden sm:flex">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Newest</SelectItem>
                      <SelectItem value="score">Top Score</SelectItem>
                      <SelectItem value="comments">Comments</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={refreshPosts}
                      disabled={loadingPosts || !selectedMonitorId}
                      className="h-9 w-9"
                    >
                      <RefreshCw className={`h-4 w-4 ${loadingPosts ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh Posts</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Feed</p>
                  </TooltipContent>
                </Tooltip>
                <Button onClick={handleOpenCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Monitor
                </Button>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-4 lg:p-6">
              <PostGrid posts={sortedPosts} />
            </div>
          </main>
        </div>
        <CreateMonitorDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          monitorToEdit={monitorToEdit}
        />
        <Toaster richColors closeButton />
      </div>
    </TooltipProvider>
  );
}