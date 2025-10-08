import { Github, Twitter, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">DataSync</h3>
            <p className="text-muted-foreground">
              Real-time API integrations powered by open source technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">APIs Used</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>GitHub API</li>
              <li>CoinGecko API</li>
              <li>Public Data Sources</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tech Stack</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>React + TypeScript</li>
              <li>TanStack Query</li>
              <li>Zustand</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-muted-foreground mb-4 md:mb-0">
            © 2024 DataSync. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
