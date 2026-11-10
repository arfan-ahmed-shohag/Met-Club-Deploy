import logo from "../../../assets/images/logo_original.png";
import Partners from "../../../components/Shared/Partners";

export default function AboutFooter({isEnglish}:{isEnglish:boolean}){
 const t=(bangla:string,english:string)=>isEnglish?english:bangla;
 return (
<footer className="relative z-10 border-t border-red-900 bg-red-950 py-10 text-white md:py-15 lg:py-20">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-x-4 lg:flex-row">
                        <img src={logo} alt="MET CLUB LOGO" className="h-32 w-32" />
                        <div>
                            <h3 className="text-2xl font-black text-red-500" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{t("মেট ক্লাব", "Met Club")}</h3>
                            <p className="mt-1 text-sm font-semibold text-gray-300">{t("আবহাওয়া চক্র", "Weather Cycle")}</p>
                            <p className="my-4 font-semibold italic text-red-200">{t('"তরুণ মন, শক্তিশালী সতর্কতা"', '"Young Minds, Stronger Warnings"')}</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Partners bg="bg-white" />
                    </div>
                </div>
            </footer>
 );
}
