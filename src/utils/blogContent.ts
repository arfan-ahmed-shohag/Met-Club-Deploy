import { resolveMediaUrl } from "./media";

const SAFE_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "ol", "ul", "li", "a", "img"]);
const DROP_CONTENT_TAGS = new Set(["script", "style", "iframe", "object", "svg", "math"]);
const BLOG_IMAGE_PATH = /^\/uploads\/blogs\/[a-z0-9-]+\.(?:png|jpe?g|webp|gif)$/i;

function getSafeBlogImagePath(value: string) {
    try {
        const pathname = new URL(value, window.location.origin).pathname;
        return BLOG_IMAGE_PATH.test(pathname) ? pathname : null;
    } catch {
        return null;
    }
}

export function sanitizeBlogHtml(html: string): string {
    const parsed = new DOMParser().parseFromString(html, "text/html");

    const copySafeNode = (node: Node): Node | null => {
        if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || "");
        if (!(node instanceof Element)) return null;

        const tag = node.tagName.toLowerCase();
        if (DROP_CONTENT_TAGS.has(tag)) return null;
        if (!SAFE_TAGS.has(tag)) {
            const fragment = document.createDocumentFragment();
            node.childNodes.forEach((child) => {
                const safeChild = copySafeNode(child);
                if (safeChild) fragment.appendChild(safeChild);
            });
            return fragment;
        }

        const safeElement = document.createElement(tag);
        if (tag === "img") {
            const path = getSafeBlogImagePath(node.getAttribute("src") || "");
            if (!path) return null;
            safeElement.setAttribute("src", resolveMediaUrl(path));
            safeElement.setAttribute("alt", (node.getAttribute("alt") || "Blog image").slice(0, 200));
            safeElement.setAttribute("loading", "lazy");
            safeElement.setAttribute("decoding", "async");
            return safeElement;
        }
        if (tag === "a") {
            const rawHref = node.getAttribute("href");
            if (rawHref) {
                try {
                    const parsedUrl = new URL(rawHref, window.location.origin);
                    if (["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) {
                        safeElement.setAttribute("href", parsedUrl.href);
                        safeElement.setAttribute("rel", "noopener noreferrer nofollow");
                        safeElement.setAttribute("target", "_blank");
                    }
                } catch {
                    // Leave unsafe or invalid links without a href.
                }
            }
        }
        if (tag === "li" && ["bullet", "ordered"].includes(node.getAttribute("data-list") || "")) {
            safeElement.setAttribute("data-list", node.getAttribute("data-list") || "");
        }
        node.childNodes.forEach((child) => {
            const safeChild = copySafeNode(child);
            if (safeChild) safeElement.appendChild(safeChild);
        });
        return safeElement;
    };

    const safeRoot = document.createElement("div");
    parsed.body.childNodes.forEach((node) => {
        const safeNode = copySafeNode(node);
        if (safeNode) safeRoot.appendChild(safeNode);
    });
    return safeRoot.innerHTML;
}

export function blogHtmlToText(html: string): string {
    const parsed = new DOMParser().parseFromString(sanitizeBlogHtml(html), "text/html");
    const blockTags = new Set(["p", "div", "li", "ol", "ul", "br"]);
    const collectText = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
        if (!(node instanceof Element)) return "";
        if (node.tagName.toLowerCase() === "img") return " ";

        const childText = Array.from(node.childNodes, collectText).join("");
        return blockTags.has(node.tagName.toLowerCase()) ? `${childText} ` : childText;
    };
    return collectText(parsed.body).replace(/\s+/g, " ").trim();
}

export function normalizeBlogImagePaths(html: string): string {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    parsed.querySelectorAll("img").forEach((image) => {
        const path = getSafeBlogImagePath(image.getAttribute("src") || "");
        if (path) image.setAttribute("src", path);
        else image.remove();
    });
    return parsed.body.innerHTML;
}

export function blogHtmlFirstImage(html: string): string | null {
    const parsed = new DOMParser().parseFromString(sanitizeBlogHtml(html), "text/html");
    return parsed.querySelector("img")?.getAttribute("src") || null;
}

export function blogHtmlWithoutFirstImage(html: string): string {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    parsed.querySelector("img")?.remove();
    return parsed.body.innerHTML;
}
