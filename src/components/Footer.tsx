import Image from "next/image";
import Link from "next/link";
import { KEMALIZM_ILKELERI, NAV_LINKS } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-brand-red text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Image
              src="/logo.png"
              alt="Mersin Cumhuriyet Platformu"
              width={80}
              height={80}
              className="rounded-full"
            />
            <h3 className="mt-4 text-lg font-bold">Mersin Cumhuriyet Platformu</h3>
            <p className="mt-2 text-sm text-white/80">
              Türkiye Cumhuriyeti&apos;ne Sahip Çıkıyoruz!
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-brand-gold">Hızlı Bağlantılar</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {NAV_LINKS.slice(0, 8).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-brand-gold">Altı Ok</h4>
            <div className="flex flex-wrap gap-2">
              {KEMALIZM_ILKELERI.map((ilke) => (
                <span
                  key={ilke}
                  className="rounded-full border border-brand-gold/40 px-3 py-1 text-xs text-white/90"
                >
                  {ilke}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Mersin Cumhuriyet Platformu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
