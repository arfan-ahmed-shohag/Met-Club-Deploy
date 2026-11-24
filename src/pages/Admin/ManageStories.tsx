import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent } from "react";
import { ImagePlus, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";
import { resolveMediaUrl } from "../../utils/media";
import { getApiErrorMessage, getUploadErrorMessage } from "../../utils/apiError";

const PAGE_SIZE = 9;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

type Story = {
  id: string;
  quoteBn: string;
  quoteEn: string;
  authorNameBn: string;
  authorNameEn: string;
  authorDetailBn: string;
  authorDetailEn: string;
  imageUrl: string;
};
type StoryForm = Omit<Story, "id" | "imageUrl"> & { image: File | null };
type StoryResponse = { data?: Story[]; meta?: { total?: number } };

const emptyForm = (): StoryForm => ({
  quoteBn: "",
  quoteEn: "",
  authorNameBn: "",
  authorNameEn: "",
  authorDetailBn: "",
  authorDetailEn: "",
  image: null,
});

export default function ManageStories() {
  const axios = useAxiosProtected();
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const formDialogRef = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState<StoryForm>(emptyForm);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<StoryResponse>("/stories", {
        params: { page, limit: PAGE_SIZE },
      });
      setStories(Array.isArray(data?.data) ? data.data : []);
      setTotal(Number(data?.meta?.total) || 0);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Stories could not be loaded."));
    } finally {
      setIsLoading(false);
    }
  }, [axios, page]);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (formOpen && dialog && !dialog.open) dialog.showModal();
    if (!formOpen && dialog?.open) dialog.close();
  }, [formOpen]);

  const preview = useMemo(
    () => (form.image ? URL.createObjectURL(form.image) : null),
    [form.image],
  );
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
  };
  const openEdit = (story: Story) => {
    setEditing(story);
    setForm({
      quoteBn: story.quoteBn,
      quoteEn: story.quoteEn,
      authorNameBn: story.authorNameBn,
      authorNameEn: story.authorNameEn,
      authorDetailBn: story.authorDetailBn,
      authorDetailEn: story.authorDetailEn,
      image: null,
    });
    setFormOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing && !form.image) return toast.error("Choose a story image.");
    if (form.image && !ACCEPTED_TYPES.has(form.image.type))
      return toast.error("Use a PNG, JPEG, WEBP, or GIF image.");
    if (form.image && form.image.size > MAX_IMAGE_SIZE)
      return toast.error("Story image must be 5 MB or smaller.");

    const payload = new FormData();
    payload.append("quoteBn", form.quoteBn.trim());
    payload.append("quoteEn", form.quoteEn.trim());
    payload.append("authorNameBn", form.authorNameBn.trim());
    payload.append("authorNameEn", form.authorNameEn.trim());
    payload.append("authorDetailBn", form.authorDetailBn.trim());
    payload.append("authorDetailEn", form.authorDetailEn.trim());
    if (form.image) payload.append("image", form.image);
    setIsSaving(true);
    try {
      if (editing) await axios.patch(`/stories/${editing.id}`, payload);
      else await axios.post("/stories", payload);
      toast.success(editing ? "Story updated." : "Story published.");
      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm());
      if (!editing && page !== 1) setPage(1);
      else await loadStories();
    } catch (error) {
      toast.error(getUploadErrorMessage(error, "Story could not be saved."));
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (story: Story) => {
    const confirmation = await Swal.fire({
      title: "গল্পটি মুছে ফেলবেন?",
      text: `“${story.authorNameBn}” গল্পটি সাইট থেকে সরিয়ে দেওয়া হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c3231a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });
    if (!confirmation.isConfirmed) return;
    setIsSaving(true);
    try {
      await axios.delete(`/stories/${story.id}`);
      toast.success("Story removed.");
      if (stories.length === 1 && page > 1) setPage((current) => current - 1);
      else await loadStories();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Story could not be removed."));
    } finally {
      setIsSaving(false);
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
            <h2 className="mt-2 text-3xl font-black text-slate-900">Stories</h2>
            <p className="mt-2 text-slate-600">
              Publish bilingual learner and community stories. The 3 newest
              appear on the home page.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            Add story
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Published stories
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {total} total · 9 per page
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
            <span className="sr-only">Loading stories</span>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            <ImagePlus className="mx-auto mb-3" />
            <p>No stories yet. Add the first one.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/10] bg-slate-100">
                  <img
                    src={resolveMediaUrl(story.imageUrl)}
                    alt={story.authorNameEn}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
                    “{story.quoteBn}”
                  </p>
                  <p className="mt-3 font-bold text-red-900">
                    {story.authorNameBn}
                  </p>
                  <p className="text-xs text-slate-500">
                    {story.authorDetailBn}
                  </p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(story)}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => void remove(story)}
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
              // A file input's picker-cancel event bubbles here; only handle the dialog's own (Escape).
              if (event.target !== event.currentTarget) return;
              event.preventDefault();
              if (!isSaving) {
                setFormOpen(false);
                setEditing(null);
                setForm(emptyForm());
              }
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget && !isSaving) {
                setFormOpen(false);
                setEditing(null);
                setForm(emptyForm());
              }
            }}
            className="fixed inset-0 m-0 flex h-dvh w-screen max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4 backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
          >
            <form
              onSubmit={(event) => void submit(event)}
              className="relative max-h-[92vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
            >
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditing(null);
                  setForm(emptyForm());
                }}
                disabled={isSaving}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
              <h3 className="pr-10 text-2xl font-black text-slate-900">
                {editing ? "Edit story" : "Add story"}
              </h3>
              <label className="block text-sm font-semibold text-slate-700">
                Story image {editing ? "(optional replacement)" : "(required)"}
                <input
                  required={!editing}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => {
                    const image = event.currentTarget.files?.[0] || null;
                    setForm((current) => ({ ...current, image }));
                  }}
                  className="mt-1 block w-full rounded-xl border border-slate-200 p-2 font-normal"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  PNG, JPEG, WEBP, or GIF · max 5 MB
                </span>
              </label>
              {editing && (
                <img
                  src={resolveMediaUrl(editing.imageUrl)}
                  alt="Current story image"
                  className="mx-auto h-40 max-w-full object-contain"
                />
              )}
              {preview && (
                <img
                  src={preview}
                  alt="Story image preview"
                  className="mx-auto h-40 max-w-full object-contain"
                />
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  গল্প / Quote (বাংলা)
                  <textarea
                    required
                    minLength={8}
                    maxLength={1500}
                    value={form.quoteBn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        quoteBn: event.target.value,
                      }))
                    }
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Story / Quote (English)
                  <textarea
                    required
                    minLength={8}
                    maxLength={1500}
                    value={form.quoteEn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        quoteEn: event.target.value,
                      }))
                    }
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  লেখকের নাম
                  <textarea
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.authorNameBn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        authorNameBn: event.target.value,
                      }))
                    }
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Author name
                  <textarea
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.authorNameEn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        authorNameEn: event.target.value,
                      }))
                    }
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  পরিচয় / detail
                  <textarea
                    maxLength={160}
                    value={form.authorDetailBn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        authorDetailBn: event.target.value,
                      }))
                    }
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Author detail
                  <textarea
                    maxLength={160}
                    value={form.authorDetailEn}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        authorDetailEn: event.target.value,
                      }))
                    }
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditing(null);
                    setForm(emptyForm());
                  }}
                  disabled={isSaving}
                  className="rounded-xl border px-4 py-2.5 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 font-bold text-white disabled:opacity-50"
                >
                  {isSaving && (
                    <LoaderCircle size={17} className="animate-spin" />
                  )}
                  {editing ? "Save story" : "Publish story"}
                </button>
              </div>
            </form>
          </dialog>,
          document.body,
        )}
    </div>
  );
}
