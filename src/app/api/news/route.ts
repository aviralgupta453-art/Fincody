import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "finance";
  
  // Construct search query based on category
  let query = "finance";
  if (category.toLowerCase() === "markets") query = "stock market";
  else if (category.toLowerCase() === "stocks") query = "equities";
  else if (category.toLowerCase() === "economy") query = "macroeconomics inflation";
  else if (category.toLowerCase() === "policy") query = "federal reserve ECB central bank";
  else if (category.toLowerCase() === "technology") query = "AI semiconductor tech stocks";

  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=15`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Yahoo news: HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawNews = data.news || [];

    // Map raw Yahoo news to Fincody Live Schema
    const formattedNews = rawNews.map((n: any, idx: number) => {
      const title = n.title || "";
      const lowerTitle = title.toLowerCase();
      
      // Determine impact sentiment
      let impact: "Bullish" | "Bearish" | "Neutral" = "Neutral";
      if (lowerTitle.includes("gain") || lowerTitle.includes("rise") || lowerTitle.includes("higher") || lowerTitle.includes("surge") || lowerTitle.includes("beat") || lowerTitle.includes("growth") || lowerTitle.includes("rally")) {
        impact = "Bullish";
      } else if (lowerTitle.includes("drop") || lowerTitle.includes("fall") || lowerTitle.includes("lower") || lowerTitle.includes("slump") || lowerTitle.includes("plunge") || lowerTitle.includes("miss") || lowerTitle.includes("decline")) {
        impact = "Bearish";
      }

      // Determine severity
      let severity: "High Impact" | "Medium Impact" | "Low Impact" = "Medium Impact";
      if (lowerTitle.includes("fed") || lowerTitle.includes("inflation") || lowerTitle.includes("rates") || lowerTitle.includes("earnings") || lowerTitle.includes("gdp") || idx === 0) {
        severity = "High Impact";
      } else if (lowerTitle.includes("sec") || lowerTitle.includes("merger") || lowerTitle.includes("lawsuit")) {
        severity = "Low Impact";
      }

      // Format publish timestamp relatively
      let timestamp = "Just now";
      if (n.providerPublishTime) {
        const diffMs = Date.now() - (n.providerPublishTime * 1000);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        if (diffMins < 1) timestamp = "Just now";
        else if (diffMins < 60) timestamp = `${diffMins}m ago`;
        else if (diffHours < 24) timestamp = `${diffHours}h ago`;
        else timestamp = new Date(n.providerPublishTime * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      // Map related tickers or fallback to index assets
      const affected = (n.relatedTickers || []).slice(0, 3).map((tick: string) => {
        // Mock a reasonable daily price change
        const isUp = impact === "Bullish" || (impact === "Neutral" && Math.random() > 0.5);
        const delta = (Math.random() * 2 + 0.1) * (isUp ? 1 : -1);
        return {
          symbol: tick,
          name: tick.split(".")[0],
          change: parseFloat(delta.toFixed(2))
        };
      });

      if (affected.length === 0) {
        affected.push(
          { symbol: "^GSPC", name: "S&P 500", change: impact === "Bullish" ? 0.85 : impact === "Bearish" ? -0.92 : 0.05 },
          { symbol: "^IXIC", name: "NASDAQ", change: impact === "Bullish" ? 1.25 : impact === "Bearish" ? -1.45 : -0.12 }
        );
      }

      // Dynamically generate descriptive analysis blocks
      const firstTicker = affected[0]?.name || "Markets";
      const whyItMatters = `This development directly influences retail liquidity and active flows surrounding ${firstTicker} assets. Shifts in institutional volumes can trigger wider volatility spirals across index benchmarks.`;
      const whoIsAffected = `Short-term traders, passive index tracking funds, and local retail portfolios holding active positions in ${firstTicker}.`;
      const shortTerm = `Expect minor price adjustments and short-term volatility as the market absorbs the news. Watch support levels closely.`;
      const longTerm = `Structural long-term trends remain intact, but capital flows may reallocate toward defensive sectors depending on macroeconomic policies.`;
      const opportunities = `Accumulate quality index funds or large-cap assets during minor drawdowns.`;
      const risks = `Uncertainty surrounding upcoming interest rate revisions or supply-chain shocks.`;

      return {
        id: n.uuid || `news-${idx}-${Date.now()}`,
        country: lowerTitle.includes("india") ? "India" : lowerTitle.includes("china") ? "China" : lowerTitle.includes("europe") ? "Europe" : "Global",
        category: category.charAt(0).toUpperCase() + category.slice(1),
        headline: title,
        summary: title + ". Market observers note that this news will affect investor sentiment and short-term liquidity profiles across domestic exchanges.",
        source: n.publisher || "Yahoo Finance",
        timestamp,
        breaking: idx < 2 && impact !== "Neutral",
        impact,
        severity,
        confidence: 85 + Math.floor(Math.random() * 12),
        affected,
        whyItMatters,
        whoIsAffected,
        shortTerm,
        longTerm,
        opportunities,
        risks,
        url: n.link || "https://finance.yahoo.com"
      };
    });

    return NextResponse.json(formattedNews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load news" }, { status: 500 });
  }
}
