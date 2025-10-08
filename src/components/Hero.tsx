import { Github, TrendingUp, Database } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Real-Time Data
            <br />
            <span className="text-gradient">At Your Fingertips</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Experience the power of live API integrations. Track GitHub trends, cryptocurrency prices, and more in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mb-16 animate-slide-up">
          <button className="hero-button">
            Explore Live Data
          </button>
          <button className="glass-card px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform">
            View Documentation
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
            <p className="text-muted-foreground">Track trending repositories and developer activity in real-time.</p>
          </div>

          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Crypto Markets</h3>
            <p className="text-muted-foreground">Monitor cryptocurrency prices and market trends instantly.</p>
          </div>

          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Analytics</h3>
            <p className="text-muted-foreground">Powerful data visualization and real-time statistics.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
