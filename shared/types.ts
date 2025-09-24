export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
export interface Monitor {
  id: string;
  subreddit: string;
  keywords: string;
}
export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  url: string;
  created_utc: number;
  permalink: string;
  num_comments: number;
}