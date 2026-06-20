import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { readData } from "@/lib/db";

export default function YonetimPage() {
  const data = readData();

  return (
    <>
      <PageHeader
        title="Yönetim Kadrosu"
        subtitle="Platformumuzu yöneten gönüllü ekibimizle tanışın."
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.team.map((member) => (
            <div key={member.id} className="card text-center">
              {member.image ? (
                <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-brand-gold/40">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ) : (
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-light text-3xl font-bold text-white">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="mt-1 font-semibold text-brand-gold">{member.role}</p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
