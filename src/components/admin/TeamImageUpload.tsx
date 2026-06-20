"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TeamImageUploadProps {
  image?: string;
  memberId?: string;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
}

export default function TeamImageUpload({
  image,
  memberId,
  onUploaded,
  onRemoved,
}: TeamImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(image || "");

  useEffect(() => {
    setPreview(image || "");
  }, [image]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (memberId) formData.append("memberId", memberId);
      if (preview) formData.append("replaceImage", preview);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız");

      setPreview(data.url);
      onUploaded(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setPreview("");
    onRemoved();
  }

  return (
    <div className="sm:col-span-2">
      <label className="mb-2 block text-sm font-medium text-gray-700">Fotoğraf</label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-brand-gold/40 bg-gray-100">
          {preview ? (
            <Image
              src={preview}
              alt="Önizleme"
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              Fotoğraf yok
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white disabled:opacity-50"
          >
            {uploading ? "Yükleniyor..." : preview ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-left text-xs text-red-500 hover:underline"
            >
              Fotoğrafı Kaldır
            </button>
          )}
          <p className="text-xs text-gray-400">JPEG, PNG veya WebP — maks. 2 MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
