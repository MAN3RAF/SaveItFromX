import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq_1',
    question: 'Can I download Twitter videos from private accounts?',
    answer:
      'No. Our Twitter video downloader only works with public tweets — private accounts and protected tweets are blocked by Twitter itself, and we respect copyright and privacy restrictions. Public tweets with videos, GIFs, and audio can be downloaded freely without any restriction.',
  },
  {
    id: 'faq_2',
    question: 'How to use free Twitter downloader for iPhone?',
    answer:
      'To download Twitter videos on an iPhone or iPad, open Safari and navigate to www.saveitfromx.com. In the official X app, tap the Share icon beneath the tweet and select "Copy Link". Paste the URL into SaveItFromX and tap "Download". On iOS 13 and later, Safari lets you save directly to your Files or Photos app without needing any third-party apps like Documents by Readdle.',
  },
  {
    id: 'faq_3',
    question: 'Does SaveItFromX have any download limits?',
    answer:
      'No! You can use SaveItFromX to download Twitter videos and MP3 audio as many times as you wish. There are no daily quotas, bandwidth throttles, or paywalls.',
  },
  {
    id: 'faq_4',
    question: 'How to download Twitter video on Android?',
    answer:
      'On Android, simply open the X app, tap the Share icon on the tweet containing the video, and tap "Copy Link". Open Chrome or Samsung Internet, go to www.saveitfromx.com, paste the link in the box, and tap Download. Select 1080p, 720p, or MP3 and the file will download directly into your Android Downloads folder.',
  },
  {
    id: 'faq_5',
    question: 'How to Convert Twitter Videos to MP4 or MP3 Audio?',
    answer:
      'SaveItFromX includes a built-in demuxing and conversion engine. When you paste any tweet URL, you can choose between video downloads (MP4 in 1080p, 720p, 480p) or pure audio extraction (MP3 in 320 kbps high quality or 128 kbps). Tap the respective button and the converted file downloads instantly.',
  },
  {
    id: 'faq_6',
    question: 'Do I Need to Sign Up to use the Twitter Downloader online?',
    answer:
      'No! Use our free Twitter video downloader website without any account, credit card, or registration. Simply paste a tweet link to begin downloading.',
  },
  {
    id: 'faq_7',
    question: 'Where are Twitter videos saved on my PC or Mac?',
    answer:
      'By default, web browsers save downloaded MP4 videos and MP3 audio into your computer\'s "Downloads" folder. On Windows, press Ctrl+J to view downloaded files. On macOS, press Option+Command+L in Safari or Chrome to open the downloads shelf.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    faq_1: true,
    faq_2: false,
    faq_3: false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
          Everything you need to know about downloading X videos, converting tweets to MP3, and supported devices.
        </p>

        {/* FAQ Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., iPhone, MP3, limits)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 placeholder-slate-400 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            No questions matched your search. Try searching for "iPhone", "audio", or "speed".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">{faq.question}</span>
                  <div className="text-sky-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
