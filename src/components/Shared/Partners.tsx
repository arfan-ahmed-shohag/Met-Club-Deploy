import partner1 from "../../assets/partners/partner1.png";
import partner2 from "../../assets/partners/partner2.png";
import partner3 from "../../assets/partners/partner3.png";
import partner4 from "../../assets/partners/partner4.png";
import partner5 from "../../assets/partners/partner5.jpg";
import partner6 from "../../assets/partners/partner6.png";
import partner7 from "../../assets/partners/bangladesh-govt-logo-png_seeklogo-196441.png";
import partner8 from "../../assets/partners/logo_bmd.png";

export default function Partners({ bg }: { bg: string }) {
    const partnerLogos = [
        { src: partner1, alt: "Save The Children Logo" },
        { src: partner2, alt: "RIMES Logo" },
        { src: partner7, alt: "Bangladesh Government Logo" },
        { src: partner8, alt: "BMD Logo" },
        { src: partner3, alt: "JAGONARI Logo" },
        { src: partner4, alt: "SKS Logo" },
        { src: partner5, alt: "YPSA Logo" },
        { src: partner6, alt: "German Humanitarian Assistance Logo" },
    ];

    return (
        <section className={`w-full rounded-2xl border border-white/30 p-3 md:mt-6 md:p-4 lg:mt-0 ${bg}`}>
            <div className="grid w-full grid-cols-4 items-center gap-x-3 gap-y-4 sm:gap-x-5 lg:grid-cols-8 lg:gap-4">
                {partnerLogos.map((logo) => (
                    <div key={logo.alt} className="flex h-10 min-w-0 items-center justify-center sm:h-12">
                        <img
                            className="max-h-full w-full object-contain"
                            src={logo.src}
                            alt={logo.alt}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
