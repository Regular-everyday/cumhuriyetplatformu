import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api-guard";
import { readData, updateContent } from "@/lib/db";
import { sanitizeId, sanitizeImagePath } from "@/lib/sanitize";
import { deleteTeamImage, saveTeamImage } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const guard = requireAdminMutation(request);
  if (guard) return guard;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const memberId = sanitizeId(formData.get("memberId"));
    const replaceImage = sanitizeImagePath(formData.get("replaceImage"));

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await saveTeamImage(buffer, file.type);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (replaceImage) {
      await deleteTeamImage(replaceImage);
    }

    if (memberId) {
      const data = await readData();
      const member = data.team.find((m) => m.id === memberId);
      if (member?.image && member.image !== replaceImage) {
        await deleteTeamImage(member.image);
      }
      await updateContent("team", memberId, { image: result.url });
    }

    return NextResponse.json({ success: true, url: result.url });
  } catch {
    return NextResponse.json({ error: "Dosya yüklenemedi." }, { status: 500 });
  }
}
