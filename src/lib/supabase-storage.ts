import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "request-attachments";

if (!supabaseUrl) {
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceKey) {
  throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadRequestAttachment(
  file: File,
  trackingNumber: string
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("INVALID_FILE_TYPE");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("FILE_TOO_LARGE");
  }

  const ext =
    file.type === "image/jpeg" ? ".jpg" : file.type === "image/png" ? ".png" : ".webp";
  const timestamp = Date.now();
  const random = crypto.randomBytes(6).toString("hex");
  const filename = `${timestamp}-${random}${ext}`;
  const storagePath = `requests/${trackingNumber}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucketName).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("UPLOAD_FAILED");
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

  return publicUrlData.publicUrl;
}
