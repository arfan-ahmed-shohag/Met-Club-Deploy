export interface ChapterTopic {
  id: number;
  title: string;
  image: string;
  borderColor: string;
  glowColor: string;
  row: number;
}

const chapterRequests = new Map<string, Promise<ChapterTopic[]>>();

/** Cached chapter list for the given language (stable promise for `use()`). */
export const getChapters = (isEnglish: boolean) => {
  const url = isEnglish ? "/chapter.en.json" : "/chapter.json";
  let request = chapterRequests.get(url);
  if (!request) {
    request = fetch(url).then(
      (response) => response.json() as Promise<ChapterTopic[]>,
    );
    chapterRequests.set(url, request);
  }
  return request;
};
