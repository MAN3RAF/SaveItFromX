export type MediaFormat = 'video' | 'audio' | 'gif';

export interface MediaQualityOption {
  id: string;
  format: MediaFormat;
  quality: string; // e.g. "1080p (Full HD)", "720p (HD)", "320 kbps (High Quality MP3)"
  resolution?: string;
  bitrate?: string;
  extension: 'mp4' | 'mp3' | 'gif' | 'm4a';
  sizeFormatted: string;
  sizeBytes: number;
  downloadUrl: string;
  isPopular?: boolean;
}

export interface TweetMediaDetails {
  id: string;
  tweetUrl: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerified: boolean;
  content: string;
  postedAt: string;
  durationFormatted: string;
  durationSeconds: number;
  thumbnailUrl: string;
  videoPreviewUrl?: string;
  audioPreviewUrl?: string;
  likeCount: number;
  retweetCount: number;
  viewCount: number;
  options: MediaQualityOption[];
}

export interface PSeoPage {
  slug: string;
  category: 'device' | 'format' | 'action' | 'quality' | 'use-case';
  h1: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  deviceTarget?: string;
  formatTarget?: string;
  qualityTarget?: string;
  customSummary: string;
  stepGuide: { step: number; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  canonicalUrl: string;
}

export interface SitemapItem {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

export interface SitemapSubIndex {
  id: number;
  filename: string;
  url: string;
  pageCount: number;
  sampleUrls: string[];
  lastmod: string;
}

export interface DownloadLog {
  id: string;
  timestamp: string;
  tweetUrl: string;
  format: 'mp4' | 'mp3' | 'gif';
  quality: string;
  fileSize: string;
  clientIpHash: string;
  device: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface AnalyticsSummary {
  totalDownloads: number;
  videoDownloads: number;
  audioDownloads: number;
  gifDownloads: number;
  activeUsersToday: number;
  averageSpeedMbps: number;
  totalPSeoPagesIndexed: number;
  topLandingPages: { slug: string; keyword: string; visits: number }[];
  dailyTrends: { date: string; video: number; audio: number; total: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  formatBreakdown: { format: string; count: number; percentage: number }[];
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'seo_manager' | 'viewer';
  lastLogin: string;
}
