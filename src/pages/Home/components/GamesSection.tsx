import { ArrowUpRight } from "lucide-react";
import GameArt from "./GameArt";
import { homeGames } from "./homeExtraData";

export default function GamesSection({ isEnglish }: { isEnglish: boolean }) {
  return (
    <section
      id="games"
      className="bg-gradient-to-b from-sky-50 to-white py-[60px] lg:py-[80px]"
      aria-labelledby="home-games-title"
    >
      <div className="site-container px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-red-600">
            {isEnglish ? "PLAY AND LEARN" : "খেলি, শিখি"}
          </p>
          <h2
            id="home-games-title"
            className="text-[32px] font-black leading-tight text-red-950 sm:text-[36px]"
          >
            {isEnglish ? "Games" : "গেমস"}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
            {isEnglish
              ? "Learn about weather and staying safe through fun games."
              : "মজার গেম খেলে আবহাওয়া ও নিরাপদ থাকার উপায় শিখে নাও।"}
          </p>
        </header>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeGames.map((game) => (
            <li key={game.title.en}>
              <a
                href={game.url}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(15,23,42,.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <div
                  className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${game.accent}`}
                >
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none">
                    <GameArt kind={game.art} />
                  </div>
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                    {isEnglish ? "Game" : "গেম"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-800">
                    {isEnglish ? game.title.en : game.title.bn}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                    {isEnglish ? game.description.en : game.description.bn}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-700">
                    {isEnglish ? "Play now" : "এখনই খেলো"}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
