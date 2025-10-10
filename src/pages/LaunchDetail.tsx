import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Rocket,
  Calendar,
  MapPin,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Globe,
  Gauge,
  Ruler,
  Weight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpaceXLaunchDetail {
  id: string;
  name: string;
  date_utc: string;
  date_local: string;
  details: string | null;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    webcast: string | null;
    wikipedia: string | null;
    article: string | null;
    presskit: string | null;
    flickr: {
      original: string[];
    };
  };
  rocket: string;
  launchpad: string;
  success: boolean | null;
  upcoming: boolean;
  flight_number: number;
  cores: Array<{
    core: string;
    flight: number;
    landing_success: boolean | null;
    landing_type: string | null;
  }>;
  crew: Array<{
    crew: string;
    role: string;
  }>;
  payloads: string[];
}

interface Rocket {
  name: string;
  type: string;
  description: string;
  height: {
    meters: number;
  };
  diameter: {
    meters: number;
  };
  mass: {
    kg: number;
  };
}

interface Launchpad {
  name: string;
  full_name: string;
  locality: string;
  region: string;
  latitude: number;
  longitude: number;
}

const LaunchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: launch, isLoading } = useQuery({
    queryKey: ["spacex-launch", id],
    queryFn: async () => {
      const response = await fetch(
        `https://api.spacexdata.com/v5/launches/${id}`
      );
      return response.json() as Promise<SpaceXLaunchDetail>;
    },
  });

  const { data: rocket } = useQuery({
    queryKey: ["spacex-rocket", launch?.rocket],
    queryFn: async () => {
      const response = await fetch(
        `https://api.spacexdata.com/v4/rockets/${launch?.rocket}`
      );
      return response.json() as Promise<Rocket>;
    },
    enabled: !!launch?.rocket,
  });

  const { data: launchpad } = useQuery({
    queryKey: ["spacex-launchpad", launch?.launchpad],
    queryFn: async () => {
      const response = await fetch(
        `https://api.spacexdata.com/v4/launchpads/${launch?.launchpad}`
      );
      return response.json() as Promise<Launchpad>;
    },
    enabled: !!launch?.launchpad,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 animate-pulse">
            <div className="h-8 bg-white/10 rounded-lg mb-6 w-48" />
            <div className="h-96 bg-white/5 rounded-2xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-white/5 rounded-2xl" />
                <div className="h-48 bg-white/5 rounded-2xl" />
              </div>
              <div className="space-y-6">
                <div className="h-40 bg-white/5 rounded-2xl" />
                <div className="h-40 bg-white/5 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md">
          <div className="inline-flex p-6 bg-white/5 rounded-2xl mb-6">
            <Rocket className="w-16 h-16 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Launch Not Found</h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-8">
            The requested launch data could not be loaded.
          </p>
          <Button onClick={() => navigate("/")} variant="default">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDate(launch.date_utc);

  return (
    <div className="min-h-screen pb-16">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/10 via-transparent to-transparent h-[500px]" />

        <div className="relative lg:max-w-[80%] mx-auto px-4 pt-16">
          <Link
            to="/#spacex"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="glass-card p-8 mb-8 animate-fade-in my-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0">
                {launch.links.patch.large ? (
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 flex items-center justify-center border border-white/10">
                    <img
                      src={launch.links.patch.large}
                      alt={launch.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20 flex items-center justify-center border border-white/10">
                    <Rocket className="w-24 h-24 text-[hsl(var(--primary))]" />
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-6">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-gradient mb-4 leading-tight">
                    {launch.name}
                  </h1>

                  <div className="flex flex-wrap gap-3">
                    {launch.upcoming ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-sm font-bold border border-[hsl(var(--accent))]/30">
                        <Clock className="w-4 h-4" />
                        Upcoming Launch
                      </span>
                    ) : launch.success ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-400/30">
                        <CheckCircle className="w-4 h-4" />
                        Successful
                      </span>
                    ) : launch.success === false ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-bold border border-red-400/30">
                        <XCircle className="w-4 h-4" />
                        Failed
                      </span>
                    ) : null}

                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] text-sm font-bold border border-[hsl(var(--primary))]/30">
                      <Rocket className="w-4 h-4" />
                      Flight #{launch.flight_number}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-[hsl(var(--primary))]/20 rounded-xl">
                      <Calendar className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                        Launch Date
                      </p>
                      <p className="font-bold text-lg">{date}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {time}
                      </p>
                    </div>
                  </div>

                  {launchpad && (
                    <div className="glass-card p-5 flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--accent))]/20 rounded-xl">
                        <MapPin className="w-6 h-6 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                          Launch Site
                        </p>
                        <p className="font-bold text-lg">{launchpad.name}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {launchpad.locality}, {launchpad.region}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {launch.links.webcast && (
                    <Button variant="default" asChild>
                      <a
                        href={launch.links.webcast}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Watch Webcast
                      </a>
                    </Button>
                  )}
                  {launch.links.wikipedia && (
                    <Button variant="outline" asChild>
                      <a
                        href={launch.links.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Wikipedia
                      </a>
                    </Button>
                  )}
                  {launch.links.article && (
                    <Button variant="outline" asChild>
                      <a
                        href={launch.links.article}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Article
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {launch.details && (
                <div className="glass-card p-8 animate-slide-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[hsl(var(--primary))]/20 rounded-lg">
                      <Rocket className="w-5 h-5 text-[hsl(var(--primary))]" />
                    </div>
                    <h2 className="text-2xl font-bold">Mission Overview</h2>
                  </div>
                  <p className="text-[hsl(var(--muted-foreground))] leading-relaxed text-lg">
                    {launch.details}
                  </p>
                </div>
              )}

              {rocket && (
                <div
                  className="glass-card p-8 animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[hsl(var(--accent))]/20 rounded-lg">
                      <Gauge className="w-5 h-5 text-[hsl(var(--accent))]" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      Rocket Specifications
                    </h2>
                  </div>

                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 rounded-2xl p-6 mb-6 border border-white/10">
                    <h3 className="text-2xl font-bold text-[hsl(var(--primary))] mb-2">
                      {rocket.name}
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 uppercase tracking-wide font-semibold">
                      {rocket.type}
                    </p>
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {rocket.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
                      <Ruler className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-3" />
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wide font-semibold">
                        Height
                      </p>
                      <p className="text-3xl font-bold text-gradient">
                        {rocket.height.meters}
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                        meters
                      </p>
                    </div>
                    <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
                      <Gauge className="w-8 h-8 text-[hsl(var(--accent))] mx-auto mb-3" />
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wide font-semibold">
                        Diameter
                      </p>
                      <p className="text-3xl font-bold text-gradient">
                        {rocket.diameter.meters}
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                        meters
                      </p>
                    </div>
                    <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
                      <Weight className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-3" />
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wide font-semibold">
                        Mass
                      </p>
                      <p className="text-3xl font-bold text-gradient">
                        {(rocket.mass.kg / 1000).toFixed(1)}
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                        tonnes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {launch.links.flickr.original.length > 0 && (
                <div
                  className="glass-card p-8 animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <h2 className="text-2xl font-bold mb-6">Mission Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {launch.links.flickr.original.map((image, index) => (
                      <div
                        key={index}
                        className="relative group overflow-hidden rounded-xl aspect-video border border-white/10"
                      >
                        <img
                          src={image}
                          alt={`${launch.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                          <span className="text-sm font-bold">
                            Image {index + 1} of{" "}
                            {launch.links.flickr.original.length}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {launch.cores.length > 0 && (
                <div
                  className="glass-card p-6 animate-slide-up"
                  style={{ animationDelay: "0.15s" }}
                >
                  <h2 className="text-xl font-bold mb-5">Core Details</h2>
                  <div className="space-y-3">
                    {launch.cores.map((core, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-sm">
                            Core {index + 1}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] text-xs font-bold">
                            Flight #{core.flight}
                          </span>
                        </div>
                        {core.landing_type && (
                          <div className="flex items-center gap-3 bg-[hsl(var(--background))]/50 rounded-lg p-3">
                            {core.landing_success ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            )}
                            <div className="flex-grow min-w-0">
                              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                                Landing
                              </p>
                              <p className="text-sm font-semibold truncate">
                                {core.landing_type}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {launchpad && (
                <div
                  className="glass-card p-6 animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-[hsl(var(--accent))]/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-[hsl(var(--accent))]" />
                    </div>
                    <h2 className="text-xl font-bold">Launch Facility</h2>
                  </div>
                  <div className="bg-gradient-to-br from-[hsl(var(--accent))]/10 to-transparent rounded-xl p-5 mb-4 border border-[hsl(var(--accent))]/20">
                    <h3 className="font-bold text-lg text-[hsl(var(--accent))] mb-2">
                      {launchpad.full_name}
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {launchpad.locality}, {launchpad.region}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wide font-semibold">
                      GPS Coordinates
                    </p>
                    <p className="font-mono text-sm font-bold">
                      {launchpad.latitude.toFixed(4)}°N
                      <br />
                      {launchpad.longitude.toFixed(4)}°W
                    </p>
                  </div>
                </div>
              )}

              {launch.crew.length > 0 && (
                <div
                  className="glass-card p-6 animate-slide-up"
                  style={{ animationDelay: "0.25s" }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-[hsl(var(--primary))]/20 rounded-lg">
                      <Users className="w-5 h-5 text-[hsl(var(--primary))]" />
                    </div>
                    <h2 className="text-xl font-bold">Crew Members</h2>
                  </div>
                  <div className="space-y-3">
                    {launch.crew.map((member, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <p className="font-bold text-[hsl(var(--primary))]">
                          {member.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchDetail;
