import React, { useState } from 'react';
import { TweetMediaDetails, MediaQualityOption, MediaFormat } from '../types';
import { Download, Film, Music, CheckCircle2, Heart, Repeat, Share2, Play, Volume2 } from 'lucide-react';
import { downloadService } from '../services/downloadService';
import { analyticsService } from '../services/analyticsService';

interface DownloadResultCardProps {
  media: TweetMediaDetails;
  onReset: () => void;
}

export const DownloadResultCard: React.FC<DownloadResultCardProps> = ({ media, onReset }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'gif'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [completedNotice, setCompletedNotice] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const filteredOptions = media.options.filter((opt) => {
    if (activeTab === 'all') return true;
    return opt.format === activeTab;
  });

  const handleDownload = (option: MediaQualityOption) => {
    setDownloadingId(option.id);
    setDownloadProgress(20);

    const step1 = setTimeout(() => setDownloadProgress(65), 250);
    const step2 = setTimeout(() => {
      setDownloadProgress(100);

      // Trigger the real file download in the browser
      downloadService.triggerDirectDownload(option, media.authorHandle);

      // Log to analytics service
      analyticsService.recordDownload(
        media.tweetUrl,
        option.extension === 'mp3' ? 'mp3' : option.extension === 'gif' ? 'gif' : 'mp4',
        option.quality,
        option.sizeFormatted
      );

      setCompletedNotice(`Downloaded "${option.quality}" successfully! Check your downloads folder.`);
      setTimeout(() => {
        setDownloadingId(null);
        setDownloadProgress(0);
      }, 700);

      setTimeout(() => setCompletedNotice(null), 4000);
    }, 600);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
    };
  };

  return (
    <div className="max-w-4xl mx-auto -mt-6 px-4 sm:px-6 relative z-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Media successfully extracted</span>
            <span className="text-slate-400 font-normal">·</span>
            <span className="text-slate-500 font-normal">Ready for high-speed download</span>
          </div>

          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Download Another Video
          </button>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Tweet & Media Preview */}
          <div className="lg:col-span-5 space-y-4">
            {/* Author Profile */}
            <div className="flex items-start gap-3">
              {avatarError ? (
                <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm shrink-0">
                  {media.authorName.charAt(0)}
                </div>
              ) : (
                <img
                  src={media.authorAvatar}
                  alt={media.authorName}
                  loading="lazy"
                  onError={() => setAvatarError(true)}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{media.authorName}</h4>
                  {media.isVerified && (
                    <svg className="w-4 h-4 text-sky-500 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  @{media.authorHandle} · {media.postedAt}
                </div>
              </div>
            </div>

            {/* Tweet Content */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              "{media.content}"
            </p>

            {/* Video or Audio Preview Player */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-video flex items-center justify-center">
              {media.videoPreviewUrl ? (
                <video
                  src={media.videoPreviewUrl}
                  controls
                  playsInline
                  poster={media.thumbnailUrl}
                  className="w-full h-full object-cover"
                />
              ) : media.audioPreviewUrl ? (
                <div className="p-6 text-center w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-sky-950 text-white">
                  <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-sky-300 mb-1">Audio Stream Detected</div>
                  <div className="text-xs text-slate-400 mb-4">Duration: {media.durationFormatted}</div>
                  <audio src={media.audioPreviewUrl} controls className="w-full max-w-xs h-9" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={media.thumbnailUrl}
                    alt="Media preview thumbnail"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Preview Available
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tweet Social Proof Stats */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                {media.likeCount.toLocaleString()} likes
              </span>
              <span className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-emerald-500" />
                {media.retweetCount.toLocaleString()} reposts
              </span>
              <span>{media.viewCount.toLocaleString()} views</span>
            </div>
          </div>

          {/* Right Column: Download Formats & Qualities */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Available Download Options</h3>
                <span className="text-xs text-slate-500 font-medium">Original Quality</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({media.options.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    activeTab === 'video'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video (MP4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    activeTab === 'audio'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Audio (MP3)</span>
                </button>
              </div>

              {/* Download Items List */}
              <div className="space-y-2.5">
                {filteredOptions.map((option) => {
                  const isCurrentDownloading = downloadingId === option.id;

                  return (
                    <div
                      key={option.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        option.isPopular
                          ? 'border-sky-300 bg-sky-50/50 hover:border-sky-400'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{option.quality}</span>
                          {option.isPopular && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-600 text-white">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Format: {option.extension.toUpperCase()}</span>
                          <span aria-hidden="true">·</span>
                          {option.bitrate && <span>{option.bitrate}</span>}
                          {option.bitrate && <span aria-hidden="true">·</span>}
                          <span className="font-semibold text-slate-700">{option.sizeFormatted}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownload(option)}
                        disabled={isCurrentDownloading}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                          option.format === 'audio'
                            ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                        }`}
                      >
                        {isCurrentDownloading ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{downloadProgress}%</span>
                          </div>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>
                              Download {option.extension === 'mp3' ? 'MP3' : 'MP4'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success message banner */}
            {completedNotice && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{completedNotice}</span>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Direct CDN stream · No watermarks</span>
              <span>Unlimited free downloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
