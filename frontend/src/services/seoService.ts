import { PSeoPage } from '../types';

// Programmatic SEO Seed Data Matrix
const ACTIONS = [
  { verb: 'download', name: 'Download' },
  { verb: 'save', name: 'Save' },
  { verb: 'convert', name: 'Convert' },
  { verb: 'extract', name: 'Extract' },
  { verb: 'get', name: 'Get' },
];

const TARGETS = [
  { key: 'x-video', label: 'X Video', type: 'video' },
  { key: 'twitter-video', label: 'Twitter Video', type: 'video' },
  { key: 'x-clip', label: 'X Clip', type: 'video' },
  { key: 'twitter-audio', label: 'Twitter Audio', type: 'audio' },
  { key: 'x-mp3', label: 'X MP3 Audio', type: 'audio' },
  { key: 'twitter-gif', label: 'Twitter GIF', type: 'gif' },
  { key: 'x-spaces-recording', label: 'X Spaces Recording', type: 'audio' },
  { key: 'twitter-threads-video', label: 'Twitter Thread Video', type: 'video' },
  { key: 'x-broadcast', label: 'X Live Broadcast', type: 'video' },
  { key: 'twitter-voice', label: 'Twitter Voice Note', type: 'audio' },
];

const QUALITIES = [
  { id: '1080p-full-hd', label: '1080p Full HD', resolution: '1920x1080', format: 'MP4' },
  { id: '4k-uhd', label: '4K Ultra HD', resolution: '3840x2160', format: 'MP4' },
  { id: '720p-hd', label: '720p HD', resolution: '1280x720', format: 'MP4' },
  { id: '480p-sd', label: '480p SD', resolution: '854x480', format: 'MP4' },
  { id: '320kbps-mp3', label: '320 kbps High Quality MP3', resolution: 'Audio 320k', format: 'MP3' },
  { id: '128kbps-audio', label: '128 kbps Standard Audio', resolution: 'Audio 128k', format: 'MP3' },
  { id: 'original-quality', label: 'Original Studio Quality', resolution: 'Lossless', format: 'Direct' },
];

const DEVICES = [
  { slug: 'iphone-ios', name: 'iPhone (iOS)', browser: 'Safari', tip: 'Use Safari and tap the Share icon, then select Save Video to Camera Roll without any third-party app.' },
  { slug: 'android-phone', name: 'Android Phone & Tablet', browser: 'Chrome / Samsung Internet', tip: 'Files save instantly to your Google Photos or Downloads folder.' },
  { slug: 'mac-safari', name: 'Mac & MacBook (macOS)', browser: 'Safari / Chrome', tip: 'Command+Click to instantly save high bitrate MP4 streams in full bitrate.' },
  { slug: 'windows-pc', name: 'Windows 10/11 PC', browser: 'Edge / Chrome / Firefox', tip: 'Direct hardware-accelerated download to your Windows Downloads folder.' },
  { slug: 'ipad-ipados', name: 'iPad (iPadOS)', browser: 'Safari', tip: 'Full split-screen drag and drop or direct download manager support.' },
  { slug: 'chromebook', name: 'Chromebook (ChromeOS)', browser: 'Chrome', tip: 'One-click cloud storage or internal storage integration.' },
];

const USE_CASES = [
  { slug: 'without-watermark', title: 'Without Watermark', desc: 'Preserves the crystal-clean original video frame with zero branding overlays.' },
  { slug: 'fastest-speed', title: 'Fastest CDN Speeds', desc: 'Direct multi-threaded CDN extraction for lightning-fast 2-second downloads.' },
  { slug: 'unlimited-free', title: 'Unlimited & 100% Free', desc: 'No daily limits, no subscription paywalls, and no account registration needed.' },
  { slug: 'private-safe', title: 'Private & Secure', desc: 'No logs kept on our servers. Your downloaded media goes straight from CDN to your device.' },
];

class SeoService {
  private pagesCache: Map<string, PSeoPage> = new Map();
  private allSlugsList: string[] = [];

  constructor() {
    this.generateAllPages();
  }

  private generateAllPages() {
    // Generate programmatic matrix combining actions, targets, qualities, devices, and use-cases
    // Matrix 1: Actions + Targets + Devices (e.g. download-x-video-iphone-ios)
    for (const action of ACTIONS) {
      for (const target of TARGETS) {
        for (const device of DEVICES) {
          const slug = `${action.verb}-${target.key}-${device.slug}`;
          this.allSlugsList.push(slug);
        }
      }
    }

    // Matrix 2: Actions + Targets + Qualities (e.g. save-twitter-video-1080p-full-hd)
    for (const action of ACTIONS) {
      for (const target of TARGETS) {
        for (const quality of QUALITIES) {
          const slug = `${action.verb}-${target.key}-${quality.id}`;
          this.allSlugsList.push(slug);
        }
      }
    }

    // Matrix 3: Targets + Qualities + Devices (e.g. x-video-1080p-full-hd-mac-safari)
    for (const target of TARGETS) {
      for (const quality of QUALITIES) {
        for (const device of DEVICES) {
          const slug = `${target.key}-${quality.id}-${device.slug}`;
          this.allSlugsList.push(slug);
        }
      }
    }

    // Matrix 4: Actions + Targets + Use Cases (e.g. download-x-video-without-watermark)
    for (const action of ACTIONS) {
      for (const target of TARGETS) {
        for (const uc of USE_CASES) {
          const slug = `${action.verb}-${target.key}-${uc.slug}`;
          this.allSlugsList.push(slug);
        }
      }
    }

    // Matrix 5: High Intent Conversions (e.g. twitter-video-to-mp3-converter)
    const extraHighIntent = [
      'twitter-video-to-mp3-converter',
      'x-to-mp4-online-downloader',
      'save-x-video-direct-link',
      'download-x-thread-videos-batch',
      'extract-audio-from-x-tweet',
      'download-twitter-gif-as-mp4',
      'save-x-spaces-audio-podcast',
      'x-video-downloader-for-whatsapp-status',
      'download-twitter-videos-safari-ios17',
      'x-downloader-4k-quality-free',
      'convert-x-clip-to-mp3-320kbps',
      'save-twitter-video-without-login',
      'download-x-status-video-android',
      'best-alternative-to-ssstwitter',
      'saveitfromx-official-downloader',
    ];

    for (const extra of extraHighIntent) {
      this.allSlugsList.push(extra);
    }
  }

  public getTotalPagesCount(): number {
    return this.allSlugsList.length;
  }

  public getAllSlugs(): string[] {
    return this.allSlugsList;
  }

  public getPageBySlug(slug: string): PSeoPage {
    if (this.pagesCache.has(slug)) {
      return this.pagesCache.get(slug)!;
    }

    // Synthesize tailored pSEO data dynamically
    const parts = slug.split('-');
    const matchedDevice = DEVICES.find((d) => slug.includes(d.slug));
    const matchedQuality = QUALITIES.find((q) => slug.includes(q.id));
    const matchedTarget = TARGETS.find((t) => slug.includes(t.key)) || TARGETS[0];
    const isAudio = matchedTarget.type === 'audio' || slug.includes('mp3') || slug.includes('audio');

    // Title construction
    const deviceName = matchedDevice ? matchedDevice.name : 'All Devices';
    const qualityLabel = matchedQuality ? matchedQuality.label : (isAudio ? '320kbps MP3' : '1080p Full HD');
    const mediaName = matchedTarget.label;

    const h1 = `Download ${mediaName} in ${qualityLabel}${matchedDevice ? ` on ${matchedDevice.name}` : ''}`;
    const metaTitle = `${h1} – Free & Fast | SaveItFromX`;
    const metaDescription = `Download and convert ${mediaName} to high-resolution ${isAudio ? 'MP3 audio' : 'MP4 video'} (${qualityLabel}) instantly${matchedDevice ? ` on ${matchedDevice.name}` : ''}. 100% free, no app required.`;

    const stepGuide = [
      {
        step: 1,
        title: 'Copy the Post Link',
        desc: `Open the X (Twitter) app or web browser${matchedDevice ? ` on your ${matchedDevice.name}` : ''}, tap the Share button under the tweet containing the ${isAudio ? 'audio' : 'video'}, and tap "Copy Link".`,
      },
      {
        step: 2,
        title: 'Paste into SaveItFromX',
        desc: `Return to SaveItFromX.com and paste the copied URL into the search field at the top of this page.`,
      },
      {
        step: 3,
        title: `Download in ${qualityLabel}`,
        desc: `Click the "Download" button, choose ${qualityLabel}, and save the ${isAudio ? 'MP3 file' : 'MP4 video'} directly to your device storage${matchedDevice ? ` (${matchedDevice.tip})` : ''}.`,
      },
    ];

    const faqs = [
      {
        question: `How do I download ${mediaName} on ${deviceName}?`,
        answer: `Simply copy the link from X, paste it into our SaveItFromX tool, and select ${qualityLabel}. The download will start automatically in your browser with zero installations.`,
      },
      {
        question: `Is the ${qualityLabel} download completely free?`,
        answer: `Yes, SaveItFromX provides unlimited free downloads for both video (up to 1080p/4K) and audio (320kbps MP3) with no hidden fees or subscriptions.`,
      },
      {
        question: `Can I extract only the MP3 audio from an X video?`,
        answer: `Absolutely! Our system automatically demuxes the original video stream and generates crisp 320 kbps and 128 kbps MP3 files for instant download.`,
      },
      {
        question: `Where does the file get saved on my ${deviceName}?`,
        answer: matchedDevice
          ? matchedDevice.tip
          : `Files are saved in your system's default Downloads directory or media gallery.`,
      },
    ];

    // Pick 5 related slugs for internal SEO link mesh
    const relatedSlugs: string[] = [];
    const index = Math.abs(slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % (this.allSlugsList.length - 6);
    for (let i = 1; i <= 5; i++) {
      relatedSlugs.push(this.allSlugsList[index + i] || this.allSlugsList[i]);
    }

    const page: PSeoPage = {
      slug,
      category: matchedDevice ? 'device' : matchedQuality ? 'quality' : 'format',
      h1,
      metaTitle,
      metaDescription,
      targetKeyword: `${matchedTarget.label.toLowerCase()} download ${qualityLabel.toLowerCase()}`,
      deviceTarget: matchedDevice?.name,
      formatTarget: isAudio ? 'MP3 Audio' : 'MP4 Video',
      qualityTarget: qualityLabel,
      customSummary: `SaveItFromX is optimized to provide the fastest ${qualityLabel} extraction pipeline for ${mediaName}. Whether you are archiving educational threads, viral news clips, or trending podcasts, our high-bandwidth infrastructure guarantees crisp bitrate preservation without compression artifacts.`,
      stepGuide,
      faqs,
      relatedSlugs,
      canonicalUrl: `https://www.saveitfromx.com/page/${slug}`,
    };

    this.pagesCache.set(slug, page);
    return page;
  }

  public getFeaturedPages(limit: number = 8): PSeoPage[] {
    const featuredSlugs = [
      'download-x-video-iphone-ios',
      'download-x-video-1080p-full-hd',
      'convert-twitter-audio-320kbps-mp3',
      'save-x-video-android-phone',
      'download-twitter-threads-video-1080p-full-hd',
      'extract-x-spaces-recording-320kbps-mp3',
      'download-x-clip-without-watermark',
      'save-twitter-gif-720p-hd',
    ];

    return featuredSlugs.slice(0, limit).map((s) => this.getPageBySlug(s));
  }
}

export const seoService = new SeoService();
