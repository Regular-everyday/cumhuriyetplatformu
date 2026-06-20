import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";
import { KEMALIZM_ILKELERI } from "@/lib/utils";

export default async function HakkimizdaPage() {
  const { about } = await readData();

  return (
    <>
      <PageHeader
        title="Hakkımızda"
        subtitle="Cumhuriyet değerlerini korumak ve yaşatmak için bir araya geldik."
      />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-brand-red">Misyonumuz</h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{about.mission}</p>

          <h2 className="mt-10 text-2xl font-bold text-brand-red">Vizyonumuz</h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{about.vision}</p>

          <h2 className="mt-10 text-2xl font-bold text-brand-red">Değerlerimiz</h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Platformumuz, Atatürk&apos;ün belirlediği altı temel ilke doğrultusunda
            faaliyet göstermektedir:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {KEMALIZM_ILKELERI.map((ilke) => (
              <div
                key={ilke}
                className="card border-l-4 border-l-brand-gold text-center"
              >
                <p className="font-bold text-brand-red">{ilke}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-bold text-brand-red">Faaliyet Alanlarımız</h2>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
            {about.activities.map((activity) => (
              <li key={activity} className="flex items-start gap-2">
                <span className="mt-1 text-brand-gold">★</span>
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
