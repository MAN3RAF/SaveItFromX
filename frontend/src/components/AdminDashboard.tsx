import React, { useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { authService } from '../services/authService';
import { sitemapService } from '../services/sitemapService';
import { seoService } from '../services/seoService';
import {
  Download,
  Film,
  Music,
  Map,
  Users,
  Activity,
  LogOut,
  ArrowLeft,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  ExternalLink,
  HardDriveDownload,
  Shield,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onNavigateToPage: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onNavigateToPage }) => {
  const [summary, setSummary] = useState(() => analyticsService.getSummary());
  const [logs, setLogs] = useState(() => analyticsService.getRecentLogs(25));
  const [filterFormat, setFilterFormat] = useState<'all' | 'mp4' | 'mp3' | 'gif'>('all');
  const [testSlugInput, setTestSlugInput] = useState('download-x-video-iphone-ios');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();
  const subMaps = sitemapService.getSubSitemapsMetadata();

  const handleLogout = () => {
    authService.logout();
    onBackToSite();
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSummary(analyticsService.getSummary());
      setLogs(analyticsService.getRecentLogs(25));
      setIsRefreshing(false);
      setFeedbackNotice('Dashboard metrics and sitemap cache refreshed.');
      setTimeout(() => setFeedbackNotice(null), 3000);
    }, 400);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,TweetUrl,Format,Quality,FileSize,ClientIpHash,Device,Status\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.tweetUrl}","${l.format}","${l.quality}","${l.fileSize}","${l.clientIpHash}","${l.device}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saveitfromx_downloads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter((log) => {
    if (filterFormat === 'all') return true;
    return log.format === filterFormat;
  });

  // Calculate max volume for SVG chart scaling
  const maxDayTotal = Math.max(...summary.dailyTrends.map((d) => d.total));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base">SaveItFromX</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DB Readiness Pill */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>PostgreSQL Schema Ready</span>
            </div>

            <div className="text-xs text-slate-500 hidden sm:block">
              User: <strong>{currentUser?.username || 'Admin'}</strong>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Banner with Refresh Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Traffic & Programmatic SEO Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Real-time download throughput, sitemap crawl health, and programmatic landing page performance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {feedbackNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Downloads
              </span>
              <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Download className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {summary.totalDownloads.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              +14.8% vs last week
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                MP3 Audio Extractions
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Music className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {summary.audioDownloads.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {Math.round((summary.audioDownloads / summary.totalDownloads) * 100)}% of total volume
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                pSEO Pages Indexed
              </span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Map className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {summary.totalPSeoPagesIndexed.toLocaleString()}
            </div>
            <div className="text-xs text-sky-600 font-semibold mt-1">
              Distributed in {subMaps.length} sub-sitemaps
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Avg CDN Speed
              </span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {summary.averageSpeedMbps} Mbps
            </div>
            <div className="text-xs text-slate-500 mt-1">
              99.98% 2-second SLA
            </div>
          </div>
        </div>

        {/* Data Visualizations Section: 7-Day Download Trends & Format Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual 1: 7-Day Download Trend Chart (Span 8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">7-Day Download Volume Trends</h3>
                  <p className="text-xs text-slate-500">
                    Comparing High Definition MP4 Video vs 320k/128k MP3 Audio
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-sky-500 inline-block" />
                    <span className="text-slate-600 font-medium">MP4 Video</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                    <span className="text-slate-600 font-medium">MP3 Audio</span>
                  </div>
                </div>
              </div>

              {/* User-friendly interactive Bar Visualization */}
              <div className="space-y-4 pt-2">
                {summary.dailyTrends.map((day, idx) => {
                  const videoWidthPercent = Math.round((day.video / maxDayTotal) * 100);
                  const audioWidthPercent = Math.round((day.audio / maxDayTotal) * 100);

                  return (
                    <div key={idx} className="group">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700 w-24 shrink-0">{day.date}</span>
                        <div className="flex items-center gap-3 tabular-nums text-slate-600">
                          <span className="text-sky-700 font-medium">{day.video.toLocaleString()} MP4</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-emerald-700 font-medium">{day.audio.toLocaleString()} MP3</span>
                          <span className="text-slate-300">·</span>
                          <span className="font-bold text-slate-900">{day.total.toLocaleString()} total</span>
                        </div>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex p-0.5 gap-0.5">
                        <div
                          style={{ width: `${videoWidthPercent}%` }}
                          className="bg-sky-500 hover:bg-sky-600 rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                          title={`${day.video.toLocaleString()} Video downloads`}
                        >
                          {videoWidthPercent > 20 && `${videoWidthPercent}%`}
                        </div>
                        <div
                          style={{ width: `${audioWidthPercent}%` }}
                          className="bg-emerald-500 hover:bg-emerald-600 rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                          title={`${day.audio.toLocaleString()} Audio downloads`}
                        >
                          {audioWidthPercent > 10 && `${audioWidthPercent}%`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Peak day: {summary.dailyTrends[6].date}</span>
              <span className="text-emerald-600 font-semibold">Continuous CDN scaling active</span>
            </div>
          </div>

          {/* Visual 2: Format & Device Breakdown (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Format Distribution Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Format Distribution</h3>
              <p className="text-xs text-slate-500 mb-4">Breakdown by resolution and codec</p>

              <div className="space-y-3">
                {summary.formatBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{item.format}</span>
                      <span className="font-bold text-slate-900 tabular-nums">{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className={`h-full rounded-full ${
                          item.format.includes('1080p')
                            ? 'bg-sky-600'
                            : item.format.includes('720p')
                            ? 'bg-blue-400'
                            : item.format.includes('320kbps')
                            ? 'bg-emerald-500'
                            : item.format.includes('128kbps')
                            ? 'bg-teal-400'
                            : 'bg-purple-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Distribution Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">User Device Share</h3>
              <p className="text-xs text-slate-500 mb-4">Mobile web vs desktop requests</p>

              <div className="grid grid-cols-2 gap-3 text-center">
                {summary.deviceBreakdown.map((dev, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {dev.percentage}%
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate">{dev.device}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* pSEO Engine & Sitemap Health Visualizer */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
                <Map className="w-4 h-4" />
                <span>Programmatic SEO Health & Architecture</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Sitemap Index: 1 master index pointing to {subMaps.length} sub-sitemaps ({summary.totalPSeoPagesIndexed.toLocaleString()} pages)
              </h3>
            </div>

            {/* Test Any pSEO Slug Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={testSlugInput}
                onChange={(e) => setTestSlugInput(e.target.value)}
                placeholder="Test a slug..."
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => onNavigateToPage(testSlugInput)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Launch Page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sub-Sitemaps Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {subMaps.map((sm) => (
              <div key={sm.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-900">{sm.filename}</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    200 OK
                  </span>
                </div>
                <div className="text-slate-500 tabular-nums">{sm.pageCount} URLs chunked</div>
                <div className="text-[11px] text-slate-400 mt-1">Crawled: Daily / Googlebot</div>
              </div>
            ))}
          </div>

          {/* Top pSEO Landing Pages Table */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Top 6 High-Conversion pSEO Pages
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {summary.topLandingPages.map((lp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-4">
                    <button
                      onClick={() => onNavigateToPage(lp.slug)}
                      className="font-bold text-slate-900 hover:text-sky-600 hover:underline truncate block text-left"
                    >
                      /page/{lp.slug}
                    </button>
                    <span className="text-slate-500 font-mono text-[11px]">Keyword: "{lp.keyword}"</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 tabular-nums">{lp.visits.toLocaleString()}</span>
                    <span className="text-slate-500 block text-[11px]">organic visits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Download Logs Activity Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Download Stream Activity</h3>
              <p className="text-xs text-slate-500">Live feed of processed MP4 and MP3 files</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setFilterFormat('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterFormat === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterFormat('mp4')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterFormat === 'mp4' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  MP4
                </button>
                <button
                  onClick={() => setFilterFormat('mp3')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterFormat === 'mp3' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  MP3
                </button>
              </div>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Tweet Source</th>
                  <th className="py-2.5 px-3">Format / Quality</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Client Device</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{log.id}</td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs truncate text-slate-700 font-mono text-[11px]">
                      {log.tweetUrl}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                          log.format === 'mp3'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.format === 'gif'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {log.quality}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 tabular-nums">{log.fileSize}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">{log.device}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Done</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
