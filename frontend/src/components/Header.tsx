import React, { useState } from 'react';
import { Download, Music, ShieldCheck, Map, Menu, X, Lock } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'audio' | 'sitemap' | 'admin' | string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark with integrated SVG icon */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 via-sky-500 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
              SaveItFrom<span className="text-sky-600">X</span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-sky-600 transition-colors ${currentView === 'home' ? 'text-sky-600 font-semibold' : ''}`}
          >
            Video Downloader
          </button>
          <button
            onClick={() => onNavigate('audio')}
            className={`hover:text-sky-600 transition-colors flex items-center gap-1.5 ${currentView === 'audio' ? 'text-sky-600 font-semibold' : ''}`}
          >
            <Music className="w-4 h-4 text-sky-500" />
            Twitter to MP3
          </button>
          <a href="#how-it-works" className="hover:text-sky-600 transition-colors">
            How It Works
          </a>
          <a href="#faq" className="hover:text-sky-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('admin')}
            title="Admin Dashboard (/secretadmin2026here)"
            className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-800"
          >
            Video Downloader
          </button>
          <button
            onClick={() => {
              onNavigate('audio');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
          >
            <span>Twitter to MP3</span>
            <Music className="w-4 h-4 text-sky-500" />
          </button>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-800"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-800"
          >
            Frequently Asked Questions
          </a>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 flex items-center justify-between"
          >
            <span>Admin Portal (/secretadmin2026here)</span>
            <Lock className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
