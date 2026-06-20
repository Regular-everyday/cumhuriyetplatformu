import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function TakvimPage() {
  const data = await readData();
  const events = [...data.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const eventsByMonth = events.reduce<Record<string, typeof events>>(
    (acc, event) => {
      const monthKey = new Date(event.date).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
      });
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(event);
      return acc;
    },
    {}
  );

  return (
    <>
      <PageHeader
        title="Takvim"
        subtitle="Platformumuzun etkinlik takvimi."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
          <div key={month} className="mb-10">
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-brand-red">
              <span className="h-8 w-1 rounded-full bg-brand-gold" />
              {month}
            </h2>
            <div className="space-y-3 pl-4">
              {monthEvents.map((event) => (
                <div
                  key={event.id}
                  className="card flex items-center gap-4 py-4"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-red">
                      {new Date(event.date).getDate()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString("tr-TR", {
                        weekday: "short",
                      })}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.location} — {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
