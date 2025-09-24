import { AnimatePresence, motion } from 'framer-motion';
import { Rss } from 'lucide-react';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import type { RedditPost } from '@shared/types';
interface PostGridProps {
  posts: RedditPost[];
}
export function PostGrid({ posts }: PostGridProps) {
  const { loadingPosts, selectedMonitorId } = useStore(
    useShallow((state) => ({
      loadingPosts: state.loadingPosts,
      selectedMonitorId: state.selectedMonitorId,
    }))
  );
  if (loadingPosts) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!selectedMonitorId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground animate-fade-in">
        <Rss className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">Welcome to ZenithFeed</h2>
        <p>Select a monitor on the left or create a new one to get started.</p>
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground animate-fade-in">
        <Rss className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">No Posts Found</h2>
        <p>We couldn't find any posts for this monitor in the last 7 days.</p>
      </div>
    );
  }
  return (
    <AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}