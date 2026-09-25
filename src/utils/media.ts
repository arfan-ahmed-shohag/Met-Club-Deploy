const API_ORIGIN = "https://api.meteorologyclub.com";

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_ORIGIN}${normalizedPath}`.replace("/api/v1", "");
};