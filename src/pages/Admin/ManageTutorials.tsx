import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiEye, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";

type Tutorial = {
  id: number;
  tutorialNumber: number;
  name: string;
  title: string;
  thumbnailImage: string;
  videoLink: string;
  updatedAt?: string;
  createdAt?: string;
};

const resolveImageUrl = (value: string) => {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  return ("http://localhost:5000" + value).replace("/api/v1", "");
};

export default function ManageTutorials() {
  const axios = useAxiosProtected();
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/tutorials");
        const data = (response.data?.data || []) as Tutorial[];
        if (!cancelled) {
          setTutorials(data);
        }
      } catch (error) {
        console.error("Failed to load tutorials:", error);
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
  }, [axios]);

  const filteredTutorials = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tutorials;

    return tutorials.filter((tutorial) => {
      return (
        tutorial.name.toLowerCase().includes(normalized) ||
        tutorial.title.toLowerCase().includes(normalized) ||
        String(tutorial.tutorialNumber).includes(normalized)
      );
    });
  }, [query, tutorials]);

  const handleDelete = async (tutorialId: number) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "gap-3",
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400",
        cancelButton: "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      },
      buttonsStyling: false
    });

    swalWithTailwindButtons.fire({
      title: "এই tutorial মুছে ফেলতে চান?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/tutorials/${tutorialId}`);
          setTutorials((prev) => prev.filter((item) => item.id !== tutorialId));
          if (selectedTutorial?.id === tutorialId) {
            setSelectedTutorial(null);
          }

          swalWithTailwindButtons.fire({
            title: "Deleted!",
            text: "Tutorial deleted successfully.",
            icon: "success"
          });
        } catch (error) {
          console.error("Failed to delete tutorial:", error);
          toast.error("Tutorial মুছে ফেলা যায়নি");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire({
          title: "Cancelled",
          text: "Your tutorial is safe :)",
          icon: "error"
        });
      }
    });
  };

  const goToEdit = (tutorialId: number) => {
    navigate(`/admin/create-tutorial?tutorialId=${tutorialId}`);
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
          টিউটোরিয়াল লাইব্রেরি
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="টিউটোরিয়াল অনুসন্ধান করুন..."
            className="px-4 py-2 rounded-xl border border-white/50 bg-white/30 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="button"
            onClick={() => navigate("/admin/create-tutorial")}
            className="px-4 py-2 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}
          >
            নতুন টিউটোরিয়াল
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300/50">
              <th className="p-3 font-semibold text-gray-700">নং</th>
              <th className="p-3 font-semibold text-gray-700">নাম</th>
              <th className="p-3 font-semibold text-gray-700">শিরোনাম</th>
              <th className="p-3 font-semibold text-gray-700">লিংক</th>
              <th className="p-3 font-semibold text-gray-700">আপডেট</th>
              <th className="p-3 font-semibold text-gray-700 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-6 text-gray-500" colSpan={6}>
                  লোড হচ্ছে...
                </td>
              </tr>
            ) : filteredTutorials.length === 0 ? (
              <tr>
                <td className="p-6 text-gray-500" colSpan={6}>
                  কোনো টিউটোরিয়াল পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filteredTutorials.map((tutorial) => (
                <tr key={tutorial.id} className="border-b border-gray-300/20 hover:bg-white/20 transition-colors align-top">
                  <td className="p-3 font-medium text-gray-900">{String(tutorial.tutorialNumber).padStart(2, "0")}</td>
                  <td className="p-3 text-gray-700">{tutorial.name}</td>
                  <td className="p-3 text-gray-700">{tutorial.title}</td>
                  <td className="p-3 text-gray-700 max-w-72 truncate">{tutorial.videoLink}</td>
                  <td className="p-3 text-gray-700">
                    {tutorial.updatedAt ? new Date(tutorial.updatedAt).toLocaleDateString("bn-BD") : "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        title="দেখুন"
                        onClick={() => setSelectedTutorial(tutorial)}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="সম্পাদনা করুন"
                        onClick={() => goToEdit(tutorial.id)}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="মুছে ফেলুন"
                        onClick={() => handleDelete(tutorial.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-2xl font-bold text-red-700">টিউটোরিয়াল প্রিভিউ</h3>
                <p className="text-sm text-gray-600">{selectedTutorial.name} / {selectedTutorial.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTutorial(null)}
                className="rounded-full p-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-start">
              <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-lg">
                <img
                  src={resolveImageUrl(selectedTutorial.thumbnailImage)}
                  alt={selectedTutorial.title}
                  className="w-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-500">Tutorial Number</p>
                  <p className="text-2xl font-black text-gray-900">{selectedTutorial.tutorialNumber}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-500">নাম</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedTutorial.name}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-500">শিরোনাম</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedTutorial.title}</p>
                </div>
                <a
                  href={selectedTutorial.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                >
                  YouTube এ দেখুন
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}