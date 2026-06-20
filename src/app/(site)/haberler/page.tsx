import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function HaberlerPage() {
  const data = await readData();
  const news = [...data.news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <PageHeader
        title="Haberler"
        subtitle="Platformumuzdan en güncel haberler."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-8">
          {news.map((item) => (
            <article key={item.id} id={item.id} className="card scroll-mt-24">
              <time className="text-sm font-medium text-brand-gold">
                {formatDate(item.date)}
              </time>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
