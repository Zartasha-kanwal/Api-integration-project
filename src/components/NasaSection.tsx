import { useQuery } from "@tanstack/react-query";
import { Rocket, Calendar, ExternalLink } from "lucide-react";
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

const NasaSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["space-news"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.spaceflightnewsapi.net/v4/articles/?limit=1"
      );
      if (!res.ok) throw new Error("Failed to fetch space news");
      const json = await res.json();
      return json.results[0] as SpaceArticle;
    },
  });

  const article = data;

  return (
    <section className="py-28 px-4">
      <div className="max-w-[80%] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-primary" />
            <h2 className="md:text-4xl text-2xl font-bold">Space News</h2>
          </div>
          <p className="text-muted-foreground lg:text-xl">
            Latest headlines from the cosmos
          </p>
        </div>

        {isLoading ? (
          <div className="border rounded-lg p-8 animate-pulse">
            <div className="aspect-video bg-muted rounded-xl mb-6" />
            <div className="h-8 bg-muted rounded-lg mb-4 w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        ) : article ? (
          <Link to="/space-news">
            <div className="border rounded-lg overflow-hidden animate-fade-in hover:shadow-lg transition-all cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square md:aspect-auto overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
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

                    <h3 className="md:text-3xl text-2xl font-bold mb-4">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                      {article.summary}
                    </p>

                    <p className="text-sm text-muted-foreground italic">
                      Source: {article.news_site}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all w-fit">
                    View All Articles
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
};

export default NasaSection;
