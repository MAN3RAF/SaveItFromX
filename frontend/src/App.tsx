import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroDownloader } from './components/HeroDownloader';
import { DownloadResultCard } from './components/DownloadResultCard';
import { HowItWorks } from './components/HowItWorks';
import { ThreeStepGuide } from './components/ThreeStepGuide';
import { FeaturesGrid } from './components/FeaturesGrid';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SitemapViewerModal } from './components/SitemapViewerModal';
import { SeoLandingPage } from './components/SeoLandingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { downloadService } from './services/downloadService';
import { authService } from './services/authService';
import { AdSlot } from './components/AdSlot';
import { TweetMediaDetails } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'audio' | 'sitemap' | 'admin' | string>('home');
  const [pSeoSlug, setPSeoSlug] = useState<string | null>(null);
  const [extractedMedia, setExtractedMedia] = useState<TweetMediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => authService.isAuthenticated());

  // Verify server-side session
  useEffect(() => {
    authService.checkSession().then((isValid) => {
      setIsAdminAuthenticated(isValid);
    });
  }, []);

  // Listen to browser URL changes
  useEffect(() => {
    const handleUrl = () => {
      const pathname = window.location.pathname;

      if (pathname.includes('/secretadmin2026here')) {
        setCurrentView('admin');
      } else if (pathname.includes('/sitemap')) {
        setCurrentView('sitemap');
      } else if (pathname.startsWith('/page/')) {
        const slug = pathname.replace('/page/', '');
        setPSeoSlug(slug);
        setCurrentView(`page:${slug}`);
      } else if (pathname === '/twitter-to-mp3') {
        setCurrentView('audio');
      } else {
        setCurrentView('home');
      }
    };

    handleUrl();
    window.addEventListener('popstate', handleUrl);
    return () => window.removeEventListener('popstate', handleUrl);
  }, []);

  const navigateTo = (view: string) => {
    if (view === 'home') {
      window.history.pushState({}, '', '/');
      setCurrentView('home');
      setPSeoSlug(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'audio') {
      window.history.pushState({}, '', '/twitter-to-mp3');
      setCurrentView('audio');
      setPSeoSlug(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'sitemap') {
      window.history.pushState({}, '', '/sitemap.xml');
      setCurrentView('sitemap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      window.history.pushState({}, '', '/secretadmin2026here');
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view.startsWith('page:')) {
      const slug = view.replace('page:', '');
      window.history.pushState({}, '', `/page/${slug}`);
      setPSeoSlug(slug);
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const media = await downloadService.extractMediaDetails(url);
      setExtractedMedia(media);
    } catch (err: any) {
      setError(err?.message || 'Failed to extract video. Please verify the link.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Secret Admin View
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginModal
          onSuccess={() => setIsAdminAuthenticated(true)}
          onCancel={() => navigateTo('home')}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToSite={() => navigateTo('home')}
        onNavigateToPage={(slug) => navigateTo(`page:${slug}`)}
      />
    );
  }

  // Render Sitemap Viewer View
  if (currentView === 'sitemap') {
    return (
      <div>
        <Header onNavigate={navigateTo} currentView={currentView} />
        <SitemapViewerModal
          onNavigateToPage={(slug) => navigateTo(`page:${slug}`)}
          onBack={() => navigateTo('home')}
        />
        <Footer onNavigate={navigateTo} />
      </div>
    );
  }

  // Render pSEO Page
  if (currentView.startsWith('page:') && pSeoSlug) {
    return (
      <div>
        <Header onNavigate={navigateTo} currentView={currentView} />
        <SeoLandingPage
          slug={pSeoSlug}
          onNavigateHome={() => navigateTo('home')}
          onNavigateToSlug={(s) => navigateTo(`page:${s}`)}
        />
        <Footer onNavigate={navigateTo} />
      </div>
    );
  }

  // Render Main Home Downloader or Audio Downloader
  const isAudioMode = currentView === 'audio';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <div>
        {/* Top Header */}
        <Header onNavigate={navigateTo} currentView={currentView} />

        {/* Homepage Top Ad Slot */}
        <AdSlot position="homepage_top" />

        {/* Hero Section with Search Input */}
        <HeroDownloader
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
          onNavigate={navigateTo}
          mode={isAudioMode ? 'audio' : 'video'}
          customTitle={
            isAudioMode
              ? 'Twitter to MP3 Audio Downloader'
              : 'Twitter Video Downloader (X Downloader)'
          }
          customSubtitle={
            isAudioMode
              ? 'Extract and convert Twitter & X videos to 320 kbps high-bitrate MP3 audio online. Fast, free, and crystal clear.'
              : 'Our X Twitter Video Downloader website lets you easily download Twitter video to your device, whether on mobile or PC. Save them in full HD for free from public accounts.'
          }
        />

        {/* Below Downloader Ad Slot */}
        <AdSlot position="below_downloader" />

        {/* Extracted Download Card */}
        {extractedMedia && (
          <>
            <DownloadResultCard media={extractedMedia} onReset={() => setExtractedMedia(null)} />
            <AdSlot position="download_result" />
          </>
        )}

        {/* Explanatory "How our Twitter Downloader works?" */}
        <HowItWorks />

        {/* 3-Step Guide */}
        <ThreeStepGuide />

        {/* Features Bento Grid */}
        <FeaturesGrid />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </div>

      {/* Footer Ad Slot & Footer */}
      <div>
        <AdSlot position="footer" />
        <Footer onNavigate={navigateTo} />
      </div>
    </div>
  );
}
