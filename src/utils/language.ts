export type AppLocale = "bn" | "en";

const LANGUAGE_STORAGE_KEY = "met-club-language";

export function getStoredLocale(): AppLocale {
    if (typeof window === "undefined") {
        return "bn";
    }

    const storedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLocale === "en" ? "en" : "bn";
}

export function setStoredLocale(locale: AppLocale) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
}

export function getLocalizedPath(pathname: string, locale: AppLocale) {
    const localizedPaths: Array<{ bn: string; en: string }> = [
        { bn: "/", en: "/en" },
        { bn: "/login", en: "/en/login" },
        { bn: "/start-journey", en: "/en/start-journey" },
        { bn: "/learning-zone", en: "/en/learning-zone" },
        { bn: "/select-difficulty", en: "/en/select-difficulty" },
        { bn: "/learning-selection", en: "/en/learning-selection" },
        { bn: "/registration", en: "/en/registration" },
        { bn: "/lesson", en: "/en/lesson" },
        { bn: "/start-quiz", en: "/en/start-quiz" },
        { bn: "/quiz", en: "/en/quiz" },
        { bn: "/about", en: "/en/about" },
        { bn: "/location", en: "/en/location" },
        { bn: "/tutorials", en: "/en/tutorials" },
        { bn: "/blogs", en: "/en/blogs" },
        { bn: "/profile", en: "/en/profile" },
    ];

    for (const item of localizedPaths) {
        // exact match
        if (pathname === item.bn || pathname === item.en) {
            return locale === "en" ? item.en : item.bn;
        }

        // skip root entry for prefix matching
        if (item.bn === "/") continue;

        // if path starts with the bn variant (e.g. /select-difficulty/1), map to en keeping suffix
        if (pathname === item.bn || pathname.startsWith(item.bn + "/")) {
            const suffix = pathname.slice(item.bn.length);
            return (locale === "en" ? item.en : item.bn) + suffix;
        }

        // if path starts with the en variant (e.g. /en/select-difficulty/1), map to bn keeping suffix
        if (pathname === item.en || pathname.startsWith(item.en + "/")) {
            const suffix = pathname.slice(item.en.length);
            return (locale === "en" ? item.en : item.bn) + suffix;
        }
    }

    return pathname;
}
