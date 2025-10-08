import { useQuery } from "@tanstack/react-query";
import { Activity, Zap, Globe, Users } from "lucide-react";
import { useEffect, useState } from "react";

const StatsSection = () => {
  const [realtimeCount, setRealtimeCount] = useState(0);

  const { data: githubStats } = useQuery({
    queryKey: ['github-stats'],
    queryFn: async () => {
      const response = await fetch('https://api.github.com/search/repositories?q=stars:>1');
      const data = await response.json();
      return {
        totalRepos: data.total_count,
      };
    },
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeCount((prev) => prev + Math.floor(Math.random() * 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Activity,
      label: "API Requests",
      value: realtimeCount.toLocaleString(),
      suffix: "+",
      color: "text-accent",
    },
    {
      icon: Zap,
      label: "Live Updates",
      value: "Real-time",
      suffix: "",
      color: "text-primary",
    },
    {
      icon: Globe,
      label: "GitHub Repos",
      value: githubStats ? (githubStats.totalRepos / 1e6).toFixed(1) : "0",
      suffix: "M+",
      color: "text-accent",
    },
    {
      icon: Users,
      label: "Data Sources",
      value: "5",
      suffix: "+",
      color: "text-primary",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-[80%] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powered by Open Source APIs</h2>
          <p className="text-xl text-muted-foreground">
            Connecting to multiple data sources for comprehensive insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-card p-6 text-center hover:scale-105 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4 ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {stat.value}
                  <span className={stat.color}>{stat.suffix}</span>
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
