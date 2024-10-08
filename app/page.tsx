import About from "./components/About";
import FAQSection from "./components/FAQ";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { GlobeDemo } from "./components/GithubGlobal";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import { TimelineDemo } from "./components/Roadmap";


export default function Home() {
  return(
  <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] dark">
        <div className="relative w-full flex items-center justify-center dark">
          <Navbar />
        </div>
       <HeroSection />
       <GlobeDemo/>
       <About />
       <Features />
       <TimelineDemo />
       <FAQSection />
       <Footer />
  </main>
  );
}
