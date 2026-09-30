import React, { useState } from 'react';
import { Globe, Lock, Map, ExternalLink } from 'lucide-react';
import { seoService } from '../services/seoService';
import { relatedTools } from '../config/relatedTools';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [currentLang, setCurrentLang] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = ['English', 'Español', 'Français', 'Deutsch', 'Português', '日本語', 'Italiano'];
  const featuredPSeo = seoService.getFeaturedPages(6);

  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-10 px-4 sm:px-6 text-slate-600">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Brand & Wordmark */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              SaveItFrom<span className="text-sky-600">X</span>
            </span>
          </button>
          <p className="text-xs text-slate-400">© 2018–2026 SaveItFromX. All rights reserved.</p>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-500 pt-1">
            <button onClick={() => onNavigate('home')} className="hover:text-sky-600 transition-colors">
              Terms of Service
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={() => onNavigate('home')} className="hover:text-sky-600 transition-colors">
              Privacy Policy
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={() => onNavigate('home')} className="hover:text-sky-600 transition-colors">
              Contact & API
            </button>
          </div>
        </div>

        {/* Popular pSEO Matrix Landing Pages Cluster */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 text-center sm:text-left">
            Popular Programmatic SEO Landing Pages
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {featuredPSeo.map((page) => (
              <button
                key={page.slug}
                onClick={() => onNavigate(`page:${page.slug}`)}
                className="text-left text-slate-600 hover:text-sky-600 hover:underline truncate py-1 transition-colors flex items-center gap-1"
              >
                <span className="text-sky-500">›</span>
                <span className="truncate">{page.h1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sister Downloaders (matching reference screenshot with Coming Soon state) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-700">
          {relatedTools.map((tool) => {
            if (tool.enabled && tool.path) {
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onNavigate(tool.path!)}
                  className="flex items-center gap-1.5 hover:text-sky-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                >
                  <span className={`w-5 h-5 rounded-full ${tool.iconBgClass} flex items-center justify-center text-[10px] font-bold`}>
                    {tool.shortLabel}
                  </span>
                  <span>{tool.name}</span>
                </button>
              );
            }

            return (
              <div
                key={tool.id}
                className="group relative flex items-center gap-1.5 text-slate-500 cursor-default select-none transition-colors"
                title={`${tool.name} (Coming soon)`}
              >
                <span className={`w-5 h-5 rounded-full ${tool.iconBgClass} flex items-center justify-center text-[10px] font-bold opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {tool.shortLabel}
                </span>
                <span className="group-hover:text-slate-700 transition-colors">{tool.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  Coming soon
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Language Selector & Discreet Admin Link */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentLang}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      lang === currentLang ? 'bg-sky-50 text-sky-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Discreet Admin Portal Link (Hidden route /secretadmin2026here) */}
          <div className="flex items-center gap-4 text-slate-400">
            <span>Domain: www.saveitfromx.com</span>
            <span>·</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
              title="Secret Admin Panel /secretadmin2026here"
            >
              <Lock className="w-3 h-3" />
              <span>Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
