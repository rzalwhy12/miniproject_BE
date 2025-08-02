import slugify from "slugify";

export function generateSlug(text: string) {
  const timestamp = Date.now();
  return slugify(`${text}-${timestamp}`, {
    lower: true,
    strict: true, // buang karakter aneh
    trim: true,
  });
}
