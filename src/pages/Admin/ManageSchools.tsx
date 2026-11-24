import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";

type ClubMember = {
  id: number;
  schoolId: number;
  nameBn: string;
  nameEn: string;
  classBn: string;
  classEn: string;
  image?: string;
};

type School = {
  id: number;
  locationKey: string;
  nameBn: string;
  nameEn: string;
  addressBn: string;
  addressEn: string;
  descBn: string;
  descEn: string;
  members: ClubMember[];
};

const locations = [
  { key: "chattogram", label: "চট্টগ্রাম" },
  { key: "patuakhali", label: "পটুয়াখালী" },
  { key: "gaibandha", label: "গাইবান্ধা" },
];

const SKELETON_ROWS = 4;
// Fixed widths sized like real school names, so the auto-sized columns split
// the table the same way they do once schools load.
const NAME_WIDTHS = ["w-56", "w-64", "w-44", "w-60"];

const thClass = "px-5 py-4";

// Card, table and header shared by the loaded table and its skeleton so both
// render with exactly the same frame.
function SchoolTableFrame({
  children,
  loading = false,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div
      role={loading ? "status" : undefined}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {loading && <span className="sr-only">Loading schools</span>}
      <div className="overflow-x-auto" aria-hidden={loading || undefined}>
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className={thClass}>স্কুলের নাম</th>
              <th className={thClass}>মেম্বার সংখ্যা</th>
              <th className={`${thClass} text-right`}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className={loading ? "motion-safe:animate-pulse" : undefined}>
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const editButtonClass =
  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold";

// Each placeholder uses the same element, padding and font size as the real
// cell it stands in for, so rows keep the loaded table's exact height.
function SchoolTableSkeleton() {
  return (
    <SchoolTableFrame loading>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <tr key={index} className="border-t border-slate-200 align-top">
          <td className="px-5 py-4 font-semibold">
            <div
              className={`rounded-md bg-slate-200 ${NAME_WIDTHS[index % NAME_WIDTHS.length]}`}
            >
              &nbsp;
            </div>
            <div className="mt-1 w-40 rounded-md bg-slate-100 text-xs font-normal">
              &nbsp;
            </div>
          </td>
          <td className="px-5 py-4">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-transparent">
              00 জন
            </span>
          </td>
          <td className="px-5 py-4">
            <div className="flex justify-end gap-2 text-transparent">
              <span className={`${editButtonClass} border-slate-200`}>
                <span className="size-[15px] rounded bg-slate-200" />
                <span className="rounded bg-slate-200">সম্পাদনা</span>
              </span>
              <span className={`${editButtonClass} border-slate-200`}>
                <span className="size-[15px] rounded bg-slate-200" />
                <span className="rounded bg-slate-200">মুছুন</span>
              </span>
            </div>
          </td>
        </tr>
      ))}
    </SchoolTableFrame>
  );
}

export default function ManageSchools() {
  const axiosInstance = useAxiosProtected();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("chattogram");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get(`/schools?location=${selectedLocation}`)
      .then((res) => {
        if (active) setSchools(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (active) toast.error("Failed to load schools");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedLocation, axiosInstance]);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "মুছে ফেলতে চান?",
      text: "স্কুল এবং এর মেম্বারগুলো মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ",
      cancelButtonText: "না",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/schools/${id}`);
          toast.success("School deleted!");
          setSchools((prev) => prev.filter((s) => s.id !== id));
        } catch {
          toast.error("Failed to delete");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              স্কুল এবং মেম্বার লিস্ট
            </h2>
            <p className="mt-2 text-slate-600">
              প্রতিটি এলাকার MET Club স্কুল এবং তাদের মেম্বারদের পরিচালনা করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(`/admin/create-school?location=${selectedLocation}`)
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white! hover:bg-red-800"
          >
            <Plus size={18} />
            নতুন স্কুল
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-xl font-black text-slate-900">স্কুল</h3>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="এলাকা বাছাই করুন"
          >
            {locations.map((loc) => (
              <button
                key={loc.key}
                type="button"
                aria-pressed={selectedLocation === loc.key}
                onClick={() => {
                  if (loc.key === selectedLocation) return;
                  setIsLoading(true);
                  setSelectedLocation(loc.key);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedLocation === loc.key ? "bg-red-600 text-white shadow" : "border border-slate-200 bg-white text-slate-700 hover:bg-red-50"}`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SchoolTableSkeleton />
        ) : schools.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            কোনো স্কুল পাওয়া যায়নি
          </p>
        ) : (
          <SchoolTableFrame>
            {schools.map((school) => (
              <tr
                key={school.id}
                className="border-t border-slate-200 align-top hover:bg-red-50/40"
              >
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {school.nameBn}
                  <div className="mt-1 text-xs font-normal text-slate-500">
                    {school.nameEn || " "}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {school.members.length} জন
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/create-school?id=${school.id}`)
                      }
                      className={`${editButtonClass} text-slate-700 hover:bg-slate-50`}
                    >
                      <Pencil size={15} />
                      সম্পাদনা
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(school.id)}
                      className={`${editButtonClass} border-red-100 text-red-700 hover:bg-red-50`}
                    >
                      <Trash2 size={15} />
                      মুছুন
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </SchoolTableFrame>
        )}
      </section>
    </div>
  );
}
