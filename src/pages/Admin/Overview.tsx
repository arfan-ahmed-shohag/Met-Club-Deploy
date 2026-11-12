import { FiUsers, FiBookOpen, FiFileText, FiAward } from "react-icons/fi";

const stats = [
  {
    title: "মোট ব্যবহারকারী",
    value: "১,২৪০",
    icon: FiUsers,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "মোট অধ্যায়",
    value: "২৪",
    icon: FiBookOpen,
    color: "from-green-500 to-green-600",
  },
  {
    title: "মোট কন্টেন্ট",
    value: "১৫৬",
    icon: FiFileText,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "পরীক্ষা নেওয়া হয়েছে",
    value: "৩,৪২০",
    icon: FiAward,
    color: "from-purple-500 to-purple-600",
  },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(20px) saturate(140%)",
                border: "1.5px solid rgba(255,255,255,0.44)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(20px) saturate(140%)",
          border: "1.5px solid rgba(255,255,255,0.44)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "rgba(239,68,68,0.95)",
            textShadow:
              "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(239,68,68,0.18)",
            letterSpacing: "-0.5px",
          }}
        >
          সাম্প্রতিক কার্যকলাপ
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-white/30 border border-white/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                  ব
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    নতুন ব্যবহারকারী নিবন্ধিত হয়েছেন
                  </p>
                  <p className="text-sm text-gray-600">২ মিনিট আগে</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-red-600 hover:text-red-800">
                দেখুন
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
