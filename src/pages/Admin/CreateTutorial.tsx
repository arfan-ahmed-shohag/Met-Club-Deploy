import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosProtected from "../../hooks/axiosProtected";

type TutorialForm = {
  id?: number;
  tutorialNumber: string;
  name: string;
  title: string;
  thumbnailImage: File | string | null;
  videoLink: string;
};

export default function CreateTutorial() {
  const axiosInstance = useAxiosProtected();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<TutorialForm>({
    tutorialNumber: "",
    name: "",
    title: "",
    thumbnailImage: null,
    videoLink: "",
  });

  const tutorialIdFromQuery = searchParams.get("tutorialId");

  useEffect(() => {
    if (!tutorialIdFromQuery) return;

    let cancelled = false;

    const loadTutorial = async () => {
      try {
        const response = await axiosInstance.get(`/tutorials/${tutorialIdFromQuery}`);
        const data = response.data?.data;
        if (!data || cancelled) return;

        setForm({
          id: data.id,
          tutorialNumber: String(data.tutorialNumber ?? ""),
          name: data.name ?? "",
          title: data.title ?? "",
          thumbnailImage: data.thumbnailImage ?? null,
          videoLink: data.videoLink ?? "",
        });
      } catch (error) {
        console.error("Failed to load tutorial:", error);
      }
    };

    loadTutorial();

    return () => {
      cancelled = true;
    };
  }, [axiosInstance, tutorialIdFromQuery]);

  const handleChange = (field: keyof TutorialForm, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const previewImage = () => {
    if (!form.thumbnailImage) return null;
    if (typeof form.thumbnailImage === "string") {
      if (form.thumbnailImage.startsWith("http")) return form.thumbnailImage;
      return ("https://api.meteorologyclub.com" + form.thumbnailImage).replace("/api/v1", "");
    }
    return URL.createObjectURL(form.thumbnailImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.tutorialNumber || !form.name || !form.title || !form.videoLink) {
      toast.error("সব তথ্য পূরণ করুন", { id: "error" });
      return;
    }

    if (!form.thumbnailImage) {
      toast.error("thumbnail image দিতে হবে", { id: "error" });
      return;
    }

    const payload = new FormData();
    payload.append("tutorialNumber", form.tutorialNumber);
    payload.append("name", form.name);
    payload.append("title", form.title);
    payload.append("videoLink", form.videoLink);

    if (form.thumbnailImage instanceof File) {
      payload.append("thumbnail", form.thumbnailImage);
    } else if (typeof form.thumbnailImage === "string") {
      payload.append("thumbnailImage", form.thumbnailImage);
    }

    try {
      setIsSubmitting(true);
      if (form.id) {
        const res = await axiosInstance.patch(`/tutorials/${form.id}`, payload);
        toast.success(res.data.message || "Tutorial updated", { id: "error" });
      } else {
        const res = await axiosInstance.post("/tutorials", payload);
        toast.success(res.data.message || "Tutorial created", { id: "error" });
      }
      navigate("/admin/tutorials");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.errorMessage, { id: "error" });
      }
      toast.error("Tutorial save করা যায়নি", { id: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="p-6 rounded-2xl max-w-5xl mx-auto mb-8"
      style={{
        background: "rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px) saturate(140%)",
        border: "1.5px solid rgba(255,255,255,0.44)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-red-600" style={{ letterSpacing: "-0.5px" }}>
            {form.id ? "টিউটোরিয়াল আপডেট করুন" : "নতুন টিউটোরিয়াল তৈরি করুন"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">নাম, নম্বর, title, thumbnail image আর YouTube video link দিন।</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/tutorials")}
          className="px-4 py-2 rounded-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #475569, #64748b)" }}
        >
          তালিকায় ফিরে যান
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-xl bg-white/30 border border-white/50">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tutorial Number</label>
            <input
              type="number"
              min="1"
              value={form.tutorialNumber}
              onChange={(e) => handleChange("tutorialNumber", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="যেমন 1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="টিউটোরিয়ালের নাম"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 rounded-xl bg-white/30 border border-white/50">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="বড় শিরোনাম"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube Video Link</label>
            <input
              type="url"
              value={form.videoLink}
              onChange={(e) => handleChange("videoLink", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white/30 border border-white/50">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail Image</label>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5 items-start">
            <div className="relative w-full h-64 bg-white/50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-red-400 transition-colors flex items-center justify-center group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleChange("thumbnailImage", file);
                }}
              />
              {previewImage() ? (
                <img src={previewImage() || ""} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-gray-500 group-hover:text-red-500 transition-colors">
                  <FiImage className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">ছবি আপলোড করতে ক্লিক করুন</span>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white/50 border border-white/60 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">নির্দেশনা</p>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>thumbnail অবশ্যই দিন।</li>
                <li>YouTube link copy করে paste করুন।</li>
                <li>update করার সময় নতুন ছবি না দিলে আগের thumbnail থাকবে।</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/tutorials")}
            className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-white/70 border border-gray-300 hover:bg-white transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 disabled:opacity-50 shadow-lg"
          >
            {isSubmitting ? "সেভ হচ্ছে..." : form.id ? "আপডেট করুন" : "সেভ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}