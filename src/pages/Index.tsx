import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GithubTrending from "@/components/GithubTrending";
import CryptoPrices from "@/components/CryptoPrices";
import StatsSection from "@/components/StatsSection";
import NasaSection from "@/components/NasaSection";
import SpaceXSection from "@/components/SpaceXSection";
import Footer from "@/components/Footer";
import ApiCrudSection from "@/components/ApiCrudSection";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div id="home">
        <Hero />
      </div>
      <div id="stats">
        <StatsSection />
      </div>
      <div id="github">
        <GithubTrending />
      </div>
      <div id="crypto">
        <CryptoPrices />
      </div>
      <div id="nasa">
        <NasaSection />
      </div>
      <div id="crud">
        <ApiCrudSection/>
        <Toaster/>
      </div>
      <div id="spacex">
        <SpaceXSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

