import Image from "next/image";
import Link from "next/link";
import MembershipForm from "@/components/MembershipForm";
import { readData } from "@/lib/db";
import { formatDate, KEMALIZM_ILKELERI } from "@/lib/utils";

export default function HomePage() {
  const data = readData();
  const activeAnnouncements = data.announcements.filter((a) => a.active);
  const upcomingEvents = [...data.events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const latestNews = [...data.news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-red via-brand-red-light to-brand-red">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-gold" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-gold" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 md:flex-row md:py-24">
          <div className="flex-1 text-center md:text-left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-gold">
              {data.settings.heroSubtitle}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Mersin Cumhuriyet Platformu
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">
              {data.settings.heroDescription}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              {KEMALIZM_ILKELERI.map((ilke) => (
                <span
                  key={ilke}
                  className="rounded-full border border-brand-gold/50 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {ilke}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link href="/uyelik" className="btn-primary">
                Üye Ol
              </Link>
              <Link href="/hakkimizda" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-red">
                Hakkımızda
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-full border-4 border-brand-gold p-2 shadow-2xl">
              <Image
                src="/logo.png"
                alt="Mersin Cumhuriyet Platformu"
                width={280}
                height={280}
                className="rounded-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Son Duyurular */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="section-title">Son Duyurular</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {activeAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="card flex items-start gap-4 border-l-4 border-l-brand-gold"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{announcement.text}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(announcement.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yaklaşan Etkinlikler */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="section-title">Yaklaşan Etkinlikler</h2>
              <div className="gold-divider !mx-0" />
            </div>
            <Link
              href="/etkinlikler"
              className="hidden text-sm font-semibold text-brand-red hover:underline sm:block"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card group">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-3 py-1 text-sm font-medium text-brand-red">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(event.date)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-red dark:text-gray-100 dark:group-hover:text-brand-gold">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                  {event.description}
                </p>
                <p className="mt-3 flex items-center gap-1 text-sm text-brand-gold">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/etkinlikler" className="text-sm font-semibold text-brand-red hover:underline">
              Tüm Etkinlikleri Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* Son Haberler */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="section-title">Son Haberler</h2>
              <div className="gold-divider !mx-0" />
            </div>
            <Link
              href="/haberler"
              className="hidden text-sm font-semibold text-brand-red hover:underline sm:block"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latestNews.map((item) => (
              <article key={item.id} className="card group">
                <div className="mb-3 h-1 w-12 rounded-full bg-brand-gold" />
                <time className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.date)}</time>
                <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-brand-red dark:text-gray-100 dark:group-hover:text-brand-gold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3 dark:text-gray-400">{item.excerpt}</p>
                <Link
                  href={`/haberler#${item.id}`}
                  className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
                >
                  Devamını Oku →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Üye Ol */}
      <section className="bg-gradient-to-r from-brand-red to-brand-red-light py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">Üye Ol</h2>
            <div className="gold-divider" />
            <p className="text-white/90">
              Cumhuriyet değerlerine sahip çıkmak için aramıza katılın.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 md:p-8">
            <MembershipForm compact />
          </div>
        </div>
      </section>
    </>
  );
}
