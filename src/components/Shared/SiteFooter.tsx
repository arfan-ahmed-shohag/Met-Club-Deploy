import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import logo from "../../assets/images/logo_original.png";
import Partners from "./Partners";
import { getLocalizedPath } from "../../utils/language";
import type { AppLocale } from "../../utils/language";

export default function SiteFooter({ isEnglish }: { isEnglish: boolean }) {
  const locale: AppLocale = isEnglish ? "en" : "bn";
  const t = (bangla: string, english: string) =>
    isEnglish ? english : bangla;
  const links = [
    { label: t("মেট ক্লাব সম্পর্কে", "About MET Club"), path: "/about" },
    {
      label: t("শিশুবান্ধব আগাম কার্যক্রম", "Child Friendly Anticipatory Action"),
      path: "/anticipatory-action",
    },
    { label: t("গেমস", "Games"), path: "/start-journey" },
    { label: t("ভিডিও", "Videos"), path: "/videos" },
    { label: t("ফটো গ্যালারি", "Photo Gallery"), path: "/gallery" },
    { label: t("ব্লগ", "Blogs"), path: "/blogs" },
    { label: t("গল্প", "Stories"), path: "/stories" },
  ];

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#222] py-10 text-white md:py-14">
      <div className="site-container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-start lg:gap-12">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt={t("মেট ক্লাবের লোগো", "MET Club logo")}
              className="h-24 w-24 shrink-0 object-contain sm:h-32 sm:w-32"
            />
            <div>
              <h3 className="text-2xl font-black text-orange-500">
                {t("মেট ক্লাব", "MET Club")}
              </h3>
              <p className="mt-1 text-sm font-semibold text-gray-300">
                {t("আবহাওয়া চক্র", "Weather Cycle")}
              </p>
              <p className="mt-4 text-sm font-semibold italic text-red-200">
                {t('"তরুণ মন, শক্তিশালী সতর্কতা"', '"Young Minds, Stronger Warnings"')}
              </p>
            </div>
          </div>

          <nav aria-label={t("ফুটার নেভিগেশন", "Footer navigation")}>
            <h4 className="mb-4 border-b border-white/20 pb-3 text-lg font-bold">
              {t("দ্রুত লিংক", "Quick links")}
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-white/85">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={getLocalizedPath(link.path, locale)}
                    className="transition-colors hover:text-orange-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://ee.kobotoolbox.org/x/HtTB5kOn"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-orange-300"
                >
                  {t("সিটিজেন সায়েন্স পোর্টাল", "Citizen Science Portal")}
                </a>
              </li>
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-heading">
            <h4
              id="footer-contact-heading"
              className="mb-4 border-b border-sky-300/40 pb-3 text-lg font-bold"
            >
              {t("যোগাযোগের তথ্য", "Contact Info")}
            </h4>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-sky-300" />
                <span>{t("আগারগাঁও, ঢাকা-১২০৭", "Agargaon, Dhaka-1207")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-sky-300" />
                <a href="tel:+880241025705">+8802-41025705</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-sky-300" />
                <a href="mailto:info@bmd.gov.bd">info@bmd.gov.bd</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock3 size={18} className="shrink-0 text-sky-300" />
                <span>
                  {t("রবি–বৃহস্পতি: সকাল ৯টা–বিকাল ৫টা", "Sun–Thu: 9:00 AM–5:00 PM")}
                </span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-10">
          <Partners bg="bg-white" />
        </div>
        <div className="mt-10 border-t border-white/15 pt-5 text-center text-sm text-white/85">
          <a href="http://cdsr.com.bd" target="_blank" rel="noopener noreferrer">
            {t(
              "পরিকল্পনা ও বাস্তবায়ন: Centre for Data Science Research (CDSR)",
              "Developed by Centre for Data Science Research (CDSR)",
            )}
          </a>
        </div>
      </div>
    </footer>
  );
}
