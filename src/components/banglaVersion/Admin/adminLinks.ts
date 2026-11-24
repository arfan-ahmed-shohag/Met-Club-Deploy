import {
  FiBookOpen,
  FiFileText,
  FiGrid,
  FiImage,
  FiMapPin,
  FiMessageSquare,
  FiVideo,
} from "react-icons/fi";
import type { IconType } from "react-icons";

export interface AdminLink {
  name: string;
  path: string;
  icon: IconType;
}

export interface AdminLinkGroup {
  label: string;
  links: AdminLink[];
}

/** Sidebar navigation shared by the desktop sidebar, mobile drawer and header title. */
export const adminLinkGroups: AdminLinkGroup[] = [
  {
    label: "ড্যাশবোর্ড",
    links: [{ name: "ওভারভিউ", path: "/admin/overview", icon: FiGrid }],
  },
  {
    label: "কন্টেন্ট",
    links: [
      { name: "ব্লগ পর্যালোচনা", path: "/admin/blogs", icon: FiBookOpen },
      { name: "ফটো গ্যালারি", path: "/admin/gallery", icon: FiImage },
      { name: "হোম ভিডিও", path: "/admin/videos", icon: FiVideo },
      { name: "গল্প পরিচালনা", path: "/admin/stories", icon: FiMessageSquare },
    ],
  },
  {
    label: "প্রকাশনা",
    links: [
      { name: "Comics", path: "/admin/comics", icon: FiFileText },
      { name: "Flyers", path: "/admin/flyers", icon: FiFileText },
      { name: "News", path: "/admin/press-releases", icon: FiFileText },
    ],
  },
  {
    label: "প্রতিষ্ঠান",
    links: [{ name: "স্কুল পরিচালনা", path: "/admin/schools", icon: FiMapPin }],
  },
];

export const adminLinks = adminLinkGroups.flatMap((group) => group.links);

export function getAdminPageTitle(pathname: string) {
  const match = adminLinks.find(
    (link) => pathname === link.path || pathname.startsWith(`${link.path}/`),
  );
  if (match) return match.name;
  const path = pathname.replace(/\/$/, "");
  if (path === "/admin/profile") return "প্রোফাইল";
  return path === "/admin" ? "ওভারভিউ" : "অ্যাডমিন";
}
