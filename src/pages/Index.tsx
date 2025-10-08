import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GithubTrending from "@/components/GithubTrending";
import CryptoPrices from "@/components/CryptoPrices";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

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
      <Footer />
    </div>
  );
};

export default Index;
