"use client";

import { useState } from "react";
import { MERSIN_ILCELER } from "@/lib/utils";

interface MembershipFormProps {
  compact?: boolean;
}

export default function MembershipForm({ compact = false }: MembershipFormProps) {
  const [form, setForm] = useState({
    adSoyad: "",
    telefon: "",
    eposta: "",
    meslek: "",
    yas: "",
    ilce: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yas: parseInt(form.yas, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      setStatus("success");
      setMessage("Üyelik başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçilecektir.");
      setForm({ adSoyad: "", telefon: "", eposta: "", meslek: "", yas: "", ilce: "", website: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "grid gap-5 sm:grid-cols-2"}>
        <div>
          <label htmlFor="adSoyad" className="form-label">
            Ad Soyad *
          </label>
          <input
            id="adSoyad"
            type="text"
            required
            className="form-input"
            value={form.adSoyad}
            onChange={(e) => setForm({ ...form, adSoyad: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="telefon" className="form-label">
            Telefon *
          </label>
          <input
            id="telefon"
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            className="form-input"
            value={form.telefon}
            onChange={(e) => setForm({ ...form, telefon: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="eposta" className="form-label">
            E-posta *
          </label>
          <input
            id="eposta"
            type="email"
            required
            className="form-input"
            value={form.eposta}
            onChange={(e) => setForm({ ...form, eposta: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="meslek" className="form-label">
            Meslek *
          </label>
          <input
            id="meslek"
            type="text"
            required
            className="form-input"
            value={form.meslek}
            onChange={(e) => setForm({ ...form, meslek: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="yas" className="form-label">
            Yaş *
          </label>
          <input
            id="yas"
            type="number"
            required
            min={18}
            max={120}
            className="form-input"
            value={form.yas}
            onChange={(e) => setForm({ ...form, yas: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="ilce" className="form-label">
            İlçe *
          </label>
          <select
            id="ilce"
            required
            className="form-input"
            value={form.ilce}
            onChange={(e) => setForm({ ...form, ilce: e.target.value })}
          >
            <option value="">İlçe seçiniz</option>
            {MERSIN_ILCELER.map((ilce) => (
              <option key={ilce} value={ilce}>
                {ilce}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            status === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Gönderiliyor..." : "Üyelik Başvurusu Gönder"}
      </button>
    </form>
  );
}
