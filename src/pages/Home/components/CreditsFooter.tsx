export default function CreditsFooter({isEnglish}:{isEnglish:boolean}){
 const t=(bangla:string,english:string)=>isEnglish?english:bangla;
 return (
<footer className="relative z-20 bg-red-950 py-4 text-center text-sm text-white"><a href="http://cdsr.com.bd" target="_blank" rel="noopener noreferrer">{t("পরিকল্পনা ও বাস্তবায়ন: Centre for Data Science Research (CDSR)", "Developed by Centre for Data Science Research (CDSR)")}</a></footer>
 );
}
