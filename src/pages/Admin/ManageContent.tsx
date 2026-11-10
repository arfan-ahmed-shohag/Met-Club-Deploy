import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiEye, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";
import { resolveMediaUrl } from "../../utils/media";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosProtected from "../../hooks/axiosProtected";

type Chapter = {
  id: number;
  title: string;
};

type ContentSection = {
  image?: string | null;
  content?: string;
};

type LearningContent = {
  id: number;
  chapterId: number;
  sections: ContentSection[];
  updatedAt?: string;
};

type EnrichedContent = LearningContent & {
  chapterTitle: string;
};

export default function ManageContent() {
  const axiosInstance = useAxiosProtected();
  const navigate = useNavigate();
  const [contents, setContents] = useState<EnrichedContent[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<EnrichedContent | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [chapterResponse, contentResponse] = await Promise.all([
          fetch("/chapter.json"),
          axiosInstance.get("/content"),
        ]);

        const chapterData = (await chapterResponse.json()) as Chapter[];
        const contentData = (contentResponse.data?.data || []) as LearningContent[];

        if (cancelled) return;

        const enriched = contentData.map((item) => {
          const chapterTitle = chapterData.find((chapter) => chapter.id === item.chapterId)?.title || `Chapter ${item.chapterId}`;
          return {
            ...item,
            chapterTitle,
          };
        });

        setContents(enriched);
      } catch (error) {
        console.error("Failed to load content list:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [axiosInstance]);

  const filteredContents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return contents;

    return contents.filter((item) => {
      const sectionText = item.sections.map((section) => section.content || "").join(" ").toLowerCase();
      return (
        item.chapterTitle.toLowerCase().includes(normalized) ||
        sectionText.includes(normalized)
      );
    });
  }, [contents, query]);

  const handleDelete = async (chapterId: number) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "gap-3",
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400",
        cancelButton: "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      },
      buttonsStyling: false
    });
    swalWithTailwindButtons.fire({
      title: "এই কন্টেন্ট মুছে ফেলতে চান?",
      text: "মুছে ফেলার পর এটি পুনরুদ্ধার করা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/content/${chapterId}`);
          setContents((prev) => prev.filter((item) => item.chapterId !== chapterId));
          if (selectedContent?.chapterId === chapterId) {
            setSelectedContent(null);
          }
          swalWithTailwindButtons.fire({
            title: "মুছে ফেলা হয়েছে!",
            text: `${res.data.message || "কন্টেন্ট সফলভাবে মুছে ফেলা হয়েছে।"}`,
            icon: "success"
          })
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.errorMessage);
          }
          toast.error("কন্টেন্ট মুছে ফেলা যায়নি");
        }
      }
      else if (result.dismiss === Swal.DismissReason.cancel) swalWithTailwindButtons.fire({
        title: "বাতিল করা হয়েছে",
        text: "আপনার কন্টেন্ট নিরাপদ আছে।",
        icon: "error"
      });
    });
  };

  const goToEdit = (chapterId: number) => {
    navigate(`/admin/create-content?chapterId=${chapterId}`);
  };

  return (
    <div
      className="p-6 rounded-2xl min-h-125"
      style={{
        background: "rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px) saturate(140%)",
        border: "1.5px solid rgba(255,255,255,0.44)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h2
          className="text-xl font-bold"
          style={{
            color: "rgba(239,68,68,0.95)",
            textShadow:
              "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(239,68,68,0.18)",
            letterSpacing: "-0.5px",
          }}
        >
          কন্টেন্ট লাইব্রেরি
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কন্টেন্ট অনুসন্ধান করুন..."
            className="px-4 py-2 rounded-xl border border-white/50 bg-white/30 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="button"
            onClick={() => navigate("/admin/create-content")}
            className="px-4 py-2 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #DA291C, #FC4C02)" }}
          >
            নতুন কন্টেন্ট
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300/50">
              <th className="p-3 font-semibold text-gray-700">অধ্যায়</th>
              <th className="p-3 font-semibold text-gray-700">বিভাগ</th>
              <th className="p-3 font-semibold text-gray-700">আপডেট</th>
              <th className="p-3 font-semibold text-gray-700 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-6 text-gray-500" colSpan={5}>
                  লোড হচ্ছে...
                </td>
              </tr>
            ) : filteredContents.length === 0 ? (
              <tr>
                <td className="p-6 text-gray-500" colSpan={5}>
                  কোনো কন্টেন্ট পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filteredContents.map((content) => {
                return (
                  <tr key={content.id} className="border-b border-gray-300/20 hover:bg-white/20 transition-colors align-top">
                    <td className="p-3 text-gray-700">{content.chapterTitle}</td>
                    <td className="p-3 text-gray-700">{content.sections.length} টি</td>
                    <td className="p-3 text-gray-700">
                      {content.updatedAt ? new Date(content.updatedAt).toLocaleDateString("bn-BD") : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="দেখুন"
                          onClick={() => setSelectedContent(content)}
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="সম্পাদনা করুন"
                          onClick={() => goToEdit(content.chapterId)}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="মুছে ফেলুন"
                          onClick={() => handleDelete(content.chapterId)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-2xl font-bold text-red-700">কন্টেন্ট প্রিভিউ</h3>
                <p className="text-sm text-gray-600">{selectedContent.chapterTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContent(null)}
                className="rounded-full p-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {selectedContent.sections.map((section, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-2xl border border-red-100 bg-red-50/40 p-4">
                  <div className="lg:col-span-1 overflow-hidden rounded-xl bg-white">
                    {section.image ? (
                      <img src={resolveMediaUrl(section.image)} alt="section" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex min-h-52 items-center justify-center text-gray-400">ছবি নেই</div>
                    )}
                  </div>
                  <div className="lg:col-span-2 min-w-0">
                    <div className="mb-2 text-sm font-semibold text-red-700">বিভাগ {index + 1}</div>
                    <div
                      className="admin-content-preview max-w-none text-slate-700"
                      dangerouslySetInnerHTML={{ __html: section.content || "" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
