import { NextRequest, NextResponse } from "next/server";
import { addMember } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { MERSIN_ILCELER } from "@/lib/utils";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(`member:${ip}`, 3, 60 * 60 * 1000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Çok fazla başvuru gönderdiniz. Lütfen daha sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const adSoyad = sanitizeText(body.adSoyad, 100);
    const telefon = sanitizePhone(body.telefon);
    const eposta = sanitizeEmail(body.eposta);
    const meslek = sanitizeText(body.meslek, 100);
    const yas = Number(body.yas);
    const ilce = sanitizeText(body.ilce, 50);

    if (!adSoyad || !telefon || !eposta || !meslek || !yas || !ilce) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    if (!MERSIN_ILCELER.includes(ilce as (typeof MERSIN_ILCELER)[number])) {
      return NextResponse.json({ error: "Geçersiz ilçe seçimi." }, { status: 400 });
    }

    if (!Number.isInteger(yas) || yas < 18 || yas > 120) {
      return NextResponse.json(
        { error: "Üyelik için 18-120 yaş aralığında olmalısınız." },
        { status: 400 }
      );
    }

    addMember({ adSoyad, telefon, eposta, meslek, yas, ilce });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Başvuru kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
