import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default function YayinlarPage() {
  const data = readData();

  return (
    <>
      <PageHeader
        title="Yayınlar / Dokümanlar"
        subtitle="Platformumuzun yayınları ve resmi dokümanları."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-4">
          {data.publications.map((pub) => (
            <div key={pub.id} className="card flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                {pub.type === "dokuman" ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{pub.title}</h3>
                  <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs font-medium text-brand-red">
                    {pub.type === "dokuman" ? "Doküman" : "Yayın"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{pub.description}</p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{formatDate(pub.date)}</p>
              </div>
              {pub.fileUrl ? (
                <a
                  href={pub.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white"
                >
                  İndir
                </a>
              ) : (
                <span className="shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                  Yakında
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
