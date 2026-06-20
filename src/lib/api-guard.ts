import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedFromRequest, validateOrigin } from "./auth";

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return null;
}

export function requireAdminMutation(request: NextRequest): NextResponse | null {
  const authError = requireAdmin(request);
  if (authError) return authError;

  if (request.method !== "GET" && !validateOrigin(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  return null;
}
