import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function EtkinliklerPage() {
  const data = await readData();
  const events = [...data.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <>
      <PageHeader
        title="Etkinlikler"
        subtitle="Platformumuzun düzenlediği ve katıldığı etkinlikler."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-6">
          {events.map((event) => {
            const isPast = new Date(event.date) < new Date();
            return (
              <div
                key={event.id}
                className={`card flex flex-col gap-4 sm:flex-row sm:items-center ${
                  isPast ? "opacity-70" : ""
                }`}
              >
                <div className="flex shrink-0 gap-3">
                  <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-red text-white">
                    <span className="text-2xl font-bold">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs uppercase">
                      {new Date(event.date).toLocaleDateString("tr-TR", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  {event.image && (
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {event.title}
                    </h3>
                    {isPast && (
                      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Geçmiş
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
