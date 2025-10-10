import { useQuery } from "@tanstack/react-query";
import { Rocket, Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface SpaceArticle {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  news_site: string;
  published_at: string;
  url: string;
}

const NasaNews = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["space-news-all"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.spaceflightnewsapi.net/v4/articles/?limit=12"
      );
      if (!res.ok) throw new Error("Failed to fetch space news");
      const json = await res.json();
      return json.results as SpaceArticle[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[90%] mx-auto px-4 py-12">
        <Link
          to="/#nasa"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-primary" />
            <h1 className="lg:text-5xl text-2xl font-bold">Space News</h1>
          </div>
          <p className="text-muted-foreground lg:text-xl text-sm">
            Explore the latest headlines from the cosmos
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 animate-pulse">
                <div className="aspect-video bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-3 w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
            {data?.map((article) => (
              <article
                key={article.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.published_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <p className="text-xs text-muted-foreground italic mb-4">
                    Source: {article.news_site}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
                  >
                    Read Full Article
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NasaNews;
