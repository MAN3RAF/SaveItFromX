import React, { useState } from 'react';
import { Download, Clipboard, Sparkles, AlertCircle, Loader2, ArrowRight, PlayCircle } from 'lucide-react';
import { SAMPLE_TWEETS } from '../services/downloadService';
import { relatedTools, RelatedTool } from '../config/relatedTools';

interface HeroDownloaderProps {
  onSearch: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  mode?: 'video' | 'audio';
  customTitle?: string;
  customSubtitle?: string;
  onNavigate?: (view: string) => void;
}

export const HeroDownloader: React.FC<HeroDownloaderProps> = ({
  onSearch,
  isLoading,
  error,
  mode = 'video',
  customTitle,
  customSubtitle,
  onNavigate,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [comingSoonTool, setComingSoonTool] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setPasteNotice('Pasted from clipboard!');
          setTimeout(() => setPasteNotice(null), 2000);
        }
      } else {
        setPasteNotice('Clipboard permission unavailable. Paste manually.');
        setTimeout(() => setPasteNotice(null), 2500);
      }
    } catch {
      setPasteNotice('Please press Ctrl+V or Command+V to paste');
      setTimeout(() => setPasteNotice(null), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onSearch(inputUrl);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    onSearch(sampleUrl);
  };

  const handleToolClick = (tool: RelatedTool) => {
    if (tool.enabled && tool.path && onNavigate) {
      onNavigate(tool.path);
    } else {
      setComingSoonTool(tool.id);
      setTimeout(() => setComingSoonTool(null), 2500);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-500 via-sky-600 to-blue-700 text-white pt-12 pb-16 px-4 sm:px-6">
      {/* Subtle modern background grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Dynamic Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance">
          {customTitle ||
            (mode === 'audio'
              ? 'Twitter to MP3 Audio Downloader'
              : 'Twitter Video Downloader (X Downloader)')}
        </h1>

        <p className="text-sky-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 font-normal">
          {customSubtitle ||
            'Download X (Twitter) videos and MP3 audio to your phone or computer in full HD 1080p, 720p, and 320kbps MP3. 100% free with no registration.'}
        </p>

        {/* Input Bar Card */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-blue-950/20 max-w-3xl mx-auto border border-white/20">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Insert link (e.g., https://x.com/username/status/...)"
                className="w-full pl-4 pr-12 py-3.5 sm:py-4 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                disabled={isLoading}
              />
              {inputUrl && (
                <button
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="absolute right-3 text-xs font-semibold text-slate-400 hover:text-slate-600 px-1.5 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePaste}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors whitespace-nowrap active:scale-95"
              >
                <Clipboard className="w-4 h-4 text-sky-600" />
                <span>Paste</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !inputUrl.trim()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-700/20 transition-all whitespace-nowrap active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Paste notification notice */}
          {pasteNotice && (
            <div className="mt-2 text-xs text-sky-700 bg-sky-50 py-1 px-2 rounded font-medium text-center">
              {pasteNotice}
            </div>
          )}
        </div>

        {/* Legal Terms Notice under Input */}
        <p className="mt-3 text-xs text-sky-100 font-normal">
          By using our service you accept our{' '}
          <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }} className="underline hover:text-white transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }} className="underline hover:text-white transition-colors">
            Privacy Policy
          </a>
        </p>

        {/* How to download tutorial link */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-sky-100">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
          >
            <PlayCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="underline font-semibold">How to download?</span>
            <span className="opacity-90">Watch the guide</span>
          </a>
        </div>

        {/* Sister Downloader Buttons under the Download Box (matching reference screenshot) */}
        <div className="mt-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedTools.map((tool) => {
              const isComingSoonActive = comingSoonTool === tool.id;

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  className="group relative bg-white/95 hover:bg-white text-slate-800 rounded-xl px-3.5 py-3 flex items-center justify-center gap-2.5 font-semibold text-xs sm:text-sm shadow-md shadow-blue-950/15 border border-white/40 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  title={tool.enabled ? `Download from ${tool.domain}` : `${tool.name} (Coming soon)`}
                >
                  <span
                    className={`w-5 h-5 rounded-full ${tool.iconBgClass} flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm`}
                  >
                    {tool.shortLabel}
                  </span>
                  <span className="truncate group-hover:text-sky-600 transition-colors">
                    {tool.domain}
                  </span>

                  {/* Coming soon hover badge */}
                  {!tool.enabled && !isComingSoonActive && (
                    <span className="absolute -top-2 right-2 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-slate-900 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Coming soon
                    </span>
                  )}

                  {/* Active Click notice */}
                  {isComingSoonActive && (
                    <span className="absolute inset-0 bg-slate-900/90 text-white rounded-xl flex items-center justify-center text-xs font-bold animate-in fade-in duration-200">
                      Coming soon!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm max-w-2xl mx-auto flex items-center gap-2.5 text-left shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Quick Demo Test Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/90">
          <span className="text-sky-200 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Quick Test Examples:
          </span>
          {SAMPLE_TWEETS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample.url)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg transition-colors border border-white/15"
            >
              <span>{sample.label}</span>
              <ArrowRight className="w-3 h-3 text-sky-200" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
