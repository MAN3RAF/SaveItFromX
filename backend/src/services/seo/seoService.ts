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

const ACTIONS = [
  { verb: 'download', name: 'Download' },
  { verb: 'save', name: 'Save' },
  { verb: 'convert', name: 'Convert' },
  { verb: 'extract', name: 'Extract' },
];

const TARGETS = [
  { key: 'x-video', label: 'X Video', type: 'video' },
  { key: 'twitter-video', label: 'Twitter Video', type: 'video' },
  { key: 'twitter-audio', label: 'Twitter Audio', type: 'audio' },
  { key: 'x-mp3', label: 'X MP3 Audio', type: 'audio' },
  { key: 'twitter-gif', label: 'Twitter GIF', type: 'gif' },
  { key: 'x-spaces-recording', label: 'X Spaces Recording', type: 'audio' },
];

const QUALITIES = [
  { id: '1080p-full-hd', label: '1080p Full HD' },
  { id: '720p-hd', label: '720p HD' },
  { id: '320kbps-mp3', label: '320 kbps High Quality MP3' },
];

const DEVICES = [
  { slug: 'iphone-ios', name: 'iPhone (iOS)', tip: 'Tap Share and select Save Video to Camera Roll.' },
  { slug: 'android-phone', name: 'Android Phone', tip: 'Files save to your Downloads folder.' },
  { slug: 'mac-safari', name: 'Mac & MacBook', tip: 'Command+Click to instantly save high bitrate MP4 streams.' },
  { slug: 'windows-pc', name: 'Windows 10/11 PC', tip: 'Direct download to your Windows Downloads folder.' },
];

class SeoService {
  private allSlugsList: string[] = [];
  private pagesCache = new Map<string, PSeoPage>();

  constructor() {
    this.generateAllPages();
  }

  private generateAllPages() {
    for (const action of ACTIONS) {
      for (const target of TARGETS) {
        for (const device of DEVICES) {
          this.allSlugsList.push(`${action.verb}-${target.key}-${device.slug}`);
        }
      }
    }

    for (const action of ACTIONS) {
      for (const target of TARGETS) {
        for (const quality of QUALITIES) {
          this.allSlugsList.push(`${action.verb}-${target.key}-${quality.id}`);
        }
      }
    }

    for (const target of TARGETS) {
      for (const quality of QUALITIES) {
        for (const device of DEVICES) {
          this.allSlugsList.push(`${target.key}-${quality.id}-${device.slug}`);
        }
      }
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

    const matchedDevice = DEVICES.find((d) => slug.includes(d.slug));
    const matchedQuality = QUALITIES.find((q) => slug.includes(q.id));
    const matchedTarget = TARGETS.find((t) => slug.includes(t.key)) || TARGETS[0];
    const isAudio = matchedTarget.type === 'audio' || slug.includes('mp3') || slug.includes('audio');

    const deviceName = matchedDevice ? matchedDevice.name : 'All Devices';
    const qualityLabel = matchedQuality ? matchedQuality.label : (isAudio ? '320kbps MP3' : '1080p Full HD');
    const mediaName = matchedTarget.label;

    const h1 = `Download ${mediaName} in ${qualityLabel}${matchedDevice ? ` on ${matchedDevice.name}` : ''}`;
    const metaTitle = `${h1} – Free & Fast | SaveItFromX`;
    const metaDescription = `Download and convert ${mediaName} to high-resolution ${isAudio ? 'MP3 audio' : 'MP4 video'} (${qualityLabel}) instantly.`;

    const page: PSeoPage = {
      slug,
      category: matchedDevice ? 'device' : matchedQuality ? 'quality' : 'format',
      h1,
      metaTitle,
      metaDescription,
      targetKeyword: `${matchedTarget.label.toLowerCase()} download`,
      deviceTarget: matchedDevice?.name,
      formatTarget: isAudio ? 'MP3 Audio' : 'MP4 Video',
      qualityTarget: qualityLabel,
      customSummary: `SaveItFromX provides high-speed extraction pipeline for ${mediaName}. No watermarks and crystal-clear bitrates.`,
      stepGuide: [
        { step: 1, title: 'Copy Post Link', desc: 'Open X (Twitter) and tap Copy Link.' },
        { step: 2, title: 'Paste in SaveItFromX', desc: 'Paste the link in the downloader.' },
        { step: 3, title: 'Download Media', desc: `Select ${qualityLabel} and save file.` },
      ],
      faqs: [
        { question: `How to download ${mediaName}?`, answer: `Paste the tweet link into SaveItFromX and select ${qualityLabel}.` },
        { question: `Is it completely free?`, answer: `Yes, SaveItFromX provides unlimited free downloads.` },
      ],
      relatedSlugs: this.allSlugsList.slice(0, 5),
      canonicalUrl: `https://www.saveitfromx.com/page/${slug}`,
    };

    this.pagesCache.set(slug, page);
    return page;
  }
}

export const seoService = new SeoService();
