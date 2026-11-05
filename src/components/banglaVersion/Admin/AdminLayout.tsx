import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import { FiHome, FiMenu, FiX } from "react-icons/fi";
import { FiGrid, FiBook, FiFileText, FiPlusCircle, FiPlayCircle, FiBookOpen } from "react-icons/fi";
import { NavLink } from "react-router";

const sidebarLinks = [
  { name: "ওভারভিউ", path: "/admin/overview", icon: FiGrid },
  { name: "অধ্যায় পরিচালনা", path: "/admin/chapters", icon: FiBook },
  { name: "কন্টেন্ট পরিচালনা", path: "/admin/content", icon: FiFileText },
  { name: "কন্টেন্ট তৈরি করুন", path: "/admin/create-content", icon: FiPlusCircle },
  { name: "টিউটোরিয়াল পরিচালনা", path: "/admin/tutorials", icon: FiPlayCircle },
  { name: "ব্লগ পর্যালোচনা", path: "/admin/blogs", icon: FiBookOpen },
  { name: "টিউটোরিয়াল তৈরি করুন", path: "/admin/create-tutorial", icon: FiPlusCircle },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine current page title from URL
  const currentLink = sidebarLinks.find(link => location.pathname.includes(link.path));
  const pageTitle = currentLink ? currentLink.name : "Admin Dashboard";

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(180deg, rgba(20,6,6,0.3) 0%, rgba(20,6,6,0.2) 55%, rgba(20,6,6,0.25) 100%)",
        }}
      />
      <Sidebar />

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside
            className="relative w-72 h-full flex flex-col z-50 animate-in slide-in-from-left duration-300"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
            }}
          >
            <div className="flex items-center justify-between px-4 border-b" style={{ height: 68, borderBottomColor: "rgba(0,0,0,0.1)" }}>
              <span className="font-black text-lg text-red-900">Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-red-900">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 overflow-y-auto flex flex-col gap-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isActive ? "text-white" : ""
                      }`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? "linear-gradient(135deg, #ef4444, #f97316)" : "transparent",
                      color: isActive ? "#fff" : "rgba(127,29,29,0.9)",
                    })}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-72 flex flex-col min-h-screen relative z-10">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30"
          style={{
            height: 68,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 
              className="text-xl font-bold drop-shadow-md" 
              style={{
                color: "rgba(239,68,68,0.95)",
                textShadow: "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(239,68,68,0.18)",
                letterSpacing: "-0.5px",
              }}
            >{pageTitle}</h1>
          </div>

          {/* Universal Add Button */}
          <Link to="/"
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl font-bold text-white transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              boxShadow: "0 4px 14px rgba(220,38,38,0.28)",
            }}
          >
            <FiHome className="w-5 h-5" />
            <span className="hidden sm:inline">হোম</span>
          </Link>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
