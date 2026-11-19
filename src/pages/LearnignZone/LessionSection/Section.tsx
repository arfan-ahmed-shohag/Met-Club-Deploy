import { useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import TopNav from "../../../components/Shared/TopBar";
import chapterIllustration from "../../../assets/images/chapter-1.1.png";
import chapterTwoIllustration from "../../../assets/images/chapter-1.2.png";
import chapterThreeIllustration from "../../../assets/images/chapter-1.3.png";

type Dialogue = {
  speaker: string;
  text: string;
  character: "king" | "gopal" | "minister";
};

const dialogues: Dialogue[] = [
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "গোপাল! আজ সকালে ঘুম থেকে উঠেই মনটা কেমন যেন আকুপাকু করছে। আচ্ছা, মানুষ প্রতিদিন সকালে উঠেই কেন এমন হাঁ করে আকাশের দিকে তাকায় বলো তো?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "মহারাজ, আসলে আমরা অজান্তেই প্রতিদিন সকালে প্রকৃতির সবচেয়ে বড় ‘স্ট্যাটাস আপডেট’ খুঁজি! আর সেটা হলো—আবহাওয়া!",
  },
  {
    speaker: "মন্ত্রী",
    character: "minister",
    text: "উচ্চস্বরে হেসে হা হা হা! মহারাজ! এই মূর্খ ভাঁড় কী বুঝবে? আবহাওয়া হলো গ্রহ-নক্ষত্রের এক জটিল মহাজাগতিক গেম! যা আমার মতো প্লেয়ার ছাড়া কেউ বুঝতেই পারবে না!",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "ওহ মন্ত্রী মশাই! গেম তো আপনি ভালোই খেলেন, তবে সেটা প্রকৃতির গেম নয়, শুধুই মন ভোলানো কথার গেম!",
  },
  {
    speaker: "মন্ত্রী",
    character: "minister",
    text: "কী বললে তুমি! এই যে আমি দূরবীণ দিয়ে আবহাওয়া মাপছি—এই দেখো, পরিষ্কার দেখা যাচ্ছে—",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "আরে মন্ত্রী মশাই! দূরবীণটা তো উল্টো ধরে নিজের পায়ের চটি জুতো দেখছেন! মহারাজ, ওনার ভুলভাল দূরবীণ ছাড়ুন। একদম সোজা কথায়—কোনো একটা নির্দিষ্ট জায়গার, অল্প সময়ের (যেমন কয়েক দিনের) রোদ, বৃষ্টি, বাতাস আর গরমের অবস্থাই হলো আবহাওয়া।",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "বলো কী! তার মানে এই যে এখন একটু মিষ্টি বাতাস বয়ে এসে আমার রাজকীয় গোঁফটা নাড়িয়ে দিল, এটাও আবহাওয়া?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "একশো বার মহারাজ! এটাই তো আবহাওয়ার আসল ক্যারিশমা!",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "বাহ্! দারুণ তো! এই জানলা দিয়ে বাইরে দেখো, কী কড়া রোদ উঠেছে! উফ, আজ আমি শিকারে যাবই যাব। মন্ত্রী, জলদি তলোয়ার আনো, শিকারে যাব! আজ কিন্তু কোনো ছাতা-টাতা লাগবে না!",
  },
  {
    speaker: "মন্ত্রী",
    character: "minister",
    text: "জো হুকুম মহারাজ! এই যে আপনার তলোয়ার! আমার গণনানুযায়ী আজ সূর্যদেব আপনার ওপর ২০০% খুশি। বৃষ্টির কোনো চান্সই নেই, গ্যারান্টি!",
  },
];

const chapterTwoDialogues: Dialogue[] = [
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "একি রে! এইমাত্র না কড়া রোদ ছিল? আকাশটা হঠাৎ এমন কুচকুচে অন্ধকার হয়ে গেল কেন? ওরে বাপরে, তীরের মতো বৃষ্টি নামল যে! জলদি ছাতা আনো!",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "মহারাজ, এটাই তো আবহাওয়ার আসল খেলা! প্রকৃতির এই ক্ষণে ক্ষণে বদলে যাওয়া বা ‘মুড সুইং’ করাই হলো আবহাওয়া! মন্ত্রী মশাই, আপনার রেশমি শালটা মাথায় দিন, নইলে ভিজে তো চপ হয়ে যাবেন!",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "ওরে বাপরে! ঠান্ডা লেগে তো আমার হাঁচি শুরু হয়ে গেল! মুকুট বেয়ে জল পড়ছে! মন্ত্রী, তোমার ওই গণনায় কি কোনো ভুল ছিল?",
  },
  {
    speaker: "মন্ত্রী",
    character: "minister",
    text: "মহারাজ, মেঘেরা যে এভাবে বিনা নোটিশে আকস্মিক হানা দেবে, তা আমি স্বপ্নেও ভাবিনি! আমার গণনার খাতায় মনে হয় ভুল হয়ে গেছে!",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "মহারাজ, গণনার হিসাব নয়, আবহাওয়া হলো খুবই চঞ্চল আর খামখেয়ালি। আজ সকালে রোদ দেখে যদি ভাবেন দুপুরেও রোদ থাকবে, তবে কিন্তু বড় ধোঁকা খাবেন! এটা কয়েক মিনিটেই ডিগবাজি খেতে পারে।",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "উফ! রাজসভায় চল আগে! গামছা দিয়ে মাথাটা না মুছলে বাঁচব না। আবহাওয়া যে এত জলদি ডিগবাজি খায়, তা হাড়ে হাড়ে বুঝলাম! কিন্তু গোপাল, আমরা কী করে বুঝবো যে কোনো জায়গার আবহাওয়া ঠিক কেমন?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "খুব সোজা মহারাজ! আবহাওয়া নির্ণয় করতে মূলত ৫টি জিনিস দেখতে হয়—বায়ুর তাপমাত্রা (কতটা গরম বা ঠান্ডা), বায়ুর চাপ, বাতাস কোন দিকে বইছে, বাতাসে জলীয় বাষ্প কতটুকু (আর্দ্রতা) আর বৃষ্টিপাত হচ্ছে কি না।",
  },
  {
    speaker: "মন্ত্রী",
    character: "minister",
    text: "দাঁড়াও দাঁড়াও! এই যে আমি একটা মাটির ঘটি এনে ছাদের বৃষ্টির জল মেপে ফেলেছি! মহারাজ, আজ আমাদের পুরো রাজ্যের আবহাওয়া একদম ভেজা ভেজা! আমিই এই রাজ্যের সেরা বিজ্ঞানী!",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "মন্ত্রী মশাই, আপনি তো শুধু এই প্রাসাদের ছাদের ওপরের টুকু মেপেছেন! আপনি জানেন কি, আমাদের রাজপ্রাসাদে যখন ঝুম বৃষ্টি, ঠিক তিন মাইল দূরের গ্রামে তখন খটখটে রোদ? আবহাওয়া স্থানভেদে বদলে যায়!",
  },
];

const chapterThreeDialogues: Dialogue[] = [
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "ওফ! মাথাটা পুরো ঘুরেই গেল রে গোপাল! আবহাওয়া যদি এতই চঞ্চল আর স্থানভেদে আলাদা হয়, তবে ভূগোলে যে পড়েছিলাম ‘আমাদের দেশের জলবায়ু মনোরম’—এই ‘জলবায়ু’ জিনিসটা আবার কী? এটা কি আবহাওয়ারই কোনো বড় ভাই?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "সাবাশ মহারাজ! একদম ঠিক জায়গায় ঢিল মেরেছেন। জলবায়ু হলো আবহাওয়ারই বড় ভাই, তবে সে অনেক শান্ত, গম্ভীর আর ধৈর্যশীল! মন্ত্রী মশাই, একটু পাশে সরুন তো, ধুলো উড়বে!",
  },
  {
    speaker: "মন্ত্রী",
    character: "minister",
    text: "ধুলোর চোটে বিকট হাঁচি দিয়ে আচ্ছো! আহ্... এই পুরনো ধুলোমাখা খাতা নিয়ে কোথায় আসছ ভাঁড়?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "মহারাজ, কোনো একটা নির্দিষ্ট এলাকায় সাধারণত ৩০ থেকে ৪০ বছরের আবহাওয়ার যে একটা গড় বা স্থায়ী স্বভাব তৈরি হয়, সেটাই হলো জলবায়ু। এই ধুলোমাখা বুড়ো খাতার ভেতরেই লুকিয়ে আছে আমাদের ৩০-৪০ বছরের আবহাওয়ার রেকর্ড!",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "বল কী! এত বছরের হিসাব? কিন্তু গোপাল, এত জটিল হিসাব সাধারণ মানুষ বুঝবে কীভাবে?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "মহারাজ, আমাদের তরুণরা যেভাবে ক্রিকেট বোঝে, সেভাবে বুঝুন। আবহাওয়া যদি হয় কোনো ক্রিকেট ম্যাচের ‘লাইভ স্কোরকার্ড’ (যা প্রতি বলেই বদলে যেতে পারে), তবে জলবায়ু হলো সেই খেলোয়াড়ের পুরো ক্যারিয়ারের ‘ব্যাটিং গড়’!",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "উত্তেজনায় লাফিয়ে উঠে ওহ্! বুঝছি! তার মানে আবহাওয়া বদলাতে কয়েক মিনিট লাগে, কিন্তু জলবায়ু সহজে চেঞ্জ হয় না?",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "বিন্দাস বুঝেছেন মহারাজ! এই দেখুন দেয়ালে ঝুলানো চার্ট—আবহাওয়া হলো স্বল্প সময়ের (৭ দিন) অবস্থা যা দ্রুত বদলায়। আর জলবায়ু হলো ৩০-৪০ বছরের আবহাওয়ার গড় অবস্থা, যা সহজে বদলায় না!",
  },
  {
    speaker: "রাজা কৃষ্ণচন্দ্র",
    character: "king",
    text: "সাবাশ গোপাল! তোমার এই স্কোরকার্ডের বুদ্ধি দিয়ে আজ আবহাওয়া আর জলবায়ুর পার্থক্যটা আমার মাথায় একদম পার্মানেন্টলি ঢুকে গেল!",
  },
  {
    speaker: "গোপাল ভাঁড়",
    character: "gopal",
    text: "পাঠকদের উদ্দেশ্যে, কী বন্ধুরা? কনসেপ্ট ক্রিস্টাল ক্লিয়ার তো?",
  },
];

const dialoguesEn = [
  "Gopal! I woke up this morning with a curious feeling. Why do people look up at the sky as soon as they wake up?",
  "Your Majesty, without even realizing it, we look for nature's biggest status update every morning: the weather!",
  "Ha ha ha! Your Majesty, what would this foolish jester know? Weather is a complicated cosmic game of planets and stars—only a player like me can understand it!",
  "Oh, Minister! You may be good at games, but this is not nature's game. It is just a game of empty talk!",
  "What did you say? I am measuring the weather with this telescope. Look, it is perfectly clear—",
  "Minister, you are holding the telescope upside down and looking at your own shoes! Your Majesty, forget that silly telescope. Simply put, weather is the condition of sunshine, rain, wind, and warmth in a particular place over a short period, such as a few days.",
  "Really? So this gentle breeze that just moved my royal moustache is weather too?",
  "Absolutely, Your Majesty! That is the magic of weather!",
  "Wonderful! Look outside through this window—the sun is blazing. I am going hunting today! Minister, bring my sword quickly. No umbrella needed today!",
  "As you command, Your Majesty! Here is your sword. According to my calculations, the Sun God is 200% pleased with you today. There is absolutely no chance of rain—I guarantee it!",
];

const chapterTwoDialoguesEn = [
  "What is this? It was blazing sunshine just a moment ago! Why has the sky suddenly gone so dark? Oh no, rain is falling like arrows! Bring an umbrella quickly!",
  "Your Majesty, this is the real surprise of weather! Its moment-to-moment changes are what make weather so unpredictable. Minister, cover your head with your silk shawl, or you will be drenched!",
  "Oh no! I have started sneezing from the cold, and water is dripping from my crown! Minister, was there a mistake in your forecast?",
  "Your Majesty, I never imagined the clouds would attack without warning! I think there must be a mistake in my calculation book!",
  "Your Majesty, the calculation is not the issue. Weather is changeable and unpredictable. If you see sunshine in the morning and assume it will last through the afternoon, you may be fooled. It can change in just a few minutes.",
  "Let us hurry back to the palace! I need to dry my head. I have learned just how quickly weather can turn. But Gopal, how can we tell what the weather is like in a place?",
  "It is simple, Your Majesty! We look at five things: air temperature, air pressure, wind direction, the amount of water vapour in the air (humidity), and whether it is raining.",
  "Wait, wait! I measured the rainwater on the palace roof with this clay pot! The weather across our whole kingdom is wet today. I am the kingdom's greatest scientist!",
  "Minister, you measured only the rain on this palace roof! Did you know that while it pours here, a village just three miles away may have clear sunshine? Weather changes from place to place!",
];

const chapterThreeDialoguesEn = [
  "Whew! My head is spinning, Gopal! If weather changes so quickly and differs from place to place, what is this ‘pleasant climate’ I read about in geography? Is climate a big brother of weather?",
  "Well done, Your Majesty—you asked exactly the right question! Climate is like weather's older sibling: calm, serious, and patient. Minister, please step aside; you are raising dust!",
  "Achoo! This dust is making me sneeze! Ah… where are you going with that old, dusty book, jester?",
  "Climate is the average or usual pattern of weather in a particular area over a long period—typically 30 years or more. This dusty old book contains records of our weather over many years!",
  "What! So many years of records? But how can ordinary people understand such complicated calculations?",
  "Think of it the way young people understand cricket. Weather is like a match's live scorecard, changing with every ball. Climate is like a player's batting average over their whole career!",
  "The King jumps with excitement: Oh, I understand! Weather can change in minutes, but climate does not change easily?",
  "Exactly, Your Majesty! Look at this chart: weather describes short-term conditions, such as over seven days, and changes quickly. Climate is the average weather over 30 years or more and changes slowly.",
  "Excellent, Gopal! Your scorecard example has made the difference between weather and climate stick in my mind!",
  "And you, readers? Is the concept crystal clear now?",
];

const chapterScenes = [
  {
    image: chapterIllustration,
    scene: "১",
    sceneEn: "1",
    dialogues,
    dialoguesEn,
  },
  {
    image: chapterTwoIllustration,
    scene: "২",
    sceneEn: "2",
    dialogues: chapterTwoDialogues,
    dialoguesEn: chapterTwoDialoguesEn,
  },
  {
    image: chapterThreeIllustration,
    scene: "৩",
    sceneEn: "3",
    dialogues: chapterThreeDialogues,
    dialoguesEn: chapterThreeDialoguesEn,
  },
];

// The speakers occupy different places in the second illustration, so its bubbles
// need their own anchors and tails instead of reusing the first scene's layout.
const chapterTwoBubblePosition: Record<Dialogue["character"], string> = {
  gopal: "left-[1.5%] sm:left-[3%] md:left-[1.5%]",
  king: "right-[1.5%] sm:right-[1.5%] md:right-[1.5%]",
  minister: "left-[28%] sm:left-[29%] md:left-[29%]",
};
const chapterTwoBubbleWidth: Record<Dialogue["character"], string> = {
  gopal: "w-[72%] sm:w-[55%] md:w-[36%]",
  king: "w-[72%] sm:w-[52%] md:w-[40%]",
  minister: "w-[68%] sm:w-[50%] md:w-[35%]",
};
const chapterTwoTailPosition: Record<Dialogue["character"], string> = {
  gopal: "left-[46%] sm:left-[46%] md:left-[46%]",
  king: "left-[7%] sm:left-[7%] md:left-[7%]",
  minister: "left-[28%] sm:left-[28%] md:left-[28%]",
};
const chapterTwoBubbleTop: Record<Dialogue["character"], string> = {
  gopal: "top-[3%]",
  king: "top-0",
  minister: "top-[3%]",
};
const chapterThreeBubblePosition: Record<Dialogue["character"], string> = {
  king: "left-[1.5%] sm:left-[2%] md:left-[1.5%]",
  gopal: "left-[32%] sm:left-[32%] md:left-[32%]",
  minister: "right-[1.5%] sm:right-[2%] md:right-[1.5%]",
};
const chapterThreeBubbleWidth: Record<Dialogue["character"], string> = {
  king: "w-[75%] sm:w-[52%] md:w-[37%]",
  gopal: "w-[75%] sm:w-[52%] md:w-[37%]",
  minister: "w-[75%] sm:w-[52%] md:w-[37%]",
};
const chapterThreeTailPosition: Record<Dialogue["character"], string> = {
  king: "left-[47%] sm:left-[47%] md:left-[47%]",
  gopal: "left-[52%] sm:left-[52%] md:left-[52%]",
  minister: "left-[60%] sm:left-[60%] md:left-[60%]",
};
const chapterThreeTailPath: Record<Dialogue["character"], string> = {
  king: "M2 2 Q30 8 58 2 Q50 25 31 54 Q34 27 2 2Z",
  gopal: "M2 2 Q30 8 58 2 Q50 25 31 54 Q34 27 2 2Z",
  minister: "M2 2 Q30 8 58 2 Q48 25 27 54 Q32 27 2 2Z",
};
const chapterThreeTailSize: Record<Dialogue["character"], string> = {
  gopal: "h-9 w-9 sm:h-11 sm:w-11",
  king: "h-9 w-9 sm:h-11 sm:w-11",
  minister: "h-9 w-9 sm:h-11 sm:w-11",
};

const bubblePosition: Record<Dialogue["character"], string> = {
  gopal: "left-[1.5%] sm:left-[4%] md:left-[1.5%]",
  // Keep the king's bubble clear of his face; the tail reaches back toward him.
  king: "left-[26%] sm:left-[32%] md:left-[40%]",
  minister: "right-[1.5%] sm:right-[2%] md:right-[1.5%]",
};
const bubbleWidth: Record<Dialogue["character"], string> = {
  gopal: "w-[72%] sm:w-[55%] md:w-[36%]",
  king: "w-[70%] sm:w-[52%] md:w-[38%]",
  minister: "w-[72%] sm:w-[55%] md:w-[36%]",
};
const bubbleTailPosition: Record<Dialogue["character"], string> = {
  gopal: "left-[23%] sm:left-[25%] md:left-[46%]",
  king: "left-[8%] sm:left-[3%] md:left-[-1%]",
  minister: "left-[69%] sm:left-[60%] md:left-[38%]",
};
const bubbleTailSize: Record<Dialogue["character"], string> = {
  gopal: "h-9 w-9 sm:h-11 sm:w-11",
  king: "h-11 w-12 sm:h-12 sm:w-14 md:h-[58px] md:w-[72px]",
  minister: "h-9 w-9 sm:h-11 sm:w-11",
};
const bubbleTailTop: Record<Dialogue["character"], string> = {
  gopal: "top-[calc(100%-13px)]",
  king: "top-[calc(100%-28px)]",
  minister: "top-[calc(100%-13px)]",
};
const bubbleTailPath: Record<Dialogue["character"], string> = {
  // Rounded, hand-drawn tails; each tip points toward its speaker.
  gopal: "M2 2 Q30 8 58 2 Q50 25 31 54 Q34 27 2 2Z",
  king: "M2 2 Q30 9 58 2 L4 54 Q20 29 2 2Z",
  minister: "M2 2 Q30 8 58 2 Q48 25 27 54 Q32 27 2 2Z",
};
const bubbleTextPosition: Record<Dialogue["character"], string> = {
  gopal: "translate-y-1",
  king: "translate-y-1",
  minister: "translate-y-1",
};

export default function ChapterDialoguePreview(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith("/en/");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scene = chapterScenes[chapterIndex];
  const current = scene.dialogues[activeIndex];
  const currentBubblePosition =
    chapterIndex === 2
      ? chapterThreeBubblePosition[current.character]
      : chapterIndex === 1
        ? chapterTwoBubblePosition[current.character]
        : bubblePosition[current.character];
  const currentBubbleWidth =
    chapterIndex === 2
      ? chapterThreeBubbleWidth[current.character]
      : chapterIndex === 1
        ? chapterTwoBubbleWidth[current.character]
        : bubbleWidth[current.character];
  const currentTailPosition =
    chapterIndex === 2
      ? chapterThreeTailPosition[current.character]
      : chapterIndex === 1
        ? chapterTwoTailPosition[current.character]
        : bubbleTailPosition[current.character];
  const currentTailPath =
    chapterIndex === 2
      ? chapterThreeTailPath[current.character]
      : bubbleTailPath[current.character];
  const currentTailSize =
    chapterIndex === 2
      ? chapterThreeTailSize[current.character]
      : bubbleTailSize[current.character];
  const currentBubbleTop =
    chapterIndex === 1 ? chapterTwoBubbleTop[current.character] : "top-[3%]";

  const moveNext = () => {
    if (activeIndex < scene.dialogues.length - 1) {
      setActiveIndex((index) => index + 1);
    } else if (chapterIndex < chapterScenes.length - 1) {
      setChapterIndex((index) => index + 1);
      setActiveIndex(0);
    } else {
      navigate(
        location.pathname.startsWith("/en/")
          ? "/en/learning-zone"
          : "/learning-zone",
      );
    }
  };
  const movePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex((index) => index - 1);
    } else if (chapterIndex > 0) {
      setChapterIndex((index) => index - 1);
      setActiveIndex(chapterScenes[chapterIndex - 1].dialogues.length - 1);
    }
  };
  const restart = () => {
    setChapterIndex(0);
    setActiveIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        title={isEnglish ? "Chapter 1: Story" : "অধ্যায় ১: গল্প"}
        brandName="MET Club"
      />
      <main className="site-container px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-red-600">
              {isEnglish ? "CHAPTER 1 · STORY" : "অধ্যায় ১ · গল্প"}
            </p>
            <h1 className="mt-1 text-2xl font-black text-red-950 sm:text-3xl">
              {isEnglish
                ? "The Weather and Climate Story"
                : "আবহাওয়া ও জলবায়ুর গল্প"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-800">
              {isEnglish
                ? `Scene ${scene.sceneEn} / 3`
                : `দৃশ্য ${scene.scene} / ৩`}
            </p>
            <p className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-800">
              {isEnglish
                ? `Dialogue ${activeIndex + 1} / ${scene.dialogues.length}`
                : `সংলাপ ${activeIndex + 1} / ${scene.dialogues.length}`}
            </p>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white p-2 shadow-[0_14px_40px_rgba(127,29,29,0.10)] sm:rounded-3xl sm:p-4">
          <div className="relative isolate aspect-video overflow-hidden rounded-xl bg-slate-200 sm:rounded-2xl">
            <img
              src={scene.image}
              alt={
                isEnglish
                  ? `A scene from the King Krishnachandra, Gopal Bhar, and Minister story — chapter 1, scene ${scene.sceneEn}`
                  : `রাজা কৃষ্ণচন্দ্র, গোপাল ভাঁড় ও মন্ত্রীর গল্পের দৃশ্য ${scene.scene} — অধ্যায় ১`
              }
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              key={`${chapterIndex}-${activeIndex}`}
              className={`absolute ${currentBubbleTop} z-10 motion-safe:animate-[fadeSlideUp_.32s_ease_both] ${currentBubbleWidth} ${currentBubblePosition}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 60 58"
                className={`absolute ${bubbleTailTop[current.character]} z-0 -translate-x-1/2 ${currentTailSize} ${currentTailPosition}`}
              >
                <path
                  d={currentTailPath}
                  fill="white"
                  stroke="#111827"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </svg>
              <div
                style={{ borderRadius: "50%" }}
                className="relative z-10 flex min-h-28 items-center justify-center border-[2.5px] border-slate-900 bg-white py-5 text-center text-slate-950 shadow-[0_4px_10px_rgba(15,23,42,.14)] sm:min-h-32 sm:py-6"
              >
                <p
                  className={`${bubbleTextPosition[current.character]} w-full px-[12%] text-[clamp(12px,1.1vw,17px)] font-medium leading-[1.4] tracking-normal wrap-anywhere`}
                >
                  {isEnglish ? scene.dialoguesEn[activeIndex] : current.text}
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-4 flex items-center gap-1.5"
            aria-label={isEnglish ? "Story progress" : "গল্পের অগ্রগতি"}
          >
            {scene.dialogues.map((dialogue, index) => (
              <span
                key={`${chapterIndex}-${dialogue.speaker}-${index}`}
                className={`h-1.5 flex-1 rounded-full transition-colors ${index <= activeIndex ? "bg-red-600" : "bg-red-100"}`}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-slate-600 transition hover:bg-slate-100"
            >
              <RotateCcw size={17} aria-hidden="true" />
              {isEnglish ? "Start again" : "আবার শুরু"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={movePrevious}
                disabled={chapterIndex === 0 && activeIndex === 0}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-bold text-red-800 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={17} aria-hidden="true" />
                {isEnglish ? "Previous dialogue" : "আগের সংলাপ"}
              </button>
              <button
                type="button"
                onClick={moveNext}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 font-bold text-white shadow-md transition hover:bg-red-800"
              >
                {chapterIndex === chapterScenes.length - 1 &&
                activeIndex === scene.dialogues.length - 1
                  ? isEnglish
                    ? "Go to chapters"
                    : "সূচিপত্রে যান"
                  : isEnglish
                    ? "Next dialogue"
                    : "পরের সংলাপ"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
