import { useCallback, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Image as ImageIcon, LoaderCircle, X } from "lucide-react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import TopNav from "../../components/Shared/TopBar";
import useAxiosProtected from "../../hooks/axiosProtected";
import useAuth from "../../hooks/useAuth";
import { getStoredLocale } from "../../utils/language";
import { normalizeBlogImagePaths } from "../../utils/blogContent";
import { resolveMediaUrl } from "../../utils/media";

const TITLE_MAX = 160;
const CONTENT_MAX = 30000;
const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const quillFormats = [
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
  "image",
];

export default function WriteBlog() {
  const axios = useAxiosProtected();
  const navigate = useNavigate();
  const editorBnRef = useRef<ReactQuill | null>(null);
  const editorEnRef = useRef<ReactQuill | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageRangeRef = useRef<{ index: number; length: number } | null>(
    null,
  );
  const inlineImageLanguageRef = useRef<"bn" | "en">("bn");
  const { user, isLoading, error, reloadUser } = useAuth();
  const isEnglish = getStoredLocale() === "en";
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentBn, setContentBn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [contentLengthBn, setContentLengthBn] = useState(0);
  const [contentLengthEn, setContentLengthEn] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  const uploadBlogImage = useCallback(
    async (image: File) => {
      if (!IMAGE_TYPES.has(image.type) || image.size > 5 * 1024 * 1024) {
        toast.error(
          isEnglish
            ? "Choose a PNG, JPEG, WEBP or GIF image up to 5 MB."
            : "৫ MB-এর মধ্যে PNG, JPEG, WEBP বা GIF ছবি বেছে নিন।",
        );
        return null;
      }

      const form = new FormData();
      form.append("image", image);
      setIsUploadingImage(true);
      try {
        const { data } = await axios.post("/blogs/images", form);
        const imagePath = data?.data?.url;
        if (
          typeof imagePath !== "string" ||
          !imagePath.startsWith("/uploads/blogs/")
        ) {
          throw new Error("The uploaded image URL was missing.");
        }
        return imagePath as string;
      } catch (uploadError) {
        const responseData: unknown = isAxiosError(uploadError)
          ? uploadError.response?.data
          : undefined;
        const responseBody =
          responseData && typeof responseData === "object"
            ? (responseData as { errorMessage?: unknown; message?: unknown })
            : null;
        const serverMessage =
          typeof responseBody?.errorMessage === "string"
            ? responseBody.errorMessage
            : typeof responseBody?.message === "string"
              ? responseBody.message
              : typeof responseData === "string" && responseData.trim()
                ? responseData
                : undefined;
        const fallbackMessage =
          isAxiosError(uploadError) && !uploadError.response
            ? isEnglish
              ? "Could not connect to the upload server. Check your connection and try again."
              : "ছবি আপলোড সার্ভারের সঙ্গে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।"
            : isEnglish
              ? "Image upload failed. Please try again."
              : "ছবি আপলোড হয়নি। আবার চেষ্টা করুন।";
        toast.error(serverMessage || fallbackMessage);
        return null;
      } finally {
        setIsUploadingImage(false);
      }
    },
    [axios, isEnglish],
  );

  const uploadInlineImage = useCallback(
    (language: "bn" | "en") => () => {
      const editor = (
        language === "bn" ? editorBnRef : editorEnRef
      ).current?.getEditor();
      if (!editor || !inlineImageInputRef.current) return;
      inlineImageLanguageRef.current = language;
      inlineImageRangeRef.current = editor.getSelection(true) || {
        index: editor.getLength() - 1,
        length: 0,
      };
      inlineImageInputRef.current.click();
    },
    [],
  );

  const handleInlineImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const image = input.files?.[0];
    input.value = "";
    if (!image) return;

    const imagePath = await uploadBlogImage(image);
    const editor = (
      inlineImageLanguageRef.current === "bn" ? editorBnRef : editorEnRef
    ).current?.getEditor();
    if (!imagePath || !editor) return;

    const selection = inlineImageRangeRef.current ||
      editor.getSelection(true) || { index: editor.getLength() - 1, length: 0 };
    inlineImageRangeRef.current = null;
    const insertIndex = Math.max(
      0,
      Math.min(selection.index, editor.getLength() - 1),
    );
    if (selection.length > 0)
      editor.deleteText(insertIndex, selection.length, "api");
    editor.insertEmbed(insertIndex, "image", resolveMediaUrl(imagePath), "api");
    editor.insertText(insertIndex + 1, "\n", "api");
    editor.setSelection(insertIndex + 2, 0, "silent");
    editor.focus();
  };

  const quillModulesBn = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: uploadInlineImage("bn") },
      },
    }),
    [uploadInlineImage],
  );
  const quillModulesEn = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: uploadInlineImage("en") },
      },
    }),
    [uploadInlineImage],
  );

  const submitBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = titleBn.trim();
    const normalizedTitleEn = titleEn.trim();
    const normalizedContent = normalizeBlogImagePaths(contentBn.trim());
    const normalizedContentEn = normalizeBlogImagePaths(contentEn.trim());

    if (
      normalizedTitle.length < 4 ||
      normalizedTitle.length > TITLE_MAX ||
      normalizedTitleEn.length < 4 ||
      normalizedTitleEn.length > TITLE_MAX
    ) {
      setFormError(
        isEnglish
          ? "Title must contain 4–160 characters."
          : "শিরোনাম ৪ থেকে ১৬০ অক্ষরের মধ্যে লিখুন।",
      );
      return;
    }
    if (
      contentLengthBn < 30 ||
      contentLengthBn > CONTENT_MAX ||
      contentLengthEn < 30 ||
      contentLengthEn > CONTENT_MAX
    ) {
      setFormError(
        isEnglish
          ? "Blog text must contain 30–30,000 characters."
          : "ব্লগের লেখা ৩০ থেকে ৩০,০০০ অক্ষরের মধ্যে লিখুন।",
      );
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    try {
      await axios.post("/blogs", {
        title: normalizedTitle,
        titleEn: normalizedTitleEn,
        content: normalizedContent,
        contentEn: normalizedContentEn,
        featuredImage,
      });
      toast.success(
        isEnglish
          ? "Blog submitted for admin review."
          : "ব্লগটি admin-এর পর্যালোচনার জন্য জমা হয়েছে।",
      );
      navigate(isEnglish ? "/en/blogs" : "/blogs");
    } catch (submitError) {
      const responseData: unknown = isAxiosError(submitError)
        ? submitError.response?.data
        : undefined;
      const responseBody =
        responseData && typeof responseData === "object"
          ? (responseData as {
              errorMessage?: unknown;
              message?: unknown;
              errors?: unknown;
            })
          : null;
      const fieldErrors =
        responseBody?.errors && typeof responseBody.errors === "object"
          ? Object.values(
              responseBody.errors as Record<string, unknown>,
            ).filter((value): value is string => typeof value === "string")
          : [];
      const serverMessage =
        fieldErrors.length > 0
          ? fieldErrors.join(" ")
          : typeof responseBody?.errorMessage === "string"
            ? responseBody.errorMessage
            : typeof responseBody?.message === "string"
              ? responseBody.message
              : typeof responseData === "string" && responseData.trim()
                ? responseData
                : undefined;
      const fallbackMessage =
        isAxiosError(submitError) && !submitError.response
          ? isEnglish
            ? "Could not connect to the blog server. Check your connection and try again."
            : "ব্লগ সার্ভারের সঙ্গে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।"
          : isEnglish
            ? "Could not submit your blog. Please try again."
            : "ব্লগ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।";
      setFormError(serverMessage || fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel =
    user?.role === "admin"
      ? isEnglish
        ? "Admin contribution"
        : "Admin-এর লেখা"
      : isEnglish
        ? "Student contribution"
        : "শিক্ষার্থীর লেখা";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-slate-100 text-slate-900">
      <TopNav title={isEnglish ? "Write a blog" : "ব্লগ লিখুন"} />
      <main className="site-container px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto mb-8 w-full max-w-4xl rounded-2xl border border-white/60 bg-white/40 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-7">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
                {roleLabel}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-red-700 sm:text-3xl">
                {isEnglish ? "Write a blog" : "নতুন ব্লগ লিখুন"}
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                {isEnglish
                  ? "An admin will review this post before it appears publicly."
                  : "জমা দেওয়ার পর admin পর্যালোচনা করে ব্লগটি প্রকাশ করবেন।"}
              </p>
            </div>
            <Link
              to={isEnglish ? "/en/blogs" : "/blogs"}
              className="rounded-xl border border-white/70 bg-white/55 px-4 py-2 font-semibold text-slate-700 transition hover:bg-white"
            >
              {isEnglish ? "Back to blogs" : "ব্লগে ফিরে যান"}
            </Link>
          </header>

          {isLoading ? (
            <div
              className="flex min-h-40 items-center justify-center gap-3 rounded-xl border border-white/60 bg-white/30 text-slate-600"
              role="status"
            >
              <LoaderCircle size={20} className="animate-spin" />
              {isEnglish ? "Loading your account…" : "আপনার অ্যাকাউন্ট লোড হচ্ছে…"}
            </div>
          ) : error && !user ? (
            <div className="rounded-xl border border-red-200 bg-white/60 p-5 text-center">
              <p role="alert" className="text-slate-700">
                {isEnglish
                  ? "Your account could not be loaded."
                  : "আপনার অ্যাকাউন্টের তথ্য আনা যায়নি।"}
              </p>
              <button
                type="button"
                onClick={() => void reloadUser()}
                className="mt-3 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                {isEnglish ? "Try again" : "আবার চেষ্টা করুন"}
              </button>
            </div>
          ) : (
            <form
              onSubmit={(event) => void submitBlog(event)}
              className="space-y-5"
            >
              <div className="rounded-xl border border-white/60 bg-white/30 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Blog title (বাংলা)
                    <input
                      required
                      minLength={4}
                      maxLength={TITLE_MAX}
                      value={titleBn}
                      onChange={(event) => setTitleBn(event.target.value)}
                      className="mt-2 w-full min-w-0 rounded-xl border border-white/70 bg-white/65 px-4 py-3 font-normal text-slate-900 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-300"
                      placeholder="ব্লগের শিরোনাম লিখুন"
                    />
                    <span className="mt-1 block text-right text-xs font-normal text-slate-500">
                      {titleBn.length}/{TITLE_MAX}
                    </span>
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Blog title (English)
                    <input
                      required
                      minLength={4}
                      maxLength={TITLE_MAX}
                      value={titleEn}
                      onChange={(event) => setTitleEn(event.target.value)}
                      className="mt-2 w-full min-w-0 rounded-xl border border-white/70 bg-white/65 px-4 py-3 font-normal text-slate-900 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-300"
                      placeholder="Enter the blog title"
                    />
                    <span className="mt-1 block text-right text-xs font-normal text-slate-500">
                      {titleEn.length}/{TITLE_MAX}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-white/60 bg-white/30 p-5">
                <h2 className="border-b border-slate-300/80 pb-2 text-lg font-bold text-red-700">
                  {isEnglish ? "Blog content" : "ব্লগের বিষয়বস্তু"}
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <label
                      htmlFor="blog-featured-image"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {isEnglish
                        ? "Featured image (optional)"
                        : "ফিচার্ড ছবি (ঐচ্ছিক)"}
                    </label>
                    <label
                      htmlFor="blog-featured-image"
                      className="relative flex h-52 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-white/50 text-center transition hover:border-red-300 hover:bg-white/70 md:h-64"
                    >
                      <input
                        id="blog-featured-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        disabled={isUploadingImage || isSubmitting}
                        onChange={(event) => {
                          const image = event.currentTarget.files?.[0];
                          event.currentTarget.value = "";
                          if (!image) return;
                          void uploadBlogImage(image).then((imagePath) => {
                            if (imagePath) setFeaturedImage(imagePath);
                          });
                        }}
                        className="sr-only"
                      />
                      {featuredImage ? (
                        <img
                          src={resolveMediaUrl(featuredImage)}
                          alt={
                            isEnglish
                              ? "Featured image preview"
                              : "ফিচার্ড ছবির প্রিভিউ"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="px-4 text-slate-500">
                          {isUploadingImage ? (
                            <LoaderCircle
                              size={32}
                              className="mx-auto animate-spin text-red-600"
                            />
                          ) : (
                            <ImageIcon
                              size={32}
                              className="mx-auto text-red-500"
                            />
                          )}
                          <p className="mt-2 text-sm font-semibold">
                            {isUploadingImage
                              ? isEnglish
                                ? "Uploading image…"
                                : "ছবি আপলোড হচ্ছে…"
                              : isEnglish
                                ? "Choose a featured image"
                                : "ফিচার্ড ছবি বেছে নিন"}
                          </p>
                        </div>
                      )}
                    </label>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {isEnglish
                        ? "PNG, JPEG, WEBP or GIF, up to 5 MB. It will appear as the blog cover."
                        : "PNG, JPEG, WEBP বা GIF, সর্বোচ্চ ৫ MB। ছবিটি ব্লগের কভার হবে।"}
                    </p>
                    {featuredImage && (
                      <button
                        type="button"
                        onClick={() => setFeaturedImage(null)}
                        disabled={isUploadingImage || isSubmitting}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <X size={16} />{" "}
                        {isEnglish ? "Remove image" : "ছবি সরান"}
                      </button>
                    )}
                  </div>

                  <div className="min-w-0 md:col-span-2">
                    <div className="grid gap-5 xl:grid-cols-2">
                      <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Your blog (বাংলা)
                        </label>
                        <div className="blog-quill h-72 min-w-0 overflow-hidden rounded-xl border border-white/70 bg-white/65 text-slate-900 focus-within:ring-2 focus-within:ring-red-300 md:h-80">
                          <ReactQuill
                            ref={editorBnRef}
                            theme="snow"
                            value={contentBn}
                            className="editor-shell h-full overflow-hidden rounded-xl bg-white"
                            readOnly={isSubmitting || isUploadingImage}
                            modules={quillModulesBn}
                            formats={quillFormats}
                            placeholder="আপনার ব্লগ বাংলায় লিখুন"
                            onChange={(html, _delta, _source, editor) => {
                              setContentBn(html);
                              setContentLengthBn(
                                editor.getText().trim().length,
                              );
                            }}
                          />
                        </div>
                        <p className="mt-2 text-right text-xs text-slate-500">
                          {contentLengthBn}/{CONTENT_MAX}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Your blog (English)
                        </label>
                        <div className="blog-quill h-72 min-w-0 overflow-hidden rounded-xl border border-white/70 bg-white/65 text-slate-900 focus-within:ring-2 focus-within:ring-red-300 md:h-80">
                          <ReactQuill
                            ref={editorEnRef}
                            theme="snow"
                            value={contentEn}
                            className="editor-shell h-full overflow-hidden rounded-xl bg-white"
                            readOnly={isSubmitting || isUploadingImage}
                            modules={quillModulesEn}
                            formats={quillFormats}
                            placeholder="Write your blog in English"
                            onChange={(html, _delta, _source, editor) => {
                              setContentEn(html);
                              setContentLengthEn(
                                editor.getText().trim().length,
                              );
                            }}
                          />
                        </div>
                        <p className="mt-2 text-right text-xs text-slate-500">
                          {contentLengthEn}/{CONTENT_MAX}
                        </p>
                      </div>
                    </div>
                    <input
                      ref={inlineImageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(event) => void handleInlineImageChange(event)}
                      className="sr-only"
                      aria-label="Upload inline image"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Use the image button in either editor to add images to
                      that language version.
                    </p>
                  </div>
                </div>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-300/80 pt-5 sm:flex-row sm:justify-end">
                <Link
                  to={isEnglish ? "/en/blogs" : "/blogs"}
                  className="rounded-xl border border-white/70 bg-white/55 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-white"
                >
                  {isEnglish ? "Cancel" : "বাতিল"}
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-bold text-white shadow-lg transition hover:from-red-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? isEnglish
                      ? "Submitting…"
                      : "জমা হচ্ছে…"
                    : isEnglish
                      ? "Submit for review"
                      : "পর্যালোচনার জন্য জমা দিন"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
