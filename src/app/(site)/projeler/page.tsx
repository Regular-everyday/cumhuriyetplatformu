import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";

const statusLabels = {
  "devam-ediyor": { label: "Devam Ediyor", color: "bg-green-100 text-green-800" },
  tamamlandi: { label: "Tamamlandı", color: "bg-blue-100 text-blue-800" },
  planlaniyor: { label: "Planlanıyor", color: "bg-yellow-100 text-yellow-800" },
};

export default async function ProjelerPage() {
  const data = await readData();

  return (
    <>
      <PageHeader
        title="Projeler"
        subtitle="Cumhuriyet değerlerini yaşatmak için yürüttüğümüz projeler."
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project) => {
            const status = statusLabels[project.status];
            return (
              <div key={project.id} className="card">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                >
                  {status.label}
                </span>
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {project.title}
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
