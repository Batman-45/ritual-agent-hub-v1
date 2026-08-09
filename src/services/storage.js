import { supabase } from "./supabase";

export async function uploadImage(file, bucket) {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  console.log(`Attempting upload to bucket: ${bucket}, file: ${fileName}`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    console.error(`Storage upload error (bucket: ${bucket}):`, error);
    throw error;
  }

  console.log(`Upload successful for: ${fileName}`);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  console.log(`Generated public URL:`, urlData.publicUrl);
  return urlData.publicUrl;
}