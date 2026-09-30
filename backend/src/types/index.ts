export type MediaFormat = 'video' | 'audio' | 'gif';

export interface MediaQualityOption {
  id: string;
  format: MediaFormat;
  quality: string;
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

export interface SiteSettings {
  siteName: string;
  heroHeading: string;
  heroDescription: string;
  announcementText: string;
  announcementEnabled: boolean;
  maintenanceMode: boolean;
  downloadsEnabled: boolean;
  footerText: string;
}

export interface AdSlotConfig {
  position: 'homepage_top' | 'below_downloader' | 'download_result' | 'footer';
  enabled: boolean;
  provider: 'adsense' | 'custom' | 'direct';
  clientId?: string;
  slotId?: string;
  responsive: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: 'superadmin' | 'seo_manager' | 'viewer';
  lastLogin?: string;
}
