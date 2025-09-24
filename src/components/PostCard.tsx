import { motion } from 'framer-motion';
import { ArrowUp, MessageSquare, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { RedditPost } from '@shared/types';
interface PostCardProps {
  post: RedditPost;
}
export function PostCard({ post }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className="h-full"
    >
      <Card className="flex flex-col h-full bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-200">
        <CardHeader>
          <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <CardTitle className="text-lg font-semibold leading-snug">{post.title}</CardTitle>
          </a>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">by u/{post.author}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md p-1 -m-1 hover:bg-muted hover:text-primary transition-colors"
                  aria-label="View post on Reddit to upvote"
                >
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                  <span>{post.score}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upvote on Reddit</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md p-1 -m-1 hover:bg-muted hover:text-primary transition-colors"
                  aria-label="View comments on Reddit"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.num_comments}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>View comments on Reddit</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">r/{post.subreddit}</Badge>
            <time dateTime={new Date(post.created_utc * 1000).toISOString()}>
              {formatDistanceToNow(new Date(post.created_utc * 1000), { addSuffix: true })}
            </time>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={post.url} target="_blank" rel="noopener noreferrer" aria-label="Open external link" className="hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open external link</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}