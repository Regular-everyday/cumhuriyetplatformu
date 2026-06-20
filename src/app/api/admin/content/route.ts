import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api-guard";
import {
  createContent,
  deleteContent,
  deleteMember,
  readData,
  updateAbout,
  updateContent,
  updateMemberStatus,
  updateSettings,
} from "@/lib/db";
import { deleteTeamImage } from "@/lib/upload";
import type { ContentResource, MembershipApplication } from "@/lib/types";
import {
  sanitizeEmail,
  sanitizeId,
  sanitizeImagePath,
  sanitizePhone,
  sanitizeText,
  sanitizeUrl,
} from "@/lib/sanitize";

const VALID_RESOURCES: ContentResource[] = [
  "announcements",
  "events",
  "news",
  "projects",
  "press",
  "publications",
  "team",
];

const VALID_MEMBER_STATUS: MembershipApplication["status"][] = [
  "beklemede",
  "onaylandi",
  "reddedildi",
];

function sanitizeContentData(resource: ContentResource, data: Record<string, unknown>) {
  switch (resource) {
    case "announcements":
      return {
        text: sanitizeText(data.text, 500),
        active: Boolean(data.active),
        createdAt: sanitizeText(data.createdAt, 20) || new Date().toISOString().slice(0, 10),
      };
    case "events":
      return {
        title: sanitizeText(data.title, 200),
        description: sanitizeText(data.description, 2000),
        date: sanitizeText(data.date, 20),
        location: sanitizeText(data.location, 200),
        image: sanitizeUrl(data.image) || undefined,
      };
    case "news":
      return {
        title: sanitizeText(data.title, 200),
        excerpt: sanitizeText(data.excerpt, 500),
        content: sanitizeText(data.content, 10000),
        date: sanitizeText(data.date, 20),
        image: sanitizeUrl(data.image) || undefined,
      };
    case "projects":
      return {
        title: sanitizeText(data.title, 200),
        description: sanitizeText(data.description, 2000),
        status: ["devam-ediyor", "tamamlandi", "planlaniyor"].includes(
          String(data.status)
        )
          ? (data.status as "devam-ediyor" | "tamamlandi" | "planlaniyor")
          : "planlaniyor",
        image: sanitizeUrl(data.image) || undefined,
      };
    case "press":
      return {
        title: sanitizeText(data.title, 200),
        source: sanitizeText(data.source, 100),
        date: sanitizeText(data.date, 20),
        url: sanitizeUrl(data.url) || undefined,
      };
    case "publications":
      return {
        title: sanitizeText(data.title, 200),
        description: sanitizeText(data.description, 1000),
        type: data.type === "yayin" ? "yayin" : "dokuman",
        date: sanitizeText(data.date, 20),
        fileUrl: sanitizeUrl(data.fileUrl) || undefined,
      };
    case "team":
      return {
        name: sanitizeText(data.name, 100),
        role: sanitizeText(data.role, 100),
        bio: sanitizeText(data.bio, 1000),
        image: data.image === "" ? undefined : sanitizeImagePath(data.image) || undefined,
      };
    default:
      return {};
  }
}

export async function POST(request: NextRequest) {
  const guard = requireAdminMutation(request);
  if (guard) return guard;

  try {
    const body = await request.json();
    const action = sanitizeText(body.action, 50);

    if (action === "create") {
      const resource = body.resource as ContentResource;
      if (!VALID_RESOURCES.includes(resource)) {
        return NextResponse.json({ error: "Geçersiz kaynak." }, { status: 400 });
      }
      const sanitized = sanitizeContentData(resource, body.data ?? {});
      const item = await createContent(resource, sanitized);
      return NextResponse.json({ success: true, item });
    }

    if (action === "update") {
      const resource = body.resource as ContentResource;
      const id = sanitizeId(body.id);
      if (!VALID_RESOURCES.includes(resource) || !id) {
        return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
      }
      const sanitized = sanitizeContentData(resource, body.data ?? {});

      if (resource === "team") {
        const data = await readData();
        const existing = data.team.find((m) => m.id === id);
        const newImage = (sanitized as { image?: string }).image;
        if (existing?.image && existing.image !== newImage) {
          await deleteTeamImage(existing.image);
        }
      }

      const item = await updateContent(resource, id, sanitized);
      if (!item) {
        return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
      }
      return NextResponse.json({ success: true, item });
    }

    if (action === "delete") {
      const resource = body.resource as ContentResource;
      const id = sanitizeId(body.id);
      if (!VALID_RESOURCES.includes(resource) || !id) {
        return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
      }

      if (resource === "team") {
        const data = await readData();
        const existing = data.team.find((m) => m.id === id);
        if (existing?.image) {
          await deleteTeamImage(existing.image);
        }
      }

      const success = await deleteContent(resource, id);
      if (!success) {
        return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "updateMemberStatus") {
      const memberId = sanitizeId(body.memberId);
      const status = body.status as MembershipApplication["status"];
      if (!memberId || !VALID_MEMBER_STATUS.includes(status)) {
        return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
      }
      const success = await updateMemberStatus(memberId, status);
      if (!success) {
        return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "deleteMember") {
      const memberId = sanitizeId(body.memberId);
      if (!memberId) {
        return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
      }
      const success = await deleteMember(memberId);
      if (!success) {
        return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "updateSettings") {
      const settings = body.settings ?? {};
      const updated = await updateSettings({
        liveAnnouncement: sanitizeText(settings.liveAnnouncement, 300),
        contactEmail: sanitizeEmail(settings.contactEmail),
        contactPhone: sanitizePhone(settings.contactPhone),
        contactAddress: sanitizeText(settings.contactAddress, 300),
        heroSubtitle: sanitizeText(settings.heroSubtitle, 200),
        heroDescription: sanitizeText(settings.heroDescription, 500),
      });
      return NextResponse.json({ success: true, settings: updated });
    }

    if (action === "updateAbout") {
      const about = body.about ?? {};
      const activities = Array.isArray(about.activities)
        ? about.activities.map((a: unknown) => sanitizeText(a, 200)).filter(Boolean)
        : undefined;
      const updated = await updateAbout({
        mission: sanitizeText(about.mission, 3000),
        vision: sanitizeText(about.vision, 3000),
        activities,
      });
      return NextResponse.json({ success: true, about: updated });
    }

    return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 500 });
  }
}
