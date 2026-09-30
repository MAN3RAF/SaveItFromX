import React from 'react';
import { Info, Check, Shield } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          How our Twitter Downloader works?
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Our online Twitter video downloader works in any modern browser on mobile or desktop. Follow
          the simple instructions below to download any Twitter video and save it as MP4 or MP3.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-9 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Mockup Image with Lazy Loading */}
        <div className="md:col-span-6">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group">
            <img
              src="/src/assets/images/hero_x_media_preview_1790729113764.jpg"
              alt="How SaveItFromX Downloader extracts Twitter videos and audio"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-medium">
                Live URL verification & automatic quality bitrate demuxing
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Step Explanations */}
        <div className="md:col-span-6 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            To download Twitter videos (X video downloader) online in HD, paste the tweet URL into our
            free <strong>SaveItFromX</strong> website and press <strong>"Download"</strong>. Ensure the tweet
            is public and contains a video or audio file.
          </p>

          <p className="text-sm text-slate-700 leading-relaxed">
            Use our tool to easily download videos from Twitter in just a few clicks, without browser
            extensions or signing into an X account.
          </p>

          {/* Clean Editorial Numbered Checklist */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span className="text-xs sm:text-sm text-slate-700 font-medium">
                You're on a page displaying a single tweet;
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span className="text-xs sm:text-sm text-slate-700 font-medium">
                The tweet contains a playable video, gif, or audio clip;
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span className="text-xs sm:text-sm text-slate-700 font-medium">
                Paste the URL into SaveItFromX and choose 1080p, 720p, or 320kbps MP3.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-slate-500 font-medium mb-1">Example of valid links:</div>
            <code className="text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded block truncate font-mono">
              https://x.com/Eminem/status/943590594491772928
            </code>
          </div>

          {/* Legal / Note Banner */}
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>Note:</strong> SaveItFromX does not host copyrighted media and does not support
              unauthorized file re-upload. All media streams are fetched directly from the official Twitter CDN.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
