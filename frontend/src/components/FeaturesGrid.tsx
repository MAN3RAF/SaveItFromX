import React from 'react';
import { Sparkles, Film, Music, ShieldCheck, Zap, Smartphone } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Why millions choose SaveItFromX
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Built from the ground up for speed, fidelity, and versatility. Download X videos in crisp 1080p
          or extract high-fidelity 320kbps MP3 audio with one click.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Marquee Feature 1: Dual Video + Audio Engine (Span 7) */}
        <div className="md:col-span-7 bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 rounded-lg bg-sky-50 text-sky-600">
                <Film className="w-5 h-5" />
              </span>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Music className="w-5 h-5" />
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Full HD Video & 320kbps Studio MP3 Audio
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Unlike ordinary downloaders that only offer low-bitrate 480p videos, SaveItFromX merges the
              best video and audio tracks from X’s CDN servers to provide full 1080p Full HD video as well
              as dedicated high-bitrate 320 kbps MP3 conversion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-800">1080p Full HD</div>
              <div className="text-slate-500">Up to 60 FPS Video</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-800">320 kbps Audio</div>
              <div className="text-slate-500">High Fidelity MP3</div>
            </div>
          </div>
        </div>

        {/* Feature 2: Multi-device Responsive (Span 5) */}
        <div className="md:col-span-5 bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <span className="p-2 rounded-lg bg-sky-50 text-sky-600 inline-block">
                <Smartphone className="w-5 h-5" />
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Optimized for iPhone, Android & PC
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Zero software installations, browser extensions, or jailbreaks. Works smoothly in Safari,
              Chrome, Edge, and Samsung Internet.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <img
              src="/src/assets/images/feature_multi_device_1790729123804.jpg"
              alt="SaveItFromX on multiple devices"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-28 object-cover"
            />
          </div>
        </div>

        {/* Feature 3: No Watermark (Span 4) */}
        <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600 inline-block mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">No Added Watermarks</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your downloaded videos and MP3 files stay 100% clean with zero added logos, text stamps, or
            promotional overlays.
          </p>
        </div>

        {/* Feature 4: Ultra CDN Speed (Span 4) */}
        <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 inline-block mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">Direct CDN Streaming</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Direct high-speed pipe to Twitter CDN edge locations allows 2-second parsing and instantaneous
            local file downloads.
          </p>
        </div>

        {/* Feature 5: Privacy Safe (Span 4) */}
        <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 inline-block mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">100% Anonymous & Secure</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We do not store your downloads, cookies, or personal data. Files transfer directly from the
            host CDN to your browser.
          </p>
        </div>
      </div>
    </section>
  );
};
