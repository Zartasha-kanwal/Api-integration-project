import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  links: {
    patch: {
      small: string | null;
    };
  };
  success: boolean | null;
  upcoming: boolean;
  flight_number: number;
}

const SpaceXSection = () => {
  const navigate = useNavigate();

  const { data: launches, isLoading } = useQuery({
    queryKey: ["spacex-launches"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.spacexdata.com/v5/launches?limit=9" 
      );
      return response.json() as Promise<SpaceXLaunch[]>;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-16 bg-white/5 rounded-2xl mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-32 bg-white/5 rounded-xl mb-4" />
                <div className="h-6 bg-white/5 rounded mb-3" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div  className="min-h-screen py-32 px-4">
      <div className="max-w-[80%] mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="md:text-4xl text-2xl font-bold text-gradient mb-4">
            SpaceX Launches
          </h1>
          <p className="lg:text-xl text-[hsl(var(--muted-foreground))]">
            Explore SpaceX mission data powered by the SpaceX API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {launches?.slice(0, 9).map(
            (
              launch,
              index 
            ) => (
              <div
                key={launch.id}
                className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/launch/${launch.id}`)}
              >
                <div className="flex items-start gap-4 mb-4">
                  {launch.links.patch.small ? (
                    <div className="w-20 h-20 rounded-xl bg-white/5 p-3 flex-shrink-0 border border-white/10">
                      <img
                        src={launch.links.patch.small}
                        alt={launch.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20 flex items-center justify-center border border-white/10">
                      <Rocket className="w-10 h-10 text-[hsl(var(--primary))]" />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                        {launch.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(launch.date_utc)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {launch.upcoming ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-bold border border-[hsl(var(--accent))]/30">
                          <Clock className="w-3 h-3" />
                          Upcoming
                        </span>
                      ) : launch.success ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-400/30">
                          <CheckCircle className="w-3 h-3" />
                          Success
                        </span>
                      ) : launch.success === false ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-400/30">
                          <XCircle className="w-3 h-3" />
                          Failed
                        </span>
                      ) : null}

                      <span className="px-3 py-1 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] text-xs font-bold border border-[hsl(var(--primary))]/30">
                        #{launch.flight_number}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-white/10"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceXSection;
