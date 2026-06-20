import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getSupabaseAdmin, getTeamImagesBucket, isSupabaseConfigured } from "./supabase";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "team");
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

const MIME_TO_EXT: Record<string, AllowedExtension> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function detectImageType(buffer: Buffer): AllowedExtension | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

function extractStoragePathFromUrl(imagePath: string): string | null {
  if (!isSupabaseConfigured()) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;

  const bucket = getTeamImagesBucket();

  try {
    const url = new URL(imagePath);
    const expectedPrefix = `/storage/v1/object/public/${bucket}/`;
    if (!url.pathname.startsWith(expectedPrefix)) {
      return null;
    }
    return decodeURIComponent(url.pathname.slice(expectedPrefix.length));
  } catch {
    return null;
  }
}

export function isValidTeamImagePath(imagePath: string): boolean {
  if (
    /^\/uploads\/team\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(imagePath)
  ) {
    return true;
  }

  return extractStoragePathFromUrl(imagePath) !== null;
}

function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function deleteTeamImage(imagePath: string | undefined): Promise<void> {
  if (!imagePath || !isValidTeamImagePath(imagePath)) return;

  if (isSupabaseConfigured()) {
    const storagePath = extractStoragePathFromUrl(imagePath);
    if (!storagePath) return;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .storage
      .from(getTeamImagesBucket())
      .remove([storagePath]);

    if (error) {
      throw new Error(`Supabase görsel silme hatasi: ${error.message}`);
    }
    return;
  }

  const filePath = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function saveTeamImage(
  buffer: Buffer,
  declaredMime: string
): Promise<{ url: string } | { error: string }> {
  if (buffer.length > MAX_FILE_SIZE) {
    return { error: "Dosya boyutu 2 MB'dan küçük olmalıdır." };
  }

  const detectedExt = detectImageType(buffer);
  if (!detectedExt) {
    return { error: "Yalnızca JPEG, PNG veya WebP dosyaları yüklenebilir." };
  }

  const mimeExt = MIME_TO_EXT[declaredMime];
  if (!mimeExt) {
    return { error: "Geçersiz dosya türü." };
  }

  if (
    (detectedExt === "jpg" && mimeExt !== "jpg") ||
    (detectedExt !== "jpg" && detectedExt !== mimeExt)
  ) {
    return { error: "Dosya içeriği bildirilen türle eşleşmiyor." };
  }

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${detectedExt}`;

  if (isSupabaseConfigured()) {
    const bucket = getTeamImagesBucket();
    const storagePath = `team/${filename}`;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: declaredMime,
        upsert: false,
      });

    if (error) {
      return { error: `Supabase yükleme hatasi: ${error.message}` };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return { url: data.publicUrl };
  }

  ensureUploadDir();
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  return { url: `/uploads/team/${filename}` };
}
