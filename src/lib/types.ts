export interface Announcement {
  id: string;
  text: string;
  active: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "devam-ediyor" | "tamamlandi" | "planlaniyor";
  image?: string;
}

export interface PressItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  type: "yayin" | "dokuman";
  fileUrl?: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface MembershipApplication {
  id: string;
  adSoyad: string;
  telefon: string;
  eposta: string;
  meslek: string;
  yas: number;
  ilce: string;
  createdAt: string;
  status: "beklemede" | "onaylandi" | "reddedildi";
}

export interface AboutContent {
  mission: string;
  vision: string;
  activities: string[];
}

export interface SiteSettings {
  liveAnnouncement: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  heroSubtitle: string;
  heroDescription: string;
}

export type ContentResource =
  | "announcements"
  | "events"
  | "news"
  | "projects"
  | "press"
  | "publications"
  | "team";

export interface SiteData {
  announcements: Announcement[];
  events: Event[];
  news: NewsItem[];
  projects: Project[];
  press: PressItem[];
  publications: Publication[];
  team: TeamMember[];
  members: MembershipApplication[];
  about: AboutContent;
  settings: SiteSettings;
}
