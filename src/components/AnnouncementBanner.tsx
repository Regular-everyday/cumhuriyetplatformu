"use client";

interface AnnouncementBannerProps {
  text: string;
}

export default function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  return (
    <div className="relative overflow-hidden bg-brand-red py-2.5 text-white">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee flex shrink-0 items-center gap-12 px-4">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            {text}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            {text}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            {text}
          </span>
        </div>
        <div
          className="animate-marquee flex shrink-0 items-center gap-12 px-4"
          aria-hidden="true"
        >
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            {text}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            {text}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
