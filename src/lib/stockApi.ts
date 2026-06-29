export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  logo?: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: "Open" | "Closed";
  marketStateRaw: string;
  lastUpdated: string;
  sparkline: number[]; // 1D price history array
}

export interface ChartDataPoint {
  time: string;
  price: number;
}

// Yahoo Finance Implementation
class YahooFinanceProvider {
  private getLogoUrl(symbol: string, name: string): string {
    // Map common tickers to company domains for Clearbit logos
    const cleanSym = symbol.toUpperCase().split(".")[0];
    const mappings: Record<string, string> = {
      AAPL: "apple.com",
      MSFT: "microsoft.com",
      NVDA: "nvidia.com",
      TSLA: "tesla.com",
      AMZN: "amazon.com",
      GOOGL: "google.com",
      GOOG: "google.com",
      META: "meta.com",
      NFLX: "netflix.com",
      RELIANCE: "ril.com",
      TCS: "tcs.com",
      INFY: "infosys.com",
      HDFCBANK: "hdfcbank.com",
      ICICIBANK: "icicibank.com",
      TATAMOTORS: "tatamotors.com",
      WIPRO: "wipro.com",
      SBIN: "sbi.co.in"
    };

    if (mappings[cleanSym]) {
      return `https://logo.clearbit.com/${mappings[cleanSym]}`;
    }

    // Try parsing name to construct a guess domain
    const cleanName = name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanName.length > 2) {
      return `https://logo.clearbit.com/${cleanName}.com`;
    }

    return "";
  }

  async search(query: string): Promise<StockSearchResult[]> {
    if (!query || query.trim().length === 0) return [];
    
    try {
      const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=0`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error("Search request failed");
      const json = await res.json();
      
      const quotes = json.quotes || [];
      return quotes
        .filter((q: any) => q.quoteType === "EQUITY" || q.quoteType === "ETF")
        .map((q: any) => {
          const name = q.longname || q.shortname || q.symbol;
          return {
            symbol: q.symbol,
            name,
            exchange: q.exchange || "Stock Market",
            type: q.quoteType,
            logo: this.getLogoUrl(q.symbol, name)
          };
        })
        .slice(0, 8);
    } catch (e) {
      console.error("YahooFinance search error:", e);
      return [];
    }
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      // Fetch 1-day chart with 15-minute intervals to get price + sparkline data
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=15m&range=1d`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`Quote fetch failed for ${symbol}`);
      const json = await res.json();

      const result = json.chart?.result?.[0];
      if (!result) return null;

      const meta = result.meta;
      const price = meta.regularMarketPrice || 0;
      const prevClose = meta.previousClose || price;
      const change = price - prevClose;
      const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
      const currency = meta.currency || "USD";
      const marketStateRaw = meta.marketState || "CLOSED";
      const isOpen = marketStateRaw === "REGULAR" || marketStateRaw === "PRE" || marketStateRaw === "POST";
      const marketState = isOpen ? "Open" : "Closed";

      // Parse sparkline prices
      const closePrices: number[] = result.indicators?.quote?.[0]?.close || [];
      const sparkline = closePrices.filter((p): p is number => p !== null && p !== undefined);

      // Last updated date
      const lastUpdatedEpoch = meta.regularMarketTime * 1000 || Date.now();
      const lastUpdated = new Date(lastUpdatedEpoch).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      return {
        symbol,
        price,
        change,
        changePercent,
        currency,
        marketState,
        marketStateRaw,
        lastUpdated,
        sparkline: sparkline.length > 0 ? sparkline : [price]
      };
    } catch (e) {
      console.error(`YahooFinance quote error for ${symbol}:`, e);
      return null;
    }
  }

  async getHistory(symbol: string, range: string): Promise<ChartDataPoint[]> {
    let interval = "1d";
    let apiRange = "1mo";

    switch (range.toLowerCase()) {
      case "1d":
        interval = "2m";
        apiRange = "1d";
        break;
      case "1w":
        interval = "15m";
        apiRange = "5d";
        break;
      case "1m":
        interval = "1d";
        apiRange = "1mo";
        break;
      case "6m":
        interval = "1d";
        apiRange = "6mo";
        break;
      case "1y":
        interval = "1d";
        apiRange = "1y";
        break;
      case "max":
        interval = "1wk";
        apiRange = "max";
        break;
      default:
        interval = "1d";
        apiRange = "1mo";
    }

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${apiRange}`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`History fetch failed for ${symbol}`);
      const json = await res.json();

      const result = json.chart?.result?.[0];
      if (!result) return [];

      const timestamps: number[] = result.timestamp || [];
      const closePrices: number[] = result.indicators?.quote?.[0]?.close || [];

      return timestamps.map((epoch, idx) => {
        const date = new Date(epoch * 1000);
        let timeLabel = "";
        
        if (range === "1d") {
          timeLabel = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        } else if (range === "1w" || range === "1m") {
          timeLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } else {
          timeLabel = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        }

        return {
          time: timeLabel,
          price: parseFloat(closePrices[idx]?.toFixed(2)) || 0
        };
      }).filter(pt => pt.price > 0);
    } catch (e) {
      console.error(`YahooFinance history error for ${symbol} range ${range}:`, e);
      return [];
    }
  }
}

// Instantiate active financial provider
const activeProvider = new YahooFinanceProvider();

export const stockMarketApi = {
  searchStocks: (query: string) => activeProvider.search(query),
  getStockQuote: (symbol: string) => activeProvider.getQuote(symbol),
  getStockHistory: (symbol: string, range: string) => activeProvider.getHistory(symbol, range)
};
