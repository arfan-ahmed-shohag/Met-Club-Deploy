const API_ORIGIN = (import.meta.env.VITE_API_URL || "https://api.meteorologyclub.com/api/v1")
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_ORIGIN}${normalizedPath}`.replace("/api/v1", "");
};
