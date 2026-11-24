// Content for the Home page Games and Citizen Charter sections.
// Edit the text and links here; the section components only render this data.

import { GAME_ORIGIN } from "../../../utils/gameRedirect";
import type { GameArtKind } from "./GameArt";

export type HomeGame = {
  url: string;
  art: GameArtKind;
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  accent: string;
};

// TODO: replace the second and third links/texts with the real games.
export const homeGames: HomeGame[] = [
  {
    url: `${GAME_ORIGIN}/`,
    art: "weather",
    title: { bn: "আবহাওয়া অভিযান", en: "Weather Adventure" },
    description: {
      bn: "আবহাওয়ার সংকেত বুঝে সঠিক সিদ্ধান্ত নাও, পয়েন্ট জেতো এবং লিডারবোর্ডে নিজের নাম তোলো।",
      en: "Read the weather signs, make the right choices, earn points and climb the leaderboard.",
    },
    accent: "from-sky-500 to-blue-700",
  },
  {
    url: `${GAME_ORIGIN}/`,
    art: "flood",
    title: { bn: "বন্যা থেকে বাঁচো", en: "Flood Escape" },
    description: {
      bn: "বন্যার আগাম সতর্কতা পেয়ে পরিবারকে নিয়ে সময়মতো নিরাপদ আশ্রয়ে পৌঁছানোর চ্যালেঞ্জ।",
      en: "Act on the flood warning in time and lead your family to a safe shelter.",
    },
    accent: "from-teal-500 to-emerald-700",
  },
  {
    url: `${GAME_ORIGIN}/`,
    art: "gobag",
    title: { bn: "গো-ব্যাগ গুছাও", en: "Pack the Go-Bag" },
    description: {
      bn: "জরুরি অবস্থার জন্য দরকারি জিনিস বেছে নিয়ে নিজের গো-ব্যাগ তৈরি করো।",
      en: "Pick the essentials you need in an emergency and build your own Go-Bag.",
    },
    accent: "from-orange-500 to-red-700",
  },
];

// Public KoboToolbox form for the Citizen Science survey (also linked in the
// navbar and footer).
export const CITIZEN_SCIENCE_URL = "https://ee.kobotoolbox.org/x/HtTB5kOn";
