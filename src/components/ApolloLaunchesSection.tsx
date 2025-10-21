import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";
import { Globe } from "lucide-react";
import Flag from "react-world-flags";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache: new InMemoryCache(),
});

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
      continent {
        name
      }
    }
  }
`;

const OrbitContent: React.FC = () => {
  const { data, loading, error } = useQuery(GET_COUNTRIES);

  if (loading)
    return (
      <section className="py-32 bg-gradient-to-b from-indigo-950 to-black text-center text-white">
        <p className="animate-pulse text-lg">🪐 Initializing data orbit...</p>
      </section>
    );

  if (error)
    return (
      <section className="py-32 bg-black text-center text-red-400">
        Failed to load countries: {error.message}
      </section>
    );

  const orbitCountries = data.countries.slice(0, 7);

  return (
    <section className="relative py-40 px-12  overflow-hidden text-white">
      <div className="text-center mb-16 relative z-10">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-indigo-400 animate-spin-slow" />
          <h2 className="md:text-4xl text-2xl font-bold">Data Orbit</h2>
        </div>
        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
          Every flag in motion is a story from a different corner of Earth —
          connected through data, orbiting in harmony within this digital
          universe.
        </p>
      </div>

      {/* Central planet */}
      <div className="relative mx-auto w-[280px] h-[280px] flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border border-indigo-400/20 animate-spin-slower" />
        <div className="absolute w-[70%] h-[70%] rounded-full border border-indigo-400/30 animate-spin-slow" />
        <div className="absolute w-[40%] h-[40%] rounded-full border border-indigo-400/40 animate-spin" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] z-10">
          <span className="text-3xl font-bold">🌐</span>
        </div>

        {/* countries */}
        {orbitCountries.map((country: any, i: number) => {
          const angle = (i / orbitCountries.length) * 2 * Math.PI;
          const radius = 130;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={country.code}
              className="absolute text-center transition-transform duration-500 hover:scale-125"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <Flag code={country.code} className="w-8 h-6 mx-auto mb-1" />
              <p className="text-sm font-medium">{country.name}</p>
              <p className="text-xs text-gray-400">{country.continent?.name}</p>
            </div>
          );
        })}
      </div>

      {/* Background*/}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${
                2 + Math.random() * 3
              }s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

const ApolloOrbitSection: React.FC = () => (
  <ApolloProvider client={client}>
    <OrbitContent />
  </ApolloProvider>
);

export default ApolloOrbitSection;
