import { useQuery } from "@tanstack/react-query";
import { Rocket, Calendar, MapPin, ExternalLink } from "lucide-react";

interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  details: string | null;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    webcast: string | null;
    wikipedia: string | null;
  };
  rocket: string;
  launchpad: string;
  success: boolean | null;
  upcoming: boolean;
}

const SpaceXSection = () => {
  const { data: launches, isLoading } = useQuery({
    queryKey: ["spacex-launches"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.spacexdata.com/v5/launches/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: { upcoming: true },
            options: {
              limit: 6,
              sort: { date_utc: "asc" },
            },
          }),
        }
      );
      const data = await response.json();
      return data.docs as SpaceXLaunch[];
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <section className="py-24 px-4 ">
      <div className="max-w-[80%] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-primary" />
            <h2 className="text-5xl font-bold text-gradient">
              SpaceX Launches
            </h2>
          </div>
          <p className="text-muted-foreground text-xl">
            Upcoming missions to space and beyond
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-16 h-16 bg-muted/20 rounded-full mb-4 mx-auto" />
                <div className="h-6 bg-muted/20 rounded mb-3" />
                <div className="h-4 bg-muted/20 rounded mb-2" />
                <div className="h-4 bg-muted/20 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : launches && launches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
            {launches.map((launch, index) => {
              const { date, time } = formatDate(launch.date_utc);

              return (
                <div
                  key={launch.id}
                  className="glass-card p-6 hover:scale-105 transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Mission Patch */}
                  <div className="flex items-center justify-center mb-6">
                    {launch.links.patch.small ? (
                      <img
                        src={launch.links.patch.small}
                        alt={launch.name}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                        <Rocket className="w-10 h-10 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Mission Name */}
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {launch.name}
                  </h3>

                  {/* Launch Date & Time */}
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm">
                      {date} at {time}
                    </span>
                  </div>

                  {/* Details */}
                  {launch.details && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {launch.details}
                    </p>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      Upcoming
                    </span>

                    {launch.links.webcast && (
                      <a
                        href={launch.links.webcast}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="Watch webcast"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No upcoming launches scheduled at this time.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpaceXSection;
