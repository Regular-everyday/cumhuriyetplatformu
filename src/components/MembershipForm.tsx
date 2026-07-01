"use client";

interface MembershipFormProps {
  compact?: boolean;
}

export default function MembershipForm({ compact = false }: MembershipFormProps) {
  const formUrl = "https://forms.gle/gCcEVeSPUyQXzdE9A";

  return (
    <div className={`flex flex-col items-center text-center ${compact ? "py-4" : "py-8"}`}>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Google Basvuru Formu
      </h3>
      <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        Uyelik islemlerinizi gerceklestirmek ve kaydinizi tamamlamak icin resmi Google
        Form belgemizi doldurun.
      </p>
      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-6 inline-flex items-center gap-2 px-8 py-3 text-base shadow-md hover:shadow-lg"
      >
        <span>Basvuru Formunu Ac</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
