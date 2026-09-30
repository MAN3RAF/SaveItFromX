import React, { useState } from 'react';
import { Copy, Clipboard, Download, Smartphone, Laptop, Apple } from 'lucide-react';

export const ThreeStepGuide: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'iphone' | 'android' | 'desktop'>('iphone');

  const deviceGuides = {
    iphone: {
      step1: 'Tap the "Share" icon beneath the tweet in the X app or Safari, then select "Copy Link".',
      step2: 'Open SaveItFromX in Safari, paste the tweet link in the search bar and tap Download.',
      step3: 'Tap the Download button next to 1080p or 320kbps MP3. Video saves directly to your Photos / Files app.',
    },
    android: {
      step1: 'Tap the Share button on the post and tap "Copy link to Tweet".',
      step2: 'Open Chrome or Samsung Internet, go to SaveItFromX and paste the link into the field.',
      step3: 'Select MP4 or MP3 and tap Download. The file is saved directly into your device Downloads / Gallery.',
    },
    desktop: {
      step1: 'Right-click the tweet date or click the Share icon and choose "Copy link to Tweet".',
      step2: 'Navigate to www.saveitfromx.com and press Paste or Ctrl+V in the input box.',
      step3: 'Choose between 1080p Full HD MP4 or 320kbps MP3 for immediate local saving.',
    },
  };

  const currentGuide = deviceGuides[selectedDevice];

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            How to use the Twitter downloader app?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            You can download Twitter videos on Android, iPhone, or any device with a modern web browser.
            The process is 100% free and requires no software installation.
          </p>

          {/* Device Switcher Controls */}
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedDevice('iphone')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDevice === 'iphone'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone (iOS)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDevice('android')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDevice === 'android'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDevice('desktop')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDevice === 'desktop'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Mac & PC</span>
            </button>
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 font-extrabold text-sm flex items-center justify-center">
                  1
                </span>
                <Copy className="w-5 h-5 text-sky-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Copy tweet link</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentGuide.step1}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              x.com/*/status/1839...
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 font-extrabold text-sm flex items-center justify-center">
                  2
                </span>
                <Clipboard className="w-5 h-5 text-sky-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Paste into the input field</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentGuide.step2}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-sky-600 font-medium">
              Click Paste or press Ctrl+V
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center">
                  3
                </span>
                <Download className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Download Twitter video / MP3</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentGuide.step3}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-emerald-600 font-medium">
              Instant 1080p HD & 320k MP3
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
