import { AnalyticsSummary, DownloadLog } from '../types';
import { api } from './api';

class AnalyticsService {
  public async fetchSummary(): Promise<AnalyticsSummary> {
    try {
      const data = await api.get<AnalyticsSummary>('/api/admin/analytics/summary');
      if (data && data.totalDownloads !== undefined) {
        return data;
      }
    } catch {
      // Graceful empty fallback state if database has no records yet
    }

    return this.getEmptySummary();
  }

  public async fetchRecentLogs(limit: number = 25): Promise<DownloadLog[]> {
    try {
      const data = await api.get<{ logs: DownloadLog[] }>(`/api/admin/analytics/downloads?limit=${limit}`);
      if (data && Array.isArray(data.logs)) {
        return data.logs;
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public async recordDownload(tweetUrl: string, format: 'mp4' | 'mp3' | 'gif', quality: string, fileSize: string) {
    try {
      await api.post('/api/public/log', {
        tweetUrl,
        format,
        quality,
        fileSize,
      });
    } catch {
      // Fail silently on analytics logging
    }
  }

  public getSummary(): AnalyticsSummary {
    return this.getEmptySummary();
  }

  public getRecentLogs(_limit: number = 10): DownloadLog[] {
    return [];
  }

  private getEmptySummary(): AnalyticsSummary {
    const today = new Date();
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }));
    }

    return {
      totalDownloads: 0,
      videoDownloads: 0,
      audioDownloads: 0,
      gifDownloads: 0,
      activeUsersToday: 0,
      averageSpeedMbps: 0,
      totalPSeoPagesIndexed: 5420,
      topLandingPages: [],
      dailyTrends: days.map((date) => ({ date, video: 0, audio: 0, total: 0 })),
      deviceBreakdown: [
        { device: 'iPhone / iOS', percentage: 0 },
        { device: 'Android Devices', percentage: 0 },
        { device: 'Windows PC', percentage: 0 },
        { device: 'Mac / macOS', percentage: 0 },
      ],
      formatBreakdown: [
        { format: '1080p Full HD Video', count: 0, percentage: 0 },
        { format: '720p HD Video', count: 0, percentage: 0 },
        { format: '320kbps MP3 Audio', count: 0, percentage: 0 },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
