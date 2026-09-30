import React from 'react';

export type AdPosition = 'homepage_top' | 'below_downloader' | 'download_result' | 'footer';

export interface AdSlotProps {
  position: AdPosition;
  enabled?: boolean;
  provider?: 'adsense' | 'custom' | 'direct';
  clientId?: string;
  slotId?: string;
  responsive?: boolean;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  position,
  enabled = false,
  provider = 'direct',
  clientId,
  slotId,
  responsive = true,
  className = '',
}) => {
  // If ad is disabled in database site settings, render nothing cleanly (no layout shift)
  if (!enabled) {
    return null;
  }

  return (
    <div
      data-ad-position={position}
      data-ad-provider={provider}
      className={`ad-container max-w-4xl mx-auto my-4 p-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 overflow-hidden ${
        responsive ? 'w-full' : 'w-[728px] h-[90px]'
      } ${className}`}
    >
      {provider === 'adsense' && clientId && slotId ? (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={responsive ? 'auto' : undefined}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      ) : (
        <div className="py-3 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Advertisement
          </span>
        </div>
      )}
    </div>
  );
};
