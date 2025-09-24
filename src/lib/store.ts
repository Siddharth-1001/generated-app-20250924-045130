import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Monitor, RedditPost } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export type SortKey = 'new' | 'score' | 'comments';
interface AppState {
  monitors: Monitor[];
  selectedMonitorId: string | null;
  posts: RedditPost[];
  loadingMonitors: boolean;
  loadingPosts: boolean;
  error: string | null;
  sortKey: SortKey;
}
interface AppActions {
  fetchMonitors: () => Promise<void>;
  createMonitor: (data: { subreddit: string; keywords?: string }) => Promise<Monitor | undefined>;
  updateMonitor: (id: string, data: { subreddit: string; keywords?: string }) => Promise<void>;
  deleteMonitor: (id: string) => Promise<void>;
  selectMonitor: (id: string | null) => void;
  fetchPosts: (monitorId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  setSortKey: (key: SortKey) => void;
}
export const useStore = create<AppState & AppActions>()(
  persist(
    immer((set, get) => ({
      monitors: [],
      selectedMonitorId: null,
      posts: [],
      loadingMonitors: true,
      loadingPosts: false,
      error: null,
      sortKey: 'new',
      fetchMonitors: async () => {
        set({ loadingMonitors: true, error: null });
        try {
          const monitors = await api<Monitor[]>('/api/monitors');
          set({ monitors, loadingMonitors: false });
          const persistedId = get().selectedMonitorId;
          if (persistedId && monitors.some(m => m.id === persistedId)) {
            get().selectMonitor(persistedId);
          } else if (monitors.length > 0) {
            get().selectMonitor(monitors[0].id);
          } else {
            set({ selectedMonitorId: null, posts: [] });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch monitors';
          set({ error: errorMessage, loadingMonitors: false });
          toast.error(errorMessage);
        }
      },
      createMonitor: async (data) => {
        try {
          const newMonitor = await api<Monitor>('/api/monitors', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          set((state) => {
            state.monitors.push(newMonitor);
          });
          get().selectMonitor(newMonitor.id);
          toast.success(`Monitor for r/${newMonitor.subreddit} created!`);
          return newMonitor;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create monitor';
          set({ error: errorMessage });
          toast.error(errorMessage);
          return undefined;
        }
      },
      updateMonitor: async (id, data) => {
        try {
          const updatedMonitor = await api<Monitor>(`/api/monitors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          set(state => {
            const index = state.monitors.findIndex(m => m.id === id);
            if (index !== -1) {
              state.monitors[index] = updatedMonitor;
            }
          });
          toast.success(`Monitor for r/${updatedMonitor.subreddit} updated!`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update monitor';
          toast.error(errorMessage);
        }
      },
      deleteMonitor: async (id: string) => {
        const originalMonitors = get().monitors;
        const monitorToDelete = originalMonitors.find(m => m.id === id);
        set(state => {
          state.monitors = state.monitors.filter(m => m.id !== id);
        });
        try {
          await api<{ id: string }>(`/api/monitors/${id}`, { method: 'DELETE' });
          toast.success(`Monitor for r/${monitorToDelete?.subreddit} deleted.`);
          if (get().selectedMonitorId === id) {
            const remainingMonitors = get().monitors;
            const newSelectedId = remainingMonitors.length > 0 ? remainingMonitors[0].id : null;
            get().selectMonitor(newSelectedId);
          }
        } catch (error) {
          set({ monitors: originalMonitors });
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete monitor';
          toast.error(errorMessage);
        }
      },
      selectMonitor: (id) => {
        if (get().selectedMonitorId === id && get().posts.length > 0) return;
        set({ selectedMonitorId: id, posts: [], sortKey: 'new' });
        if (id) {
          get().fetchPosts(id);
        }
      },
      fetchPosts: async (monitorId) => {
        set({ loadingPosts: true, error: null, posts: [] });
        try {
          const posts = await api<RedditPost[]>(`/api/monitors/${monitorId}/posts`);
          set({ posts, loadingPosts: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
          set({ error: errorMessage, loadingPosts: false, posts: [] });
          toast.error(errorMessage);
        }
      },
      refreshPosts: async () => {
        const { selectedMonitorId } = get();
        if (selectedMonitorId) {
          toast.info('Refreshing feed...');
          await get().fetchPosts(selectedMonitorId);
        }
      },
      setSortKey: (key: SortKey) => {
        set({ sortKey: key });
      },
    })),
    {
      name: 'zenith-feed-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedMonitorId: state.selectedMonitorId }),
    }
  )
);