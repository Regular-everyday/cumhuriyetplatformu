import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";

export default function IletisimPage() {
  const { settings } = readData();

  return (
    <>
      <PageHeader
        title="İletişim"
        subtitle="Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">E-posta</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="font-semibold text-brand-red hover:underline"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="font-semibold text-brand-red hover:underline"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adres</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {settings.contactAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Bize Yazın</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Ad Soyad
                </label>
                <input id="name" type="text" className="form-input" />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  E-posta
                </label>
                <input id="email" type="email" className="form-input" />
              </div>
              <div>
                <label htmlFor="message" className="form-label">
                  Mesajınız
                </label>
                <textarea id="message" rows={5} className="form-input" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
