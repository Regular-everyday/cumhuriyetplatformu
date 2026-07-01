import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*#`_\-~>]/g, "")
    .trim();
}

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
            <Link
              key={item.id}
              href={`/haberler/${item.id}`}
              className="card group block transition-shadow hover:shadow-lg md:flex md:flex-row md:gap-6"
            >
              {item.image && (
                <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-xl md:mb-0 md:w-64">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <time className="text-sm font-medium text-brand-gold">
                    {formatDate(item.date)}
                  </time>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900 group-hover:text-brand-red dark:text-gray-100 dark:group-hover:text-brand-gold">
                    {item.title}
                  </h2>
                  <p className="mt-4 line-clamp-3 leading-relaxed text-gray-600 dark:text-gray-400">
                    {stripMarkdown(item.excerpt || item.content)}
                  </p>
                </div>
                <span className="mt-6 inline-block text-sm font-semibold text-brand-red group-hover:underline">
                  Devamını Oku →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
