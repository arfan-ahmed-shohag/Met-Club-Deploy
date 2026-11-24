import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";
import { resolveMediaUrl } from "../../utils/media";
import { getApiErrorMessage, getUploadErrorMessage } from "../../utils/apiError";

type Category = "comics" | "flyer" | "pressRelease";
type Resource = {
  id: string;
  category: Category;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  pdfUrl: string;
  pdfUrlEn?: string | null;
  featuredImageUrl?: string | null;
  createdAt: string;
};
type ApiResponse = { data?: Resource[]; meta?: { total?: number } };
type FormValues = {
  category: Category;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  pdfBn: File | null;
  pdfEn: File | null;
  featuredImage: File | null;
};
const PAGE_SIZE = 12;
const emptyForm = (): FormValues => ({
  category: "comics",
  titleBn: "",
  titleEn: "",
  descriptionBn: "",
  descriptionEn: "",
  pdfBn: null,
  pdfEn: null,
  featuredImage: null,
});
const categories: { value: Category; label: string }[] = [
  { value: "comics", label: "Comics" },
  { value: "flyer", label: "Flyers" },
  { value: "pressRelease", label: "News" },
];
const cardGridClass = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";
const cardClass =
  "flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";
const coverClass = "aspect-video w-full";
const cardBodyClass = "flex flex-1 flex-col p-5";
const cardActionsClass = "mt-4 flex justify-end gap-2";

function ManagePublications({
  initialCategory,
}: {
  initialCategory: Category;
}) {
  const axios = useAxiosProtected();
  const category = initialCategory;
  const [items, setItems] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState<FormValues>(() => ({
    ...emptyForm(),
    category: initialCategory,
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialogOpen && !dialog.open) dialog.showModal();
    else if (!dialogOpen && dialog.open) dialog.close();
  }, [dialogOpen]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse>("/pdf-resources", {
        params: { category, page, limit: PAGE_SIZE },
      });
      setItems(Array.isArray(data?.data) ? data.data : []);
      setTotal(Number(data?.meta?.total) || 0);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "PDF publications could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, [axios, category, page]);
  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const startCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm(), category });
    setDialogOpen(true);
  };
  const startEdit = (item: Resource) => {
    setEditing(item);
    setForm({
      category: item.category,
      titleBn: item.titleBn,
      titleEn: item.titleEn,
      descriptionBn: item.descriptionBn,
      descriptionEn: item.descriptionEn,
      pdfBn: null,
      pdfEn: null,
      featuredImage: null,
    });
    setDialogOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing && !form.pdfBn)
      return toast.error("Choose the Bengali PDF file to upload.");
    if (!editing && !form.featuredImage)
      return toast.error("Choose a featured image.");
    for (const pdf of [form.pdfBn, form.pdfEn]) {
      if (
        pdf &&
        (pdf.type !== "application/pdf" || pdf.size > 20 * 1024 * 1024)
      )
        return toast.error("Choose PDF files no larger than 20 MB each.");
    }
    if (
      form.featuredImage &&
      (!new Set(["image/png", "image/jpeg", "image/webp"]).has(
        form.featuredImage.type,
      ) ||
        form.featuredImage.size > 5 * 1024 * 1024)
    )
      return toast.error(
        "Choose a PNG, JPEG, or WEBP featured image no larger than 5 MB.",
      );
    const payload = new FormData();
    payload.append("category", form.category);
    payload.append("titleBn", form.titleBn.trim());
    payload.append("titleEn", form.titleEn.trim());
    payload.append("descriptionBn", form.descriptionBn.trim());
    payload.append("descriptionEn", form.descriptionEn.trim());
    if (form.pdfBn) payload.append("pdf", form.pdfBn);
    if (form.pdfEn) payload.append("pdfEn", form.pdfEn);
    if (form.featuredImage) payload.append("featuredImage", form.featuredImage);
    setSaving(true);
    try {
      if (editing) await axios.patch(`/pdf-resources/${editing.id}`, payload);
      else await axios.post("/pdf-resources", payload);
      toast.success(editing ? "Publication updated." : "Publication added.");
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm());
      if (!editing && page !== 1) setPage(1);
      else await loadItems();
    } catch (error) {
      toast.error(getUploadErrorMessage(error, "Publication could not be saved."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Resource) => {
    const confirmation = await Swal.fire({
      title: "Delete this publication?",
      text: item.titleEn,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c3231a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (!confirmation.isConfirmed) return;
    setSaving(true);
    try {
      await axios.delete(`/pdf-resources/${item.id}`);
      toast.success("Publication removed.");
      if (items.length === 1 && page > 1) setPage((current) => current - 1);
      else await loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Publication could not be removed."));
    } finally {
      setSaving(false);
    }
  };

  const pageCount = Math.ceil(total / PAGE_SIZE);
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {categories.find((entry) => entry.value === category)?.label}
            </h2>
            <p className="mt-2 text-slate-600">
              Upload a PDF and provide its Bengali and English title and short
              description.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            Add PDF
          </button>
        </div>
      </section>
      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {categories.find((entry) => entry.value === category)?.label}
            </h3>
          </div>
          {pageCount > 1 && (
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="cursor-pointer rounded-lg border px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                {page} / {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount || loading}
                onClick={() =>
                  setPage((value) => Math.min(pageCount, value + 1))
                }
                className="cursor-pointer rounded-lg border px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <div className={cardGridClass} role="status">
            <span className="sr-only">Loading PDF publications</span>
            {Array.from({ length: 6 }, (_, index) => (
              <article
                key={index}
                aria-hidden="true"
                className={`${cardClass} motion-safe:animate-pulse`}
              >
                <div className={`${coverClass} bg-slate-200`} />
                <div className={cardBodyClass}>
                  <div className="flex h-6 items-center">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                  </div>
                  <div className="flex h-5 items-center">
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                  <div className="mt-2 flex h-5 items-center">
                    <div className="h-3 w-full rounded bg-slate-100" />
                  </div>
                  <div className="flex h-5 items-center">
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                  </div>
                  <div className="mt-3 flex h-5 items-center">
                    <div className="h-3 w-32 rounded bg-slate-200" />
                  </div>
                  <div className="mt-1 flex h-5 items-center">
                    <div className="h-3 w-28 rounded bg-slate-200" />
                  </div>
                  <div className={cardActionsClass}>
                    <div className="h-[38px] w-[74px] rounded-lg bg-slate-100" />
                    <div className="h-[38px] w-[89px] rounded-lg bg-slate-100" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            No PDFs in this category yet.
          </p>
        ) : (
          <div className={cardGridClass}>
            {items.map((item) => (
              <article key={item.id} className={cardClass}>
                {item.featuredImageUrl ? (
                  <img
                    src={resolveMediaUrl(item.featuredImageUrl)}
                    alt={item.titleEn}
                    className={`${coverClass} bg-slate-100 object-cover`}
                  />
                ) : (
                  <div className={`${coverClass} bg-slate-100`} />
                )}
                <div className={cardBodyClass}>
                  <h4 className="font-bold text-slate-900">{item.titleBn}</h4>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.titleEn}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {item.descriptionBn}
                  </p>
                  <p className="line-clamp-2 text-sm text-slate-500">
                    {item.descriptionEn}
                  </p>
                  <a
                    className="mt-3 truncate text-sm font-semibold text-red-700 underline"
                    target="_blank"
                    rel="noreferrer"
                    href={resolveMediaUrl(item.pdfUrl)}
                  >
                    Open Bengali PDF
                  </a>
                  {item.pdfUrlEn && (
                    <a
                      className="mt-1 truncate text-sm font-semibold text-red-700 underline"
                      target="_blank"
                      rel="noreferrer"
                      href={resolveMediaUrl(item.pdfUrlEn)}
                    >
                      Open English PDF
                    </a>
                  )}
                  <div className={cardActionsClass}>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void remove(item)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {dialogOpen &&
        createPortal(
          <dialog
            ref={dialogRef}
            onCancel={(event) => {
              // A file input's picker-cancel event bubbles here; only handle the dialog's own (Escape).
              if (event.target !== event.currentTarget) return;
              event.preventDefault();
              if (!saving) setDialogOpen(false);
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget && !saving)
                setDialogOpen(false);
            }}
            className="fixed inset-0 m-0 flex h-dvh w-screen max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4 backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
          >
            <form
              onSubmit={(event) => void submit(event)}
              className="relative max-h-[92vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
            >
              <button
                type="button"
                onClick={() => !saving && setDialogOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
              <h3 className="pr-10 text-2xl font-black text-slate-900">
                {editing ? "Edit PDF publication" : "Add PDF publication"}
              </h3>
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
                Category:{" "}
                {categories.find((entry) => entry.value === category)?.label}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["titleBn", "Title (বাংলা)"],
                    ["titleEn", "Title (English)"],
                    ["descriptionBn", "Short description (বাংলা)"],
                    ["descriptionEn", "Short description (English)"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="block text-sm font-semibold text-slate-700"
                  >
                    {label}
                    {key.startsWith("title") ? (
                      <input
                        required
                        minLength={2}
                        maxLength={160}
                        value={form[key]}
                        onChange={(event) =>
                          setForm((value) => ({
                            ...value,
                            [key]: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      />
                    ) : (
                      <textarea
                        required
                        minLength={2}
                        maxLength={500}
                        rows={3}
                        value={form[key]}
                        onChange={(event) =>
                          setForm((value) => ({
                            ...value,
                            [key]: event.target.value,
                          }))
                        }
                        className="mt-1 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Bengali PDF{" "}
                  {editing ? "(optional replacement)" : "(required, max 20 MB)"}
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    required={!editing}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] || null;
                      setForm((value) => ({ ...value, pdfBn: file }));
                    }}
                    className="mt-2 block w-full rounded-xl border border-slate-200 p-2 text-sm"
                  />
                  {editing && (
                    <a
                      href={resolveMediaUrl(editing.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-red-700 underline"
                    >
                      View current Bengali PDF
                    </a>
                  )}
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  English PDF (optional, max 20 MB)
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] || null;
                      setForm((value) => ({ ...value, pdfEn: file }));
                    }}
                    className="mt-2 block w-full rounded-xl border border-slate-200 p-2 text-sm"
                  />
                  {editing?.pdfUrlEn && (
                    <a
                      href={resolveMediaUrl(editing.pdfUrlEn)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-red-700 underline"
                    >
                      View current English PDF
                    </a>
                  )}
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700">
                Featured image{" "}
                {editing
                  ? "(optional replacement; PNG, JPEG, or WEBP, max 5 MB)"
                  : "(required; PNG, JPEG, or WEBP, max 5 MB)"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required={!editing}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] || null;
                    setForm((value) => ({ ...value, featuredImage: file }));
                  }}
                  className="mt-2 block w-full rounded-xl border border-slate-200 p-2 text-sm"
                />
                {editing?.featuredImageUrl && (
                  <img
                    src={resolveMediaUrl(editing.featuredImageUrl)}
                    alt="Current featured image"
                    className="mt-3 h-36 w-56 rounded-xl object-cover"
                  />
                )}
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                  className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 font-bold text-white disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Upload size={17} />
                  )}{" "}
                  {editing ? "Save changes" : "Add PDF"}
                </button>
              </div>
            </form>
          </dialog>,
          document.body,
        )}
    </div>
  );
}

export const ManageComics = () => (
  <ManagePublications initialCategory="comics" />
);
export const ManageFlyers = () => (
  <ManagePublications initialCategory="flyer" />
);
export const ManagePressReleases = () => (
  <ManagePublications initialCategory="pressRelease" />
);
