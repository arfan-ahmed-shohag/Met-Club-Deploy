import type { AppLocale } from "./language";

export type HeaderChapter = { id: number; title: string };
export type HeaderChapterLink = HeaderChapter & { locale: AppLocale };
type HeaderSection = "about" | "chapters" | "anticipatory" | "resources";

export function getHeaderNavigationState(pathname: string) {
    const path = pathname.split(/[?#]/, 1)[0]
        .replace(/^\/en(?=\/|$)/, "")
        .replace(/\/+$/, "") || "/";
    const chapterMatch = path.match(/^\/(?:lesson|start-quiz|select-difficulty|quiz)\/(\d+)(?:\/|$)/);
    let section: HeaderSection | null = null;

    if (path === "/" || path === "/about") section = "about";
    else if (/^\/(?:start-journey|learning-selection|learning-zone|lesson|start-quiz|select-difficulty|quiz)(?:\/|$)/.test(path)) section = "chapters";
    else if (/^\/met-club-module(?:-2)?$/.test(path)) section = "anticipatory";
    else if (/^\/(?:blogs|tutorials)(?:\/|$)/.test(path)) section = "resources";

    return { path, section, chapterId: chapterMatch ? Number(chapterMatch[1]) : null };
}

export function getHeaderChapterLinks(banglaChapters: HeaderChapter[], englishChapters: HeaderChapter[] | null, locale: AppLocale): HeaderChapterLink[] {
    const chaptersById = new Map(banglaChapters.map((chapter) => [chapter.id, chapter]));
    const englishById = new Map(englishChapters?.map((chapter) => [chapter.id, chapter]) ?? []);

    if (locale === "en") {
        for (const chapter of englishById.values()) {
            if (!chaptersById.has(chapter.id)) chaptersById.set(chapter.id, chapter);
        }
    }

    return [...chaptersById.values()].sort((first, second) => first.id - second.id).map((chapter) => {
        const englishChapter = locale === "en" ? englishById.get(chapter.id) : undefined;
        return { id: chapter.id, title: englishChapter?.title ?? chapter.title, locale: englishChapter ? "en" : "bn" };
    });
}
