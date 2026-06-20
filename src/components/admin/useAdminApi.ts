"use client";

import type { SiteData } from "@/lib/types";

export async function adminFetch(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<{ success?: boolean; error?: string; [key: string]: unknown }> {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "İşlem başarısız");
  return data;
}

export async function loadAdminData(): Promise<SiteData> {
  const res = await fetch("/api/admin/data");
  if (!res.ok) throw new Error("Veriler yüklenemedi");
  return res.json();
}
