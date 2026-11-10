import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FiPlus, FiTrash2, FiSave, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import useAxiosProtected from "../../hooks/axiosProtected";

type ClubMember = {
  nameBn: string;
  nameEn: string;
  classBn: string;
  classEn: string;
  image?: string;
  imageFile?: File;
};

export default function CreateSchool() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const defaultLocation = searchParams.get("location") || "chattogram";

  const axiosInstance = useAxiosProtected();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    locationKey: defaultLocation,
    nameBn: "",
    nameEn: "",
    addressBn: "",
    addressEn: "",
    videoLink: "",
    descBn: "",
    descEn: "",
  });

  const [members, setMembers] = useState<ClubMember[]>([]);

  useEffect(() => {
    if (id) {
      const fetchSchool = async () => {
        setIsLoading(true);
        try {
          const res = await axiosInstance.get(`/schools/${id}`);
          const school = res.data.data;
          setFormData({
            locationKey: school.locationKey,
            nameBn: school.nameBn,
            nameEn: school.nameEn,
            addressBn: school.addressBn,
            addressEn: school.addressEn,
            videoLink: school.videoLink || "",
            descBn: school.descBn,
            descEn: school.descEn,
          });
          setMembers(school.members.map((m: any) => ({
            nameBn: m.nameBn,
            nameEn: m.nameEn,
            classBn: m.classBn,
            classEn: m.classEn,
            image: m.image
          })));
        } catch (err) {
          toast.error("Failed to load school data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchSchool();
    }
  }, [id, axiosInstance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddMember = () => {
    setMembers((prev) => [...prev, { nameBn: "", nameEn: "", classBn: "সদস্য", classEn: "Member" }]);
  };

  const handleMemberChange = (index: number, field: keyof ClubMember, value: string) => {
    setMembers((prev) => {
      const newMembers = [...prev];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return newMembers;
    });
  };

  const handleRemoveMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMemberFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMembers((prev) => {
        const newMembers = [...prev];
        newMembers[index] = { ...newMembers[index], imageFile: file };
        return newMembers;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    const images: File[] = [];

    const processedMembers = members.map((m) => {
      const processed: any = {
        nameBn: m.nameBn,
        nameEn: m.nameEn,
        classBn: m.classBn,
        classEn: m.classEn,
        image: m.image
      };
      
      if (m.imageFile) {
        images.push(m.imageFile);
        processed.imageIndex = images.length - 1;
      } else if (!m.image) {
        processed.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nameEn || m.nameBn)}&background=random&color=fff`;
      }
      return processed;
    });

    const payloadData = { ...formData, members: processedMembers };
    formDataToSend.append("data", JSON.stringify(payloadData));
    
    images.forEach((img) => {
      formDataToSend.append("images", img);
    });

    try {
      if (id) {
        await axiosInstance.patch(`/schools/${id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("School updated successfully");
      } else {
        await axiosInstance.post(`/schools`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("School created successfully");
      }
      navigate("/admin/schools"); // We'll update the route for this later
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/schools")}
          className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-red-600">
          {id ? "স্কুল সম্পাদনা করুন" : "নতুন স্কুল যোগ করুন"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* School Details */}
        <div className="bg-white/60 p-6 rounded-2xl border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">স্কুলের তথ্য (School Details)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লোকেশন</label>
              <select
                name="locationKey"
                value={formData.locationKey}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="chattogram">চট্টগ্রাম</option>
                <option value="patuakhali">পটুয়াখালী</option>
                <option value="gaibandha">গাইবান্ধা</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ইউটিউব ভিডিও লিংক (ঐচ্ছিক)</label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="যেমন: https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">স্কুলের নাম (বাংলা)</label>
              <input
                required
                type="text"
                name="nameBn"
                value={formData.nameBn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="যেমন: সানিডেল স্কুল"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">স্কুলের নাম (English)</label>
              <input
                required
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="e.g. Sunnyside School"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা (বাংলা)</label>
              <input
                type="text"
                name="addressBn"
                value={formData.addressBn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা (English)</label>
              <input
                type="text"
                name="addressEn"
                value={formData.addressEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ (বাংলা)</label>
              <textarea
                name="descBn"
                value={formData.descBn}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ (English)</label>
              <textarea
                name="descEn"
                value={formData.descEn}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white/60 p-6 rounded-2xl border border-white/50">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">মেম্বার লিস্ট (Members)</h3>
            <button
              type="button"
              onClick={handleAddMember}
              className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
            >
              <FiPlus /> মেম্বার যোগ করুন
            </button>
          </div>

          <div className="space-y-4">
            {members.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">এখনো কোনো মেম্বার যোগ করা হয়নি</p>
            )}
            {members.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                <div className="md:col-span-3">
                  <label className="text-xs text-gray-500">নাম (বাংলা) *</label>
                  <input
                    required
                    type="text"
                    value={member.nameBn}
                    onChange={(e) => handleMemberChange(index, "nameBn", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs text-gray-500">নাম (English) *</label>
                  <input
                    required
                    type="text"
                    value={member.nameEn}
                    onChange={(e) => handleMemberChange(index, "nameEn", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500">পদবি (বাংলা)</label>
                  <input
                    type="text"
                    value={member.classBn}
                    onChange={(e) => handleMemberChange(index, "classBn", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500">পদবি (English)</label>
                  <input
                    type="text"
                    value={member.classEn}
                    onChange={(e) => handleMemberChange(index, "classEn", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div className="md:col-span-10">
                  <label className="text-xs text-gray-500">ছবি (Image)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMemberFileChange(index, e)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200"
                  />
                  {member.imageFile && <p className="text-xs text-green-600 mt-1">নির্বাচিত: {member.imageFile.name}</p>}
                  {!member.imageFile && member.image && <p className="text-xs text-blue-600 mt-1">আগের ছবি সংরক্ষিত আছে</p>}
                </div>
                <div className="md:col-span-2 flex items-end justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/schools")}
            className="px-6 py-2 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #DA291C, #FC4C02)" }}
          >
            <FiSave /> {isLoading ? "Saving..." : "সেভ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
