import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ImagePlus,
  LoaderCircle,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";
import { resolveMediaUrl } from "../../utils/media";
import { getApiErrorMessage } from "../../utils/apiError";

const PAGE_SIZE = 9;
const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

type GalleryImage = {
  id: string;
  imageUrl: string;
  alt: string;
  createdAt: string;
};
type GalleryResponse = { data?: GalleryImage[]; meta?: { total?: number } };

function validateImage(file: File | null) {
  if (!file) return "Choose an image first.";
  if (!ACCEPTED_TYPES.has(file.type))
    return "Use a PNG, JPEG, WEBP, or GIF image.";
  if (file.size > 5 * 1024 * 1024) return "Image size must be 5 MB or less.";
  return "";
}

export default function ManageGallery() {
  const axios = useAxiosProtected();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newAlt, setNewAlt] = useState("");
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [replacementImage, setReplacementImage] = useState<File | null>(null);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<GalleryResponse>("/gallery", {
        params: { page, limit: PAGE_SIZE },
      });
      setImages(Array.isArray(data?.data) ? data.data.slice(0, PAGE_SIZE) : []);
      setTotal(Number(data?.meta?.total) || 0);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Gallery images could not be loaded."));
    } finally {
      setIsLoading(false);
    }
  }, [axios, page]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  const addImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalidReason = validateImage(newImage);
    if (invalidReason) return toast.error(invalidReason);
    if (newAlt.trim().length > 200)
      return toast.error("Description must be 200 characters or fewer.");
    const form = new FormData();
    form.append("image", newImage!);
    form.append("alt", newAlt.trim());
    setIsSaving(true);
    try {
      await axios.post("/gallery", form);
      toast.success("Gallery image added.");
      setNewImage(null);
      setNewAlt("");
      const firstPage = page === 1;
      if (!firstPage) setPage(1);
      else await loadImages();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Gallery image could not be added."));
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (image: GalleryImage) => {
    setEditingImage(image);
    setEditAlt(image.alt);
    setReplacementImage(null);
  };

  const saveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingImage) return;
    if (editAlt.trim().length > 200)
      return toast.error("Description must be 200 characters or fewer.");
    if (replacementImage) {
      const invalidReason = validateImage(replacementImage);
      if (invalidReason) return toast.error(invalidReason);
    }
    const form = new FormData();
    form.append("alt", editAlt.trim());
    if (replacementImage) form.append("image", replacementImage);
    setIsSaving(true);
    try {
      await axios.patch(`/gallery/${editingImage.id}`, form);
      toast.success("Gallery image updated.");
      setEditingImage(null);
      await loadImages();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Gallery image could not be updated."));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteImage = async (image: GalleryImage) => {
    const confirmation = await Swal.fire({
      title: "ছবিটি মুছে ফেলবেন?",
      text: "এই ছবিটি গ্যালারি থেকে সরিয়ে দেওয়া হবে।",
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
      await axios.delete(`/gallery/${image.id}`);
      toast.success("Gallery image removed.");
      if (images.length === 1 && page > 1) setPage((current) => current - 1);
      else await loadImages();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Gallery image could not be removed."));
    } finally {
      setIsSaving(false);
    }
  };

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-red-700">
          Home page
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">
          Photo gallery
        </h2>
        <p className="mt-2 text-slate-600">
          Add and manage the photos displayed in the home page gallery. Images
          are loaded 9 at a time.
        </p>
        <form
          onSubmit={(event) => void addImage(event)}
          className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5"
        >
          <label className="block text-sm font-semibold text-slate-700">
            Image (PNG, JPEG, WEBP, GIF · max 5 MB)
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) =>
                setNewImage(event.currentTarget.files?.[0] || null)
              }
              className="mt-2 block w-full rounded-xl border border-slate-200 p-2 text-sm"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Image description (optional)
            <input
              value={newAlt}
              onChange={(event) => setNewAlt(event.target.value)}
              maxLength={200}
              placeholder="Describe this photo"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving || !newImage}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}{" "}
            Add image
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Gallery images
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {total} image{total === 1 ? "" : "s"} · 9 per page
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
            <span className="sr-only">Loading gallery images</span>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <article
                key={index}
                aria-hidden="true"
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-lg bg-slate-100" />
                    <div className="h-9 w-9 rounded-lg bg-slate-100" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            <ImagePlus className="mx-auto mb-3" />
            <p>No gallery photos yet. Add the first one above.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/10] bg-slate-100">
                  <img
                    src={resolveMediaUrl(image.imageUrl)}
                    alt={image.alt || "MET Club gallery"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-3">
                  <p
                    className="min-w-0 flex-1 truncate text-sm text-slate-600"
                    title={image.alt}
                  >
                    {image.alt || "No description"}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(image)}
                      aria-label="Edit image"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteImage(image)}
                      disabled={isSaving}
                      aria-label="Remove image"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-red-100 text-red-700 hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editingImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving)
              setEditingImage(null);
          }}
        >
          <form
            onSubmit={(event) => void saveEdit(event)}
            className="relative w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setEditingImage(null)}
              disabled={isSaving}
              aria-label="Close edit dialog"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            <h3 className="pr-10 text-xl font-black text-slate-900">
              Edit gallery image
            </h3>
            <img
              src={resolveMediaUrl(editingImage.imageUrl)}
              alt={editingImage.alt || "Current gallery image"}
              className="mt-5 aspect-video w-full rounded-xl bg-slate-100 object-cover"
            />
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Image description
              <input
                value={editAlt}
                onChange={(event) => setEditAlt(event.target.value)}
                maxLength={200}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Replace photo (optional)
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) =>
                  setReplacementImage(event.currentTarget.files?.[0] || null)
                }
                className="mt-2 block w-full rounded-xl border border-slate-200 p-2 text-sm"
              />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 font-bold text-white disabled:opacity-50"
              >
                {isSaving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : null}
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
