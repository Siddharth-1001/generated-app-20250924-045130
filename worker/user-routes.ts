import { Hono } from "hono";
import type { Env } from './core-utils';
import { MonitorEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { RedditPost } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET all monitors
  app.get('/api/monitors', async (c) => {
    const page = await MonitorEntity.list(c.env);
    return ok(c, page.items);
  });
  // POST a new monitor
  app.post('/api/monitors', async (c) => {
    const { subreddit, keywords } = (await c.req.json()) as { subreddit?: string; keywords?: string };
    if (!isStr(subreddit)) return bad(c, 'subreddit is required');
    const monitorData = {
      id: crypto.randomUUID(),
      subreddit: subreddit.trim(),
      keywords: keywords?.trim() ?? ''
    };
    const created = await MonitorEntity.create(c.env, monitorData);
    return ok(c, created);
  });
  // PUT (update) a monitor
  app.put('/api/monitors/:id', async (c) => {
    const monitorId = c.req.param('id');
    if (!isStr(monitorId)) return bad(c, 'Invalid monitor ID');
    const { subreddit, keywords } = (await c.req.json()) as { subreddit?: string; keywords?: string };
    if (!isStr(subreddit)) return bad(c, 'subreddit is required');
    const monitor = new MonitorEntity(c.env, monitorId);
    if (!(await monitor.exists())) return notFound(c, 'Monitor not found');
    const updatedData = {
        id: monitorId,
        subreddit: subreddit.trim(),
        keywords: keywords?.trim() ?? ''
    };
    await monitor.save(updatedData);
    return ok(c, updatedData);
  });
  // DELETE a monitor
  app.delete('/api/monitors/:id', async (c) => {
    const monitorId = c.req.param('id');
    if (!isStr(monitorId)) return bad(c, 'Invalid monitor ID');
    const deleted = await MonitorEntity.delete(c.env, monitorId);
    if (!deleted) return notFound(c, 'Monitor not found');
    return ok(c, { id: monitorId });
  });
  // GET posts for a specific monitor
  app.get('/api/monitors/:id/posts', async (c) => {
    const monitorId = c.req.param('id');
    const monitor = new MonitorEntity(c.env, monitorId);
    if (!await monitor.exists()) return notFound(c, 'monitor not found');
    const { subreddit, keywords } = await monitor.getState();
    const searchParams = new URLSearchParams({
      q: keywords || '',
      sort: 'new',
      t: 'week',
      restrict_sr: 'on',
      limit: '100'
    });
    const redditUrl = `https://www.reddit.com/r/${subreddit}/search.json?${searchParams.toString()}`;
    try {
      const response = await fetch(redditUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        },
        cf: {
          cacheTtl: 0, // Disable caching to ensure fresh data
        },
      });
      if (!response.ok) {
        console.error(`Reddit API error: ${response.status} ${response.statusText}`);
        return bad(c, `Failed to fetch from Reddit: ${response.statusText}`);
      }
      const json: any = await response.json();
      if (!json.data || !json.data.children) {
        return ok(c, []);
      }
      const posts = json.data.children.map((child: any): RedditPost => ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        subreddit: child.data.subreddit,
        score: child.data.score,
        url: child.data.url,
        created_utc: child.data.created_utc,
        permalink: `https://www.reddit.com${child.data.permalink}`,
        num_comments: child.data.num_comments,
      }));
      return ok(c, posts);
    } catch (error) {
      console.error('Error fetching from Reddit:', error);
      return c.json({ success: false, error: 'Internal Server Error while fetching from Reddit' }, 500);
    }
  });
}