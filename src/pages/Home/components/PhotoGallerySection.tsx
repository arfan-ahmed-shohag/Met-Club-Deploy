import { galleryPhotos } from "./homeData";

export default function PhotoGallery({ isEnglish }: { isEnglish: boolean }) {
    const renderRow = (reverse = false) => (
        <div className={`gallery-marquee-track flex w-max ${reverse ? "gallery-marquee-reverse" : ""}`}>
            {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                    {galleryPhotos.map((photo, index) => (
                        <div key={`${copy}-${photo.src}`} className="group relative h-[160px] w-[255px] shrink-0 overflow-hidden rounded-xl border border-red-100 shadow-sm md:h-[360px] md:w-[560px]">
                            <img src={photo.src} alt={copy === 0 ? (isEnglish ? photo.alt : `শেখার মুহূর্ত ${index + 1}`) : ""} loading="lazy" draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/25 via-transparent to-transparent opacity-60" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <section className="overflow-hidden bg-red-50/60 py-[60px] lg:py-[80px]" aria-labelledby="photo-gallery-title">
            <div className="mb-8 px-4 text-center sm:mb-10">
                <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-600">{isEnglish ? "MET CLUB MOMENTS" : "মেট ক্লাবের মুহূর্ত"}</p>
                <h2 id="photo-gallery-title" className="text-[36px] font-black text-red-950">{isEnglish ? "Learning, exploring, growing" : "শিখি, দেখি, একসাথে এগিয়ে যাই"}</h2>
                <p className="mx-auto mt-2 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">{isEnglish ? "A glimpse of the curiosity, teamwork, and discovery that make learning meaningful." : "কৌতূহল, দলগত কাজ আর নতুন কিছু আবিষ্কারের মধ্য দিয়ে শেখার কিছু মুহূর্ত।"}</p>
            </div>
            <div className="gallery-marquee space-y-4 md:space-y-5" aria-label={isEnglish ? "MET Club photo gallery" : "মেট ক্লাবের ফটো গ্যালারি"}>
                {renderRow()}
                {renderRow(true)}
            </div>
        </section>
    );
}
