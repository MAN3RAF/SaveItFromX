import React, { useEffect, useState } from 'react';
import { seoService } from '../services/seoService';
import { PSeoPage, TweetMediaDetails } from '../types';
import { HeroDownloader } from './HeroDownloader';
import { DownloadResultCard } from './DownloadResultCard';
import { downloadService } from '../services/downloadService';
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, Layers, Smartphone, Film, Music } from 'lucide-react';

interface SeoLandingPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateToSlug: (slug: string) => void;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  slug,
  onNavigateHome,
  onNavigateToSlug,
}) => {
  const [pageData, setPageData] = useState<PSeoPage>(() => seoService.getPageBySlug(slug));
  const [extractedMedia, setExtractedMedia] = useState<TweetMediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = seoService.getPageBySlug(slug);
    setPageData(data);
    setExtractedMedia(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update document title and meta description dynamically
    document.title = data.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.metaDescription);
    }
  }, [slug]);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await downloadService.extractMediaDetails(url);
      setExtractedMedia(details);
    } catch (err: any) {
      setError(err?.message || 'Failed to extract media. Please check URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAudioPage = pageData.formatTarget === 'MP3 Audio' || slug.includes('audio') || slug.includes('mp3');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Schema.org JSON-LD for pSEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: pageData.h1,
            description: pageData.metaDescription,
            step: pageData.stepGuide.map((s) => ({
              '@type': 'HowToStep',
              position: s.step,
              name: s.title,
              text: s.desc,
            })),
          }),
        }}
      />

      {/* Breadcrumb Navigation Strip */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={onNavigateHome} className="hover:text-sky-600 transition-colors font-medium">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="capitalize">{pageData.category} Guide</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">{pageData.slug}</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Downloader</span>
          </button>
        </div>
      </div>

      {/* Hero Downloader Pre-Mounted for Conversion */}
      <HeroDownloader
        onSearch={handleSearch}
        isLoading={isLoading}
        error={error}
        onNavigate={onNavigateHome}
        mode={isAudioPage ? 'audio' : 'video'}
        customTitle={pageData.h1}
        customSubtitle={pageData.metaDescription}
      />

      {/* Extracted Result Card */}
      {extractedMedia && (
        <DownloadResultCard media={extractedMedia} onReset={() => setExtractedMedia(null)} />
      )}

      {/* Main Educational & pSEO Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Tailored Value Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            {isAudioPage ? <Music className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            <span>Target Optimization Guide</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {pageData.h1}
          </h2>

          <p className="text-slate-700 text-sm leading-relaxed">
            {pageData.customSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Target Device</span>
              <strong className="text-slate-900">{pageData.deviceTarget || 'Universal (All Devices)'}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Format Target</span>
              <strong className="text-slate-900">{pageData.formatTarget}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Bitrate & Quality</span>
              <strong className="text-emerald-700">{pageData.qualityTarget}</strong>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Step-by-Step: How to {pageData.h1.toLowerCase()}
          </h3>

          <div className="space-y-6">
            {pageData.stepGuide.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {step.step}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tailored FAQ Accordion */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Questions about {pageData.targetKeyword}
          </h3>

          <div className="space-y-3">
            {pageData.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1.5">{faq.question}</div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Linking Mesh for Crawlers & Users */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Related pSEO Guides & Downloads</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {pageData.relatedSlugs.map((relSlug) => (
              <button
                key={relSlug}
                onClick={() => onNavigateToSlug(relSlug)}
                className="text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 px-3 py-1.5 rounded-lg transition-colors text-left"
              >
                {relSlug.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
