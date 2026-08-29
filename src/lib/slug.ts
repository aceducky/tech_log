import { customAlphabet } from "nanoid";
import slugify from "slugify";

const MAX_SLUG_BASE_LENGTH = 80;
export const SLUG_SUFFIX_LENGTH = 8;
export const MAX_SLUG_LENGTH = MAX_SLUG_BASE_LENGTH + 1 + SLUG_SUFFIX_LENGTH;

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  SLUG_SUFFIX_LENGTH,
);

export function slugifyTitle(title: string): string {
  const base = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  })
    .slice(0, MAX_SLUG_BASE_LENGTH)
    .replace(/-+$/g, "");

  return `${base || "log"}-${nanoid()}`;
}
