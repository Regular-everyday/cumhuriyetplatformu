import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  validateAdminPassword,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();
    const password = sanitizeText(body.password, 128);

    if (!password || !validateAdminPassword(password)) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre." }, { status: 401 });
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: "Giriş işlemi başarısız." }, { status: 400 });
  }
}
