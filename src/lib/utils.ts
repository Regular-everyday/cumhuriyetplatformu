export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const MERSIN_ILCELER = [
  "Akdeniz",
  "Mezitli",
  "Toroslar",
  "Yenişehir",
  "Tarsus",
  "Erdemli",
  "Silifke",
  "Mut",
  "Anamur",
  "Bozyazı",
  "Aydıncık",
  "Gülnar",
  "Çamlıyayla",
] as const;

export const KEMALIZM_ILKELERI = [
  "Cumhuriyetçilik",
  "Laiklik",
  "Milliyetçilik",
  "Halkçılık",
  "Devletçilik",
  "Devrimcilik",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/yonetim", label: "Yönetim Kadrosu" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/haberler", label: "Haberler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/basin", label: "Basında Biz" },
  { href: "/uyelik", label: "Üyelik" },
  { href: "/yayinlar", label: "Yayınlar" },
  { href: "/takvim", label: "Takvim" },
  { href: "/iletisim", label: "İletişim" },
] as const;
