export interface RelatedTool {
  id: string;
  name: string;
  domain: string;
  shortLabel: string;
  iconBgClass: string;
  enabled: boolean;
  path: string | null;
}

/**
 * Centralized configuration for sister / related downloader tools.
 * When enabled is false, tools render as non-navigating 'Coming soon' items.
 * When enabled is true, tools can navigate to their respective path without rewriting components.
 */
export const relatedTools: RelatedTool[] = [
  {
    id: 'facebook',
    name: 'Facebook Downloader',
    domain: 'facebook.com',
    shortLabel: 'f',
    iconBgClass: 'bg-blue-600 text-white',
    enabled: false,
    path: null,
  },
  {
    id: 'instagram',
    name: 'Instagram Downloader',
    domain: 'instagram.com',
    shortLabel: 'IG',
    iconBgClass: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
    enabled: false,
    path: null,
  },
  {
    id: 'youtube',
    name: 'YouTube Downloader',
    domain: 'youtube.com',
    shortLabel: 'YT',
    iconBgClass: 'bg-red-600 text-white',
    enabled: false,
    path: null,
  },
  {
    id: 'tiktok',
    name: 'TikTok Video Downloader',
    domain: 'tiktok.com',
    shortLabel: 'TT',
    iconBgClass: 'bg-slate-900 text-white',
    enabled: false,
    path: null,
  },
];
