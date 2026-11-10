export type HomeVideo = { id: number; tutorialNumber: number; name: string; title: string; thumbnailImage: string; videoLink: string };

export type Chapter = {
    id: number;
    title: string;
    image: string;
    borderColor?: string;
};

export const chapterDescriptions: Record<number, { bn: string; en: string }> = {
    1: { bn: "আবহাওয়া ও জলবায়ুর পার্থক্য এবং আমাদের চারপাশের পরিবর্তন চিনে নাও।", en: "Understand weather, climate, and the changes we see around us." },
    2: { bn: "পূর্বাভাস কেন বদলাতে পারে এবং অনিশ্চয়তার মাঝেও কীভাবে প্রস্তুত থাকতে হয় জানো।", en: "Learn why forecasts can change and how to prepare when outcomes are uncertain." },
    3: { bn: "বাষ্পীভবন থেকে বৃষ্টিপানির চক্র কীভাবে কাজ করে আবিষ্কার করো।", en: "Discover how water moves through evaporation, clouds, and rain." },
    4: { bn: "নদী, পানির প্রবাহ আর তোমার এলাকার সঙ্গে তাদের সম্পর্ক বুঝে নাও।", en: "Explore rivers, water flow, and how they shape your local area." },
    5: { bn: "বন্যার কারণ, আগাম সংকেত এবং নিরাপদ থাকার উপায় শিখে নাও।", en: "Learn what causes floods, how to spot warnings, and how to stay safe." },
    6: { bn: "স্কুল দুর্যোগ ব্যবস্থাপনা কমিটি কীভাবে সবাইকে প্রস্তুত রাখে জানো।", en: "See how a school disaster management committee helps everyone prepare." },
    7: { bn: "স্কুলের ঝুঁকি চিহ্নিত করে নিরাপদ করার উপায় খুঁজে বের করো।", en: "Identify hazards at school and find practical ways to make it safer." },
    8: { bn: "স্থানীয় অভিজ্ঞতা ও ঐতিহ্যবাহী জ্ঞান থেকে দুর্যোগ মোকাবিলা শিখো।", en: "Learn how local experience and traditional knowledge help communities." },
    9: { bn: "ঘূর্ণিঝড়ের সংকেত বুঝে আগে থেকেই নিরাপদ হওয়ার প্রস্তুতি নাও।", en: "Understand cyclone warnings and get ready to move to safety." },
    10: { bn: "জরুরি সময়ে দরকারি জিনিস নিয়ে নিজের Go-Bag তৈরি করো।", en: "Build a Go-Bag with the essentials you may need in an emergency." },
};

export const galleryPhotos = [
    { src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80", alt: "Students learning together" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80", alt: "A classroom learning activity" },
    { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80", alt: "Students at a school event" },
    { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80", alt: "Students working in a group" },
    { src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80", alt: "Students sharing ideas" },
    { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80", alt: "A group learning session" },
    { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80", alt: "A community workshop" },
    { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80", alt: "A team sharing knowledge" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80", alt: "Students learning in a classroom" },
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80", alt: "A student studying" },
];
