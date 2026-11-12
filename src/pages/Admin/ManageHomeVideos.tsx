import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { isAxiosError } from "axios";
import { LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";
import { resolveMediaUrl } from "../../utils/media";

const PAGE_SIZE = 10;
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

type HomeVideo = {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  videoLink: string;
  videoLinkEn?: string;
  thumbnailImage: string;
  createdAt: string;
};
type VideoForm = {
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  videoLink: string;
  videoLinkEn: string;
  thumbnail: File | null;
};
type VideoResponse = { data?: HomeVideo[]; meta?: { total?: number } };
const emptyForm = (): VideoForm => ({
  name: "",
  nameEn: "",
  title: "",
  titleEn: "",
  videoLink: "",
  videoLinkEn: "",
  thumbnail: null,
});

function responseError(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;
  const body = error.response?.data as
    { errorMessage?: unknown; message?: unknown } | undefined;
  if (typeof body?.errorMessage === "string") return body.errorMessage;
  if (typeof body?.message === "string") return body.message;
  return fallback;
}

function isValidYouTubeUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "youtu.be") return Boolean(url.pathname.slice(1));
    return (
      ["youtube.com", "m.youtube.com"].includes(hostname) &&
      Boolean(
        url.searchParams.get("v") ||
        url.pathname.match(/^\/(embed|shorts)\/[^/]+/),
      )
    );
  } catch {
    return false;
  }
}

export default function ManageHomeVideos() {
  const axios = useAxiosProtected();
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const formDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editing, setEditing] = useState<HomeVideo | null>(null);
  const [form, setForm] = useState<VideoForm>(emptyForm);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (!dialog) return;
    if (formOpen && !dialog.open) dialog.showModal();
    else if (!formOpen && dialog.open) dialog.close();
  }, [formOpen]);

  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<VideoResponse>("/videos", {
        params: { page, limit: PAGE_SIZE },
      });
      setVideos(Array.isArray(data?.data) ? data.data.slice(0, PAGE_SIZE) : []);
      setTotal(Number(data?.meta?.total) || 0);
    } catch (error) {
      toast.error(responseError(error, "Videos could not be loaded."));
    } finally {
      setIsLoading(false);
    }
  }, [axios, page]);

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
  };
  const openEdit = (video: HomeVideo) => {
    setEditing(video);
    setForm({
      name: video.name,
      nameEn: video.nameEn || "",
      title: video.title,
      titleEn: video.titleEn || "",
      videoLink: video.videoLink,
      videoLinkEn: video.videoLinkEn || "",
      thumbnail: null,
    });
    setFormOpen(true);
  };

  const thumbnailPreview = useMemo(
    () => (form.thumbnail ? URL.createObjectURL(form.thumbnail) : null),
    [form.thumbnail],
  );
  useEffect(
    () => () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    },
    [thumbnailPreview],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.name.trim().length < 2 || form.name.trim().length > 120)
      return toast.error("Name must be 2–120 characters.");
    if (form.nameEn.trim().length < 2 || form.nameEn.trim().length > 120)
      return toast.error("English name must be 2–120 characters.");
    if (form.title.trim().length < 2 || form.title.trim().length > 200)
      return toast.error("Title must be 2–200 characters.");
    if (form.titleEn.trim().length < 2 || form.titleEn.trim().length > 200)
      return toast.error("English title must be 2–200 characters.");
    if (!isValidYouTubeUrl(form.videoLink.trim()))
      return toast.error("Enter a valid YouTube video URL.");
    if (form.videoLinkEn.trim() && !isValidYouTubeUrl(form.videoLinkEn.trim()))
      return toast.error("Enter a valid English YouTube video URL.");
    if (!editing && !form.thumbnail)
      return toast.error("A thumbnail image is required.");
    if (form.thumbnail && !ALLOWED_TYPES.has(form.thumbnail.type))
      return toast.error("Use a PNG, JPEG, WEBP, or GIF thumbnail.");
    if (form.thumbnail && form.thumbnail.size > MAX_THUMBNAIL_SIZE)
      return toast.error("Thumbnail must be 5 MB or smaller.");

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("nameEn", form.nameEn.trim());
    payload.append("title", form.title.trim());
    payload.append("titleEn", form.titleEn.trim());
    payload.append("videoLink", form.videoLink.trim());
    payload.append("videoLinkEn", form.videoLinkEn.trim());
    if (form.thumbnail) payload.append("thumbnail", form.thumbnail);
    setSaving(true);
    try {
      if (editing) await axios.patch(`/videos/${editing.id}`, payload);
      else await axios.post("/videos", payload);
      toast.success(editing ? "Video updated." : "Video added.");
      setEditing(null);
      setForm(emptyForm());
      setFormOpen(false);
      if (!editing && page !== 1) setPage(1);
      else await loadVideos();
    } catch (error) {
      toast.error(responseError(error, "Video could not be saved."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (video: HomeVideo) => {
    const confirmation = await Swal.fire({
      title: "ভিডিওটি মুছে ফেলবেন?",
      text: `“${video.name}” হোম পেজ থেকে সরিয়ে দেওয়া হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c3231a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });
    if (!confirmation.isConfirmed) return;
    setSaving(true);
    try {
      await axios.delete(`/videos/${video.id}`);
      toast.success("Video removed.");
      if (videos.length === 1 && page > 1) setPage((current) => current - 1);
      else await loadVideos();
    } catch (error) {
      toast.error(responseError(error, "Video could not be removed."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-red-700">
              Home page
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Video showcase
            </h2>
            <p className="mt-2 text-slate-600">
              Manage the YouTube videos shown on the home page. Each video needs
              its own thumbnail.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white! hover:bg-red-800"
          >
            <Plus size={18} />
            Add video
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">Videos</h3>
            <p className="mt-1 text-sm text-slate-500">
              {total} total · 10 per page
            </p>
          </div>
          {pageCount > 1 && (
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <button
                type="button"
                disabled={page === 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-lg border px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                {page} / {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount || isLoading}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
                className="rounded-lg border px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
        {isLoading ? (
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            aria-busy="true"
            role="status"
          >
            <span className="sr-only">Loading videos</span>
            {Array.from({ length: 6 }, (_, index) => (
              <article
                key={index}
                aria-hidden="true"
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video w-full bg-slate-100" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="mt-4 flex justify-end gap-2">
                    <div className="h-9 w-16 rounded-lg bg-slate-100" />
                    <div className="h-9 w-20 rounded-lg bg-slate-100" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            No videos yet. Add one to show it on the home page.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={resolveMediaUrl(video.thumbnailImage)}
                  alt={video.title}
                  className="aspect-video w-full bg-slate-100 object-cover"
                />
                <div className="p-4">
                  <p className="font-bold text-slate-900">{video.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {video.title}
                  </p>
                  <a
                    href={video.videoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block truncate text-sm text-red-700 underline"
                  >
                    বাংলা URL: {video.videoLink}
                  </a>
                  {video.videoLinkEn && (
                    <a
                      href={video.videoLinkEn}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-sm text-red-700 underline"
                    >
                      English URL: {video.videoLinkEn}
                    </a>
                  )}
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(video)}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void remove(video)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {formOpen &&
        createPortal(
          <dialog
            ref={formDialogRef}
            onCancel={(event) => {
              event.preventDefault();
              if (!saving) {
                setEditing(null);
                setForm(emptyForm());
                setFormOpen(false);
              }
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget && !saving) {
                setEditing(null);
                setForm(emptyForm());
                setFormOpen(false);
              }
            }}
            className="fixed inset-0 m-0 flex h-dvh w-screen max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4 backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
          >
            <form
              onSubmit={(event) => void submit(event)}
              className="relative max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
            >
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm());
                  setFormOpen(false);
                }}
                disabled={saving}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
              <h3 className="pr-10 text-2xl font-black text-slate-900">
                {editing ? "Edit video" : "Add home page video"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Video name (বাংলা)
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Video name (English)
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.nameEn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        nameEn: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Title / description (বাংলা)
                  <textarea
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Title / description (English)
                  <textarea
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.titleEn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        titleEn: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  YouTube video URL (বাংলা · required)
                  <input
                    required
                    type="url"
                    value={form.videoLink}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        videoLink: event.target.value,
                      }))
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  YouTube video URL (English · optional)
                  <input
                    type="url"
                    value={form.videoLinkEn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        videoLinkEn: event.target.value,
                      }))
                    }
                    placeholder="Optional English video URL"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    English pages use this link when provided; otherwise they
                    use the Bengali video.
                  </span>
                </label>
              </div>
              {editing && (
                <img
                  src={resolveMediaUrl(editing.thumbnailImage)}
                  alt="Current thumbnail"
                  className="mx-auto h-64 aspect-[9/16] rounded-xl bg-slate-100 object-cover"
                />
              )}
              <label className="block text-sm font-semibold text-slate-700">
                Thumbnail image{" "}
                {editing
                  ? "(optional replacement, max 5 MB)"
                  : "(required, max 5 MB)"}
                <input
                  required={!editing}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => {
                    const thumbnail = event.currentTarget.files?.[0] || null;
                    setForm((current) => ({ ...current, thumbnail }));
                  }}
                  className="mt-1 block w-full rounded-xl border border-slate-200 p-2 font-normal"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  For the best fit, upload a portrait thumbnail with a 9:16
                  ratio. PNG, JPEG, WEBP, or GIF; max 5 MB.
                </span>
                {editing && (
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    The current thumbnail stays unless you choose a replacement.
                  </span>
                )}
              </label>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="mx-auto h-64 aspect-[9/16] rounded-xl bg-slate-100 object-cover"
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyForm());
                    setFormOpen(false);
                  }}
                  disabled={saving}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 font-bold !text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <LoaderCircle size={17} className="animate-spin" />
                  )}
                  {editing ? "Save video" : "Add video"}
                </button>
              </div>
            </form>
          </dialog>,
          document.body,
        )}
    </div>
  );
}
