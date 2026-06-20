import PageHeader from "@/components/PageHeader";
import MembershipForm from "@/components/MembershipForm";

export default function UyelikPage() {
  return (
    <>
      <PageHeader
        title="Üyelik"
        subtitle="Cumhuriyet değerlerine sahip çıkmak için aramıza katılın."
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 rounded-xl bg-brand-red/5 dark:bg-brand-red/20 p-6">
          <h2 className="text-lg font-bold text-brand-red">Üyelik Koşulları</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• 18 yaşını doldurmuş olmak</li>
            <li>• Cumhuriyet değerlerine bağlı olmak</li>
            <li>• Platform tüzüğünü kabul etmek</li>
            <li>• Başvuru formunu eksiksiz doldurmak</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
            Üyelik Başvuru Formu
          </h2>
          <MembershipForm />
        </div>
      </div>
    </>
  );
}
