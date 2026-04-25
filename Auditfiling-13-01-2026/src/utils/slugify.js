export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[’'"]/g, "")       // remove quotes & smart apostrophes
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric chars with "-"
    .replace(/^-+|-+$/g, "");    // trim leading/trailing hyphens
}
