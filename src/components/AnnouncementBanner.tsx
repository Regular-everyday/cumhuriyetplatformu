"use client";

interface AnnouncementBannerProps {
  text: string;
}

export default function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  const items = Array(8).fill(text);
  return (
    <div className="relative overflow-hidden bg-brand-red py-2.5 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-12 px-4">
          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-12 px-4" aria-hidden="true">
          {items.map((item, index) => (
            <span key={`dup-${index}`} className="flex items-center gap-2 text-sm font-semibold tracking-wide md:text-base">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
