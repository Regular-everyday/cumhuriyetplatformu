import fs from "fs";
import path from "path";
import type {
  AboutContent,
  Announcement,
  ContentResource,
  Event,
  MembershipApplication,
  NewsItem,
  PressItem,
  Project,
  Publication,
  SiteData,
  SiteSettings,
  TeamMember,
} from "./types";
import { sanitizeId } from "./sanitize";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site.json");

const defaultAbout: AboutContent = {
  mission:
    "Mersin Cumhuriyet Platformu, Türkiye Cumhuriyeti'nin temel değerlerini korumak, yaşatmak ve gelecek nesillere aktarmak amacıyla kurulmuş bir sivil toplum örgütüdür.",
  vision:
    "Laik, demokratik ve çağdaş bir Türkiye Cumhuriyeti'nde, Mersin'in her köşesinde cumhuriyet değerlerinin yaşatıldığı bir toplum inşa etmek.",
  activities: [
    "Cumhuriyet değerleri eğitimi ve seminerleri",
    "Gençlik ve çocuk etkinlikleri",
    "Kültür ve sanat programları",
    "Sosyal sorumluluk projeleri",
    "Kamuoyu bilinçlendirme çalışmaları",
  ],
};

const defaultSettings: SiteSettings = {
  liveAnnouncement:
    "Türkiye Cumhuriyeti'ne Sahip Çıkıyoruz! — Üyelik başvuruları devam ediyor.",
  contactEmail: "info@mersincumhuriyet.org",
  contactPhone: "+90 (324) 000 00 00",
  contactAddress: "Mersin, Türkiye",
  heroSubtitle: "Türkiye Cumhuriyeti'ne Sahip Çıkıyoruz!",
  heroDescription:
    "Cumhuriyet değerlerini korumak, yaşatmak ve gelecek nesillere aktarmak için bir araya geldik.",
};

const defaultData: SiteData = {
  announcements: [
    {
      id: "1",
      text: "Mersin Cumhuriyet Platformu üyelik başvuruları başlamıştır!",
      active: true,
      createdAt: "2026-06-01",
    },
    {
      id: "2",
      text: "23 Nisan çocuk şenliği etkinliğimize tüm çocukları bekliyoruz.",
      active: true,
      createdAt: "2026-05-15",
    },
  ],
  events: [
    {
      id: "1",
      title: "Cumhuriyet Değerleri Söyleşisi",
      description:
        "Cumhuriyetin temel değerleri üzerine panel ve söyleşi programı.",
      date: "2026-06-15",
      location: "Mersin Kültür Merkezi",
    },
    {
      id: "2",
      title: "Atatürk'ü Anma Programı",
      description: "10 Kasım anma töreni ve anma programı.",
      date: "2026-11-10",
      location: "Atatürk Parkı, Mersin",
    },
    {
      id: "3",
      title: "Gençlik Buluşması",
      description: "Gençlerle cumhuriyet değerlerini konuşuyoruz.",
      date: "2026-07-20",
      location: "Mersin Üniversitesi Konferans Salonu",
    },
  ],
  news: [
    {
      id: "1",
      title: "Platform Resmi Olarak Kuruldu",
      excerpt:
        "Mersin Cumhuriyet Platformu, cumhuriyet değerlerini yaşatmak amacıyla kuruldu.",
      content:
        "Mersin Cumhuriyet Platformu, cumhuriyet değerlerini korumak ve yaşatmak amacıyla bir araya gelen vatandaşlarımız tarafından kurulmuştur.",
      date: "2026-05-01",
    },
    {
      id: "2",
      title: "İlk Genel Kurul Toplantısı Yapıldı",
      excerpt: "Platformun ilk genel kurul toplantısı yoğun katılımla gerçekleşti.",
      content:
        "Mersin Cumhuriyet Platformu'nun ilk genel kurul toplantısı büyük bir katılımla gerçekleştirildi.",
      date: "2026-05-20",
    },
    {
      id: "3",
      title: "Eğitim Semineri Düzenlendi",
      excerpt: "Cumhuriyet tarihi üzerine eğitim semineri düzenlendi.",
      content:
        "Platformumuz tarafından düzenlenen cumhuriyet tarihi eğitim seminerine çok sayıda katılımcı iştirak etti.",
      date: "2026-06-01",
    },
  ],
  projects: [
    {
      id: "1",
      title: "Cumhuriyet Okuryazarlığı Projesi",
      description:
        "Okullarda cumhuriyet değerleri eğitimi verilmesi amacıyla yürütülen proje.",
      status: "devam-ediyor",
    },
    {
      id: "2",
      title: "Gençlik Liderlik Programı",
      description:
        "Gençlere liderlik ve sivil toplum bilinci kazandırmayı hedefleyen program.",
      status: "planlaniyor",
    },
    {
      id: "3",
      title: "Mersin Kültür Mirası Araştırması",
      description:
        "Mersin'in cumhuriyet dönemi kültür mirasının belgelenmesi projesi.",
      status: "tamamlandi",
    },
  ],
  press: [
    {
      id: "1",
      title: "Mersin'de Yeni Bir Sivil Toplum Hareketi",
      source: "Mersin Haber",
      date: "2026-05-02",
      url: "#",
    },
    {
      id: "2",
      title: "Cumhuriyet Değerleri Platformu Kuruldu",
      source: "Yeni Mersin",
      date: "2026-05-05",
      url: "#",
    },
  ],
  publications: [
    {
      id: "1",
      title: "Mersin Cumhuriyet Platformu Tüzüğü",
      description: "Platform tüzüğünün tam metni.",
      type: "dokuman",
      date: "2026-05-01",
    },
    {
      id: "2",
      title: "Cumhuriyet Değerleri El Kitabı",
      description: "Temel cumhuriyet değerlerini anlatan bilgilendirme kitabı.",
      type: "yayin",
      date: "2026-05-15",
    },
  ],
  team: [
    {
      id: "1",
      name: "Ahmet Yılmaz",
      role: "Başkan",
      bio: "Sivil toplum ve eğitim alanında 20 yıllık deneyime sahiptir.",
    },
    {
      id: "2",
      name: "Ayşe Demir",
      role: "Başkan Yardımcısı",
      bio: "Hukuk alanında uzman, cumhuriyet değerleri savunucusu.",
    },
    {
      id: "3",
      name: "Mehmet Kaya",
      role: "Genel Sekreter",
      bio: "Organizasyon ve iletişim alanında deneyimli.",
    },
    {
      id: "4",
      name: "Fatma Öztürk",
      role: "Sayman",
      bio: "Mali işler ve muhasebe uzmanı.",
    },
    {
      id: "5",
      name: "Ali Çelik",
      role: "Yönetim Kurulu Üyesi",
      bio: "Eğitim ve gençlik çalışmaları koordinatörü.",
    },
    {
      id: "6",
      name: "Zeynep Arslan",
      role: "Yönetim Kurulu Üyesi",
      bio: "Kültür ve sanat etkinlikleri sorumlusu.",
    },
  ],
  members: [],
  about: defaultAbout,
  settings: defaultSettings,
};

function migrateData(data: Partial<SiteData>): SiteData {
  return {
    ...defaultData,
    ...data,
    about: { ...defaultAbout, ...data.about },
    settings: { ...defaultSettings, ...data.settings },
    members: data.members ?? [],
  };
}

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

export function readData(): SiteData {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return migrateData(JSON.parse(raw) as Partial<SiteData>);
}

export function writeData(data: SiteData): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addMember(
  application: Omit<MembershipApplication, "id" | "createdAt" | "status">
): MembershipApplication {
  const data = readData();
  const newMember: MembershipApplication = {
    ...application,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: "beklemede",
  };
  data.members.push(newMember);
  writeData(data);
  return newMember;
}

export function updateMemberStatus(
  id: string,
  status: MembershipApplication["status"]
): boolean {
  const data = readData();
  const member = data.members.find((m) => m.id === id);
  if (!member) return false;
  member.status = status;
  writeData(data);
  return true;
}

export function deleteMember(id: string): boolean {
  const data = readData();
  const index = data.members.findIndex((m) => m.id === sanitizeId(id));
  if (index === -1) return false;
  data.members.splice(index, 1);
  writeData(data);
  return true;
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const data = readData();
  data.settings = { ...data.settings, ...settings };
  writeData(data);
  return data.settings;
}

export function updateAbout(about: Partial<AboutContent>): AboutContent {
  const data = readData();
  data.about = { ...data.about, ...about };
  writeData(data);
  return data.about;
}

type ContentItem =
  | Announcement
  | Event
  | NewsItem
  | Project
  | PressItem
  | Publication
  | TeamMember;

export function createContent(
  resource: ContentResource,
  item: Omit<ContentItem, "id">
): ContentItem {
  const data = readData();
  const newItem = { ...item, id: generateId() } as ContentItem;
  (data[resource] as ContentItem[]).push(newItem);
  writeData(data);
  return newItem;
}

export function updateContent(
  resource: ContentResource,
  id: string,
  updates: Partial<ContentItem>
): ContentItem | null {
  const data = readData();
  const items = data[resource] as ContentItem[];
  const index = items.findIndex((item) => item.id === sanitizeId(id));
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, id: items[index].id };
  writeData(data);
  return items[index];
}

export function deleteContent(resource: ContentResource, id: string): boolean {
  const data = readData();
  const items = data[resource] as ContentItem[];
  const index = items.findIndex((item) => item.id === sanitizeId(id));
  if (index === -1) return false;
  items.splice(index, 1);
  writeData(data);
  return true;
}
