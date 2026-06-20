import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function BasinPage() {
  const data = await readData();
  const press = [...data.press].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <PageHeader
        title="Basında Biz"
        subtitle="Platformumuz hakkında basında çıkan haberler."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-4">
          {press.map((item) => (
            <div
              key={item.id}
              className="card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {item.source} — {formatDate(item.date)}
                </p>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-semibold text-brand-red hover:underline"
                >
                  Haberi Oku →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
