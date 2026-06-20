import AnnouncementBanner from "@/components/AnnouncementBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { readData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await readData();

  return (
    <>
      <AnnouncementBanner text={data.settings.liveAnnouncement} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
