import { Link, NavLink } from "react-router";
import { FiGrid, FiFileText, FiPlusCircle, FiPlayCircle, FiMapPin, FiBookOpen } from "react-icons/fi";
import { LogOut } from "lucide-react";
import useLogout from "../../../hooks/useLogout";

const sidebarLinks = [
  { name: "ওভারভিউ", path: "/admin/overview", icon: FiGrid },
  { name: "কন্টেন্ট পরিচালনা", path: "/admin/content", icon: FiFileText },
  { name: "কন্টেন্ট তৈরি করুন", path: "/admin/create-content", icon: FiPlusCircle },
  { name: "টিউটোরিয়াল পরিচালনা", path: "/admin/tutorials", icon: FiPlayCircle },
  { name: "ব্লগ পর্যালোচনা", path: "/admin/blogs", icon: FiBookOpen },
  { name: "টিউটোরিয়াল তৈরি করুন", path: "/admin/create-tutorial", icon: FiPlusCircle },
  { name: "স্কুল পরিচালনা", path: "/admin/schools", icon: FiMapPin },
];

export default function Sidebar() {
  const logOut = useLogout()
  return (
    <aside
      className="w-72 h-screen fixed left-0 top-0 hidden lg:flex flex-col z-20"
      style={{
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderRight: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "10px 0 40px rgba(0,0,0,0.05)",
      }}
    >
      {/* Brand Header */}
      <div className="h-17 flex items-center justify-center border-b" style={{ borderBottomColor: "rgba(255,255,255,0.25)" }}>
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{
              width: 38,
              height: 38,
              background: "rgba(239,68,68,0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 20px rgba(239,68,68,0.25)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" className="w-5 h-5">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <polyline points="9 21 9 12 15 12 15 21" />
            </svg>
          </span>
          <span
            className="font-black text-lg"
            style={{
              color: "rgba(239,68,68,0.95)",
              letterSpacing: "-0.5px",
              textShadow: "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(239,68,68,0.18)",
            }}
          >
            মেট ক্লাব এডমিন
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto flex flex-col gap-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive ? "text-white" : ""
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? "linear-gradient(135deg, #ef4444, #f97316)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.8)",
                boxShadow: isActive ? "0 4px 14px rgba(220,38,38,0.28)" : "none",
                textShadow: isActive ? "0 1px 2px rgba(0,0,0,0.2)" : "0 1px 2px rgba(0,0,0,0.4)",
              })}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer link back to app */}
      <div className="p-4 border-t" style={{ borderTopColor: "rgba(255,255,255,0.25)" }}>
        <button 
          onClick={logOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium hover:bg-white/30 w-full cursor-pointer"
          style={{
            color: "#fff",
            background: "#ef4444",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          <LogOut className="w-4 h-4" />
          লগ আউট
        </button>
      </div>
    </aside>
  );
}
