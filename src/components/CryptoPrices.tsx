import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

const CryptoPrices = () => {
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false'
      );
      return response.json() as Promise<CryptoData[]>;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="md:text-4xl text-2xl font-bold mb-12 text-center">
            <DollarSign className="inline-block mr-3" />
            Cryptocurrency Markets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-24 bg-muted/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 px-4 ">
      <div className="max-w-[80%] mx-auto">
        <h2 className="md:text-4xl text-2xl font-bold mb-12 text-center">
          <DollarSign className="inline-block mr-3" />
          Cryptocurrency Markets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cryptos?.map((crypto) => {
            const isPositive = crypto.price_change_percentage_24h > 0;
            return (
              <div key={crypto.id} className="glass-card p-6 hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{crypto.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    ${crypto.current_price.toLocaleString()}
                  </div>
                  
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    MCap: ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CryptoPrices;
