import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import RichText from "@/components/RichText";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function HaberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await readData();
  const newsItem = data.news.find((item) => item.id === id);

  if (!newsItem) {
    notFound();
  }

  return (
    <>
      <PageHeader title={newsItem.title} subtitle={formatDate(newsItem.date)} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/haberler"
          className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline dark:text-brand-gold"
        >
          ← Tüm Haberlere Dön
        </Link>
        {newsItem.image && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 sm:h-96">
            <img src={newsItem.image} alt={newsItem.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="card">
          <RichText content={newsItem.content} />
        </div>
      </div>
    </>
  );
}
