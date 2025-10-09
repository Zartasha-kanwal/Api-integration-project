import { useQuery } from "@tanstack/react-query";
import { Github, Star, GitFork, Eye } from "lucide-react";
import { useStore } from "@/store/useStore";

interface GithubRepo {
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  html_url: string;
}

const GithubTrending = () => {
  const { setSelectedRepo } = useStore();

  const { data: repos, isLoading } = useQuery({
    queryKey: ['trending-repos'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=6'
      );
      const data = await response.json();
      return data.items as GithubRepo[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <Github className="inline-block mr-3" />
            Trending Repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-32 bg-muted/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 ">
      <div className="max-w-[80%] mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <Github className="inline-block mr-3" />
          Trending Repositories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos?.map((repo) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 hover:scale-105 transition-all cursor-pointer"
              onClick={() => setSelectedRepo(repo.name)}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{repo.owner.login}</h3>
                  <p className="text-sm text-muted-foreground truncate">{repo.name}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {repo.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent" />
                  {(repo.stargazers_count / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-primary" />
                  {(repo.forks_count / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  {(repo.watchers_count / 1000).toFixed(1)}k
                </span>
              </div>
              
              {repo.language && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                    {repo.language}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GithubTrending;
