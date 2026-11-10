import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { getLocalizedPath, setStoredLocale } from "../../utils/language";
import type { AppLocale } from "../../utils/language";
import { getHeaderChapterLinks, getHeaderNavigationState } from "../../utils/headerNavigation";
import type { HeaderChapter, HeaderChapterLink } from "../../utils/headerNavigation";

type DropdownName = "chapters" | "resources";
type ChapterState =
    | { locale: AppLocale; status: "ready"; chapters: HeaderChapterLink[] }
    | { locale: AppLocale; status: "error" };

type HeaderNavigationProps = {
    locale: AppLocale;
    pathname: string;
    onNavigate: () => void;
    renderMobileAccount: (closeMenu: () => void) => ReactNode;
};

const resources = [
    { bn: "কমিকস", en: "Comics", path: null },
    { bn: "ফ্লায়ার", en: "Flyer", path: null },
    { bn: "ভিডিও", en: "Video", path: null },
    { bn: "প্রেস রিলিজ", en: "Press Release", path: null },
    { bn: "ব্লগ", en: "Blogs", path: "/blogs" },
    { bn: "গল্প", en: "Stories", path: null },
    { bn: "ফটো গ্যালারি", en: "Photo Gallery", path: null },
];

function isChapter(value: unknown): value is HeaderChapter {
    return typeof value === "object" && value !== null
        && "id" in value && typeof value.id === "number" && Number.isInteger(value.id) && value.id > 0
        && "title" in value && typeof value.title === "string" && value.title.trim().length > 0;
}

export default function HeaderNavigation({ locale, pathname, onNavigate, renderMobileAccount }: HeaderNavigationProps) {
    const isEnglish = locale === "en";
    const id = useId();
    const navigationRef = useRef<HTMLDivElement>(null);
    const mobileButtonRef = useRef<HTMLButtonElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<DropdownName | null>(null);
    const [chapterState, setChapterState] = useState<ChapterState | null>(null);
    const [loadAttempt, setLoadAttempt] = useState(0);
    const currentChapters = chapterState?.locale === locale ? chapterState : null;
    const currentPage = getHeaderNavigationState(pathname);
    const linkClass = "header-navigation-link flex items-center gap-2 px-3 py-2 text-sm font-semibold leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600";
    const dropdownLinkClass = `${linkClass} rounded-md duration-200 hover:bg-red-50 focus-visible:bg-red-50`;
    const panelClass = "rounded-xl border border-red-100 bg-white p-2 shadow-xl";

    useEffect(() => {
        const controller = new AbortController();

        const loadChapters = async () => {
            try {
                const readChapters = async (file: string): Promise<HeaderChapter[]> => {
                    const response = await fetch(file, { signal: controller.signal });
                    if (!response.ok) throw new Error("Could not load chapters");
                    const data: unknown = await response.json();
                    if (!Array.isArray(data) || data.length === 0 || !data.every(isChapter)) throw new Error("Invalid chapter list");
                    return data;
                };
                const [bangla, english] = await Promise.allSettled([
                    readChapters("/chapter.json"),
                    locale === "en" ? readChapters("/chapter.en.json") : Promise.resolve(null),
                ]);
                const chapters = getHeaderChapterLinks(
                    bangla.status === "fulfilled" ? bangla.value : [],
                    english.status === "fulfilled" ? english.value : null,
                    locale,
                );
                if (chapters.length === 0) throw new Error("Could not load chapters");
                if (!controller.signal.aborted) setChapterState({ locale, status: "ready", chapters });
            } catch {
                if (!controller.signal.aborted) setChapterState({ locale, status: "error" });
            }
        };

        void loadChapters();
        return () => controller.abort();
    }, [locale, loadAttempt]);

    useEffect(() => {
        if (!mobileOpen && !activeMenu) return;

        const closeOutside = (event: PointerEvent) => {
            if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
                setMobileOpen(false);
                setActiveMenu(null);
            }
        };

        document.addEventListener("pointerdown", closeOutside);
        return () => document.removeEventListener("pointerdown", closeOutside);
    }, [activeMenu, mobileOpen]);

    const closeNavigation = () => {
        setMobileOpen(false);
        setActiveMenu(null);
        onNavigate();
    };

    const closeOnBlur = (event: FocusEvent<HTMLLIElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null);
    };

    const handleDesktopEscape = (event: KeyboardEvent<HTMLLIElement>) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        setActiveMenu(null);
        event.currentTarget.querySelector("button")?.focus();
    };

    const renderChapterLinks = () => {
        if (!currentChapters) {
            return <p role="status" className="px-3 py-4 text-sm text-slate-600">{isEnglish ? "Loading chapters…" : "অধ্যায়গুলো লোড হচ্ছে…"}</p>;
        }
        if (currentChapters.status === "error") {
            return (
                <div className="px-3 py-3 text-sm">
                    <p role="alert">{isEnglish ? "Chapters could not be loaded." : "অধ্যায়গুলো লোড করা যায়নি।"}</p>
                    <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="mt-2 font-semibold underline underline-offset-4">
                        {isEnglish ? "Try again" : "আবার চেষ্টা করুন"}
                    </button>
                </div>
            );
        }
        return (
            <ul className="space-y-1">
                {currentChapters.chapters.map((chapter) => {
                    const target = getLocalizedPath(`/lesson/${chapter.id}`, chapter.locale);
                    const isCurrentChapter = currentPage.chapterId === chapter.id;
                    return (
                        <li key={chapter.id}>
                            <Link
                                to={target}
                                onClick={() => { if (chapter.locale !== locale) setStoredLocale(chapter.locale); closeNavigation(); }}
                                aria-current={isCurrentChapter ? (pathname === target ? "page" : "true") : undefined}
                                data-active={isCurrentChapter}
                                className={`${dropdownLinkClass} items-start`}
                            >
                                <span aria-hidden="true" className="w-5 shrink-0">{new Intl.NumberFormat(isEnglish ? "en-US" : "bn-BD").format(chapter.id)}.</span>
                                <span>{chapter.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderResourceLinks = () => (
        <ul className="space-y-1">
            {resources.map((resource) => {
                const isCurrentResource = resource.path !== null
                    && (currentPage.path === resource.path || currentPage.path.startsWith(`${resource.path}/`));
                return (
                    <li key={resource.en}>
                        {resource.path ? (
                            <Link
                                to={getLocalizedPath(resource.path, locale)}
                                onClick={closeNavigation}
                                aria-current={isCurrentResource ? (currentPage.path === resource.path ? "page" : "true") : undefined}
                                data-active={isCurrentResource}
                                className={dropdownLinkClass}
                            >{isEnglish ? resource.en : resource.bn}</Link>
                        ) : (
                            <a href="#" onClick={closeNavigation} className={dropdownLinkClass}>{isEnglish ? resource.en : resource.bn}</a>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    const menus = [
        { name: "chapters" as const, label: isEnglish ? "Learn with Fun" : "আনন্দের সাথে শিখুন" },
        { name: "resources" as const, label: isEnglish ? "Resources" : "উপকরণ" },
    ];

    const desktopDropdown = ({ name, label }: typeof menus[number]) => (
        <li
            key={name}
            className="relative"
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setActiveMenu(name); }}
            onPointerLeave={(event) => { if (event.pointerType === "mouse") setActiveMenu(null); }}
            onBlur={closeOnBlur}
            onKeyDown={handleDesktopEscape}
        >
            <button type="button" aria-expanded={activeMenu === name} aria-controls={`${id}-desktop-${name}`} aria-current={currentPage.section === name ? "true" : undefined} data-active={currentPage.section === name} onClick={() => setActiveMenu(activeMenu === name ? null : name)} className={`${linkClass} whitespace-nowrap`}>
                {label}<ChevronDown aria-hidden="true" size={15} className={`shrink-0 transition-transform ${activeMenu === name ? "rotate-180" : ""}`} />
            </button>
            {activeMenu === name && (
                <div id={`${id}-desktop-${name}`} className={`absolute top-full z-50 pt-3 ${name === "chapters" ? "left-0 w-80" : "right-0 w-56"}`}>
                    <div className={`${panelClass} max-h-[calc(100dvh-7rem)] overflow-y-auto`}>
                        {name === "chapters" ? renderChapterLinks() : renderResourceLinks()}
                    </div>
                </div>
            )}
        </li>
    );

    const mobileDropdown = ({ name, label }: typeof menus[number]) => (
        <li key={name}>
            <button type="button" aria-expanded={activeMenu === name} aria-controls={`${id}-mobile-${name}`} aria-current={currentPage.section === name ? "true" : undefined} data-active={currentPage.section === name} onClick={() => setActiveMenu(activeMenu === name ? null : name)} className={`${linkClass} w-full justify-between`}>
                {label}<ChevronDown aria-hidden="true" size={17} className={`transition-transform ${activeMenu === name ? "rotate-180" : ""}`} />
            </button>
            {activeMenu === name && (
                <div id={`${id}-mobile-${name}`} className="ml-3 border-l border-red-100 pl-2">
                    {name === "chapters" ? renderChapterLinks() : renderResourceLinks()}
                </div>
            )}
        </li>
    );

    return (
        <div
            ref={navigationRef}
            className="header-navigation order-3 flex shrink-0 items-center justify-end xl:order-1 xl:min-w-0 xl:flex-1 xl:justify-center"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    setMobileOpen(false);
                    setActiveMenu(null);
                    mobileButtonRef.current?.focus();
                }
            }}
        >
            <nav aria-label={isEnglish ? "Main navigation" : "প্রধান নেভিগেশন"} className="hidden xl:block">
                <ul className="flex items-center gap-1">
                    <li><Link to={getLocalizedPath("/about", locale)} onClick={closeNavigation} aria-current={currentPage.section === "about" ? "page" : undefined} data-active={currentPage.section === "about"} className={`${linkClass} whitespace-nowrap`}>{isEnglish ? "About MET Club" : "মেট ক্লাব সম্পর্কে"}</Link></li>
                    {desktopDropdown(menus[0])}
                    <li><a href="#" onClick={closeNavigation} aria-current={currentPage.section === "anticipatory" ? "true" : undefined} data-active={currentPage.section === "anticipatory"} className={`${linkClass} whitespace-nowrap`}>{isEnglish ? "Child Friendly Anticipatory Action" : "শিশুবান্ধব আগাম কার্যক্রম"}</a></li>
                    <li><a href="http://game.meteorologyclub.com/" onClick={closeNavigation} className={linkClass}>{isEnglish ? "Games" : "গেমস"}</a></li>
                    {desktopDropdown(menus[1])}
                </ul>
            </nav>

            <button
                ref={mobileButtonRef}
                type="button"
                aria-label={isEnglish ? (mobileOpen ? "Close navigation" : "Open navigation") : (mobileOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন")}
                aria-expanded={mobileOpen}
                aria-controls={`${id}-mobile-navigation`}
                onClick={() => { setMobileOpen((open) => !open); setActiveMenu(null); onNavigate(); }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-red-100 bg-white text-red-900 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 xl:hidden"
            >
                {mobileOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
            </button>

            {mobileOpen && (
                <nav id={`${id}-mobile-navigation`} aria-label={isEnglish ? "Mobile navigation" : "মোবাইল নেভিগেশন"} className={`${panelClass} absolute inset-x-5 top-[calc(100%+12px)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto xl:hidden`}>
                    <ul className="space-y-1">
                        <li><Link to={getLocalizedPath("/about", locale)} onClick={closeNavigation} aria-current={currentPage.section === "about" ? "page" : undefined} data-active={currentPage.section === "about"} className={linkClass}>{isEnglish ? "About MET Club" : "মেট ক্লাব সম্পর্কে"}</Link></li>
                        {mobileDropdown(menus[0])}
                        <li><a href="#" onClick={closeNavigation} aria-current={currentPage.section === "anticipatory" ? "true" : undefined} data-active={currentPage.section === "anticipatory"} className={linkClass}>{isEnglish ? "Child Friendly Anticipatory Action" : "শিশুবান্ধব আগাম কার্যক্রম"}</a></li>
                        <li><a href="http://game.meteorologyclub.com/" onClick={closeNavigation} className={linkClass}>{isEnglish ? "Games" : "গেমস"}</a></li>
                        {mobileDropdown(menus[1])}
                    </ul>
                    <div className="mt-3 border-t border-red-100 pt-3">
                        {renderMobileAccount(closeNavigation)}
                    </div>
                </nav>
            )}
        </div>
    );
}
