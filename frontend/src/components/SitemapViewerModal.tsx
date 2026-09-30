import React, { useState } from 'react';
import { sitemapService, CHUNK_SIZE } from '../services/sitemapService';
import { seoService } from '../services/seoService';
import { Copy, Check, FileCode, ExternalLink, Layers, ArrowLeft, Download } from 'lucide-react';

interface SitemapViewerModalProps {
  onNavigateToPage: (slug: string) => void;
  onBack: () => void;
}

export const SitemapViewerModal: React.FC<SitemapViewerModalProps> = ({ onNavigateToPage, onBack }) => {
  const [selectedSubMapId, setSelectedSubMapId] = useState<number | null>(null); // null means index
  const [activeTab, setActiveTab] = useState<'visual' | 'xml' | 'robots'>('visual');
  const [copied, setCopied] = useState(false);

  const subMaps = sitemapService.getSubSitemapsMetadata();
  const totalPages = seoService.getTotalPagesCount();

  const currentXml =
    activeTab === 'robots'
      ? sitemapService.generateRobotsTxt()
      : selectedSubMapId === null
      ? sitemapService.generateSitemapIndexXml()
      : sitemapService.generateSubSitemapXml(selectedSubMapId);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const filename =
      activeTab === 'robots'
        ? 'robots.txt'
        : selectedSubMapId === null
        ? 'sitemap.xml'
        : `sitemap_${selectedSubMapId}.xml`;
    const blob = new Blob([currentXml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Downloader</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Domain: www.saveitfromx.com</span>
            <span>·</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Sitemap Engine v2.6 Active
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>Programmatic SEO (pSEO) Sitemap Architecture</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Crawler-Optimized Sitemap Index
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                Because SaveItFromX generates <strong>{totalPages.toLocaleString()} targeted landing pages</strong>,
                we partition them into chunked sub-sitemaps (<strong>{CHUNK_SIZE} URLs</strong> per sub-sitemap)
                so Googlebot, Bingbot, and other crawlers fetch each file without timeout or payload limits.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex sm:flex-col gap-3 shrink-0 text-left sm:text-right">
              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {totalPages.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">pSEO Landing Pages</div>
              </div>
              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                <div className="text-2xl font-extrabold text-sky-600 tabular-nums">
                  {subMaps.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Sub-Sitemaps</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'visual'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Visual Sitemap Tree
            </button>
            <button
              onClick={() => setActiveTab('xml')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'xml'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>
                Raw XML: {selectedSubMapId === null ? 'sitemap.xml (Index)' : `sitemap_${selectedSubMapId}.xml`}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('robots')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'robots'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              robots.txt
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied XML' : 'Copy Content'}</span>
            </button>
            <button
              onClick={handleDownloadXml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Visual Tree Explorer */}
        {activeTab === 'visual' && (
          <div className="space-y-4">
            {/* Master Index Indicator */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-sky-800">Root Index Endpoint</div>
                <div className="text-sm font-bold text-sky-950 font-mono">
                  https://www.saveitfromx.com/sitemap.xml
                </div>
                <div className="text-xs text-sky-700 mt-0.5">
                  Standard Sitemaps.org XML Index containing pointers to {subMaps.length} sub-sitemaps
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSubMapId(null);
                  setActiveTab('xml');
                }}
                className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-white border border-sky-300 rounded-xl hover:bg-sky-100/50 transition-colors shrink-0"
              >
                Inspect Index XML
              </button>
            </div>

            {/* Sub-Sitemaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subMaps.map((sm) => (
                <div
                  key={sm.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {sm.filename}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {sm.pageCount} URLs
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono truncate mb-3">{sm.url}</div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Sample Pages Inside:
                      </div>
                      {sm.sampleUrls.map((sampleUrl, sIdx) => {
                        const slug = sampleUrl.split('/page/')[1];
                        return (
                          <div key={sIdx} className="flex items-center justify-between gap-2 py-0.5">
                            <span className="text-slate-600 truncate font-mono text-[11px]">{slug}</span>
                            <button
                              onClick={() => onNavigateToPage(slug)}
                              className="text-sky-600 hover:text-sky-800 hover:underline shrink-0 text-[11px] font-semibold flex items-center gap-0.5"
                            >
                              <span>Preview</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Last Modified: {sm.lastmod}</span>
                    <button
                      onClick={() => {
                        setSelectedSubMapId(sm.id);
                        setActiveTab('xml');
                      }}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                    >
                      View Raw XML →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2 & 3: Code / Raw XML Viewer */}
        {(activeTab === 'xml' || activeTab === 'robots') && (
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl overflow-hidden text-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-slate-300 font-semibold">
                  {activeTab === 'robots'
                    ? 'https://www.saveitfromx.com/robots.txt'
                    : selectedSubMapId === null
                    ? 'https://www.saveitfromx.com/sitemap.xml'
                    : `https://www.saveitfromx.com/sitemap_${selectedSubMapId}.xml`}
                </span>
              </div>

              {activeTab === 'xml' && selectedSubMapId !== null && (
                <button
                  onClick={() => setSelectedSubMapId(null)}
                  className="text-sky-400 hover:underline text-xs"
                >
                  Switch to Index (sitemap.xml)
                </button>
              )}
            </div>

            <pre className="text-xs font-mono leading-relaxed overflow-x-auto max-h-[600px] text-sky-200 p-2 select-all">
              {currentXml}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
