const defaultApiUrl = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : "https://api.meteorologyclub.com/api/v1";

const API_ORIGIN = (import.meta.env.VITE_API_URL || defaultApiUrl)
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_ORIGIN}${normalizedPath}`.replace("/api/v1", "");
};

/** Tutorial thumbnails are always served from the production API host. */
export const resolveTutorialImageUrl = (value: string) => {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  return ("https://api.meteorologyclub.com" + value).replace("/api/v1", "");
};

/** Embed URL for youtu.be, youtube.com/watch and youtube.com/embed links, else null. */
export const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  try {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};
