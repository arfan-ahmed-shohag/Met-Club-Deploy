import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
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

export default function ManageSchools() {
  const axiosInstance = useAxiosProtected();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("chattogram");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchools = async (locKey: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/schools?location=${locKey}`);
      console.log(res.data)
      setSchools(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load schools");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools(selectedLocation);
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
        } catch (err) {
          toast.error("Failed to delete");
        }
      }
    });
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-red-600">স্কুল এবং মেম্বার লিস্ট</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 rounded-xl border border-white/50 bg-white/30 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {locations.map((loc) => (
              <option key={loc.key} value={loc.key}>
                {loc.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate(`/admin/create-school?location=${selectedLocation}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold"
            style={{ background: "linear-gradient(135deg, #DA291C, #FC4C02)" }}
          >
            <FiPlus /> নতুন স্কুল
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300/50">
              <th className="p-3">স্কুলের নাম</th>
              <th className="p-3">মেম্বার সংখ্যা</th>
              <th className="p-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">Loading...</td>
              </tr>
            ) : schools.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">কোনো স্কুল পাওয়া যায়নি</td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id} className="border-b border-gray-300/20 hover:bg-white/20">
                  <td className="p-3">{school.nameBn}</td>
                  <td className="p-3">{school.members.length}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/create-school?id=${school.id}`)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="সম্পাদনা"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        title="মুছে ফেলুন"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
