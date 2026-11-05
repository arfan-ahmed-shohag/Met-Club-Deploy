import { Link } from "react-router";
import logo from "../../assets/images/white_logo.png";
import bgImage from "../../assets/images/bg-image.webp";
import Login from "../../components/banglaVersion/Login/Login";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import { getLocalizedPath, getStoredLocale } from "../../utils/language";

export default function Home() {
	useLocaleRouteSync("/login", "/en/login");
	const locale = getStoredLocale();

	return (
		<div
			className="relative min-h-screen"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center bottom",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center min-h-[calc(100vh-68px)] px-4 sm:px-8 md:px-16 py-6 gap-8">
				<div className="text-white w-full">
					<div className="grid grid-cols-1 lg:grid-cols-3 items-center w-full gap-8 lg:gap-10 xl:gap-12">
						<div className="relative flex justify-center">
							<div className="animate-float">
								<img src={logo} alt="MET CLUB LOGO" className="w-80" />
							</div>

							<div className="absolute top-2 sm:top-4 md:top-8 -right-2 sm:-right-4 md:-right-8 lg:-right-4 xl:-right-8 text-6xl animate-float-delayed">
								☀️
							</div>
							<div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-4 md:left-8 text-6xl animate-float">
								🌧️
							</div>
							<div className="absolute top-1/2 right-2 sm:right-4 md:right-6 text-6xl animate-float-delayed">
								☁️
							</div>
						</div>

						<div className="space-y-4 font-semibold max-w-full w-full lg:max-w-2xl justify-self-center">
							<p className="text-3xl md:text-6xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-center font-bold leading-tight">
								Met Club E-Learning Platform
							</p>
							<p className="text-center md:text-xl lg:text-[16px]">
								Let&apos;s learn weather through play
							</p>
							<Link to={getLocalizedPath("/", locale)} className="flex justify-center mt-6">
								<button className="px-6 py-3 cursor-pointer bg-white/85 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition">
									Learn about Met Club
								</button>
							</Link>
						</div>
						<div className="w-full max-w-md lg:w-105 justify-self-center">
							<Login />
						</div>
					</div>
				</div>
			</div>

			<footer className="relative z-10 text-white py-6 text-sm text-center drop-shadow-md">
				<a href="http://cdsr.com.bd" target="_blank" rel="noopener noreferrer">
					Developed by Centre for Data Science Research (CDSR)
				</a>
			</footer>
		</div>
	);
}
