import Hero from './components/banglaVersion/Home/Hero'
import bgImage from './assets/images/bg-image.webp'
import { useLocaleRouteSync } from './hooks/useLocaleRouteSync'

function App() {
  useLocaleRouteSync("/login", "/en/login")


  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center min-h-[calc(100vh-68px)] px-4 sm:px-8 md:px-16 py-6 gap-8">
        <Hero />
      </div>

      <footer className="relative z-10 text-white py-6 text-sm text-center drop-shadow-md">
        <a href="http://cdsr.com.bd" target="_blank" rel="noopener noreferrer">
          Developed by Centre for Data Science Research (CDSR)
        </a>
      </footer>
    </div>
  )
}

export default App
