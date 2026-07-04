import { NextRequest, NextResponse } from "next/server";


function generateNewsSummary(title: string, impact: string, affected: any[]) {
  const lowerTitle = title.toLowerCase();
  const tickerStr = affected.map((a: any) => a.name).join(", ") || "market indices";

  let baseDesc = "";
  if (lowerTitle.includes("inflation") || lowerTitle.includes("cpi") || lowerTitle.includes("retail price")) {
    baseDesc = "macroeconomic metrics show shift in price indexes.";
  } else if (lowerTitle.includes("fed") || lowerTitle.includes("rate") || lowerTitle.includes("interest") || lowerTitle.includes("monetary")) {
    baseDesc = "monetary guidelines prompt adjustments in borrowing yields.";
  } else if (lowerTitle.includes("ipo") || lowerTitle.includes("listing") || lowerTitle.includes("public offering") || lowerTitle.includes("debts")) {
    baseDesc = "listing debut tests grey market and retail subscription appetites.";
  } else if (lowerTitle.includes("earnings") || lowerTitle.includes("revenue") || lowerTitle.includes("profit") || lowerTitle.includes("beat") || lowerTitle.includes("sales")) {
    baseDesc = "corporate earnings reveal beats with target projections expanding.";
  } else if (lowerTitle.includes("deal") || lowerTitle.includes("acquisition") || lowerTitle.includes("merger") || lowerTitle.includes("buy") || lowerTitle.includes("takeover")) {
    baseDesc = "corporate consolidation shifts competitive sector benchmarks.";
  } else if (lowerTitle.includes("regulatory") || lowerTitle.includes("sec") || lowerTitle.includes("lawsuit") || lowerTitle.includes("ban") || lowerTitle.includes("investigate")) {
    baseDesc = "compliance audit framework introduces regulatory adjustments.";
  } else if (lowerTitle.includes("tech") || lowerTitle.includes("ai") || lowerTitle.includes("semiconductor") || lowerTitle.includes("chip") || lowerTitle.includes("quantum")) {
    baseDesc = "computing silicon breakthroughs spur hardware pipeline builds.";
  } else if (impact === "Bullish") {
    baseDesc = "purchasing volumes spark immediate technical index breakout testing.";
  } else if (impact === "Bearish") {
    baseDesc = "selling flows trigger defensive asset reallocations.";
  } else {
    baseDesc = "consolidated ranges capture low volume sideways price actions.";
  }

  const cleanTitle = title.endsWith(".") ? title : title + ".";
  return `${cleanTitle} This update adjusts sector parameters for ${tickerStr} as ${baseDesc}`;
}

function generateNewsAnalysis(title: string, impact: string, affected: any[]) {
  const lowerTitle = title.toLowerCase();
  const tickerStr = affected.map((a: any) => a.name).join(", ") || "the relevant sectors";
  
  let whyItMatters = "";
  let whoIsAffected = "";
  let shortTerm = "";
  let longTerm = "";
  let opportunities = "";
  let risks = "";

  if (lowerTitle.includes("inflation") || lowerTitle.includes("cpi") || lowerTitle.includes("fed") || lowerTitle.includes("rate") || lowerTitle.includes("monetary")) {
    whyItMatters = `Interest rate decisions and monetary cycles form the core discount rate factor for all financial assets. Lower inflation opens room for rate cuts, boosting valuations.`;
    whoIsAffected = `Debt-heavy corporate balance sheets, mortgage borrowers, active banking sector books, and broad market equity funds.`;
    shortTerm = `Expect index-wide volatility as bond yields adjust to monetary policy statements. Support levels around core moving averages remain key.`;
    longTerm = `Prolonged rate easing supports growth stocks, whereas high rates favor value-oriented stocks with resilient free cash flows.`;
    opportunities = `Increase exposure to interest-sensitive growth sectors like technology and consumer discretionary during index consolidations.`;
    risks = `Sticky service inflation or sudden hawkish shifts in central bank guidance could trigger sudden valuation-contraction spirals.`;
  } else if (lowerTitle.includes("ipo") || lowerTitle.includes("listing") || lowerTitle.includes("public offering") || lowerTitle.includes("debts")) {
    whyItMatters = `New public offerings indicate the appetite of institutional capital and the primary exit liquidity available in public venture markets.`;
    whoIsAffected = `Pre-IPO institutional anchor investors, retail stags seeking allotment gains, and competing peer stocks in the same sector.`;
    shortTerm = `Listing day premium volatility and massive retail subscription blockages of capital under ASBA.`;
    longTerm = `Secondary market post-listing performance audits and lock-in expiry dates will decide long-term institutional ownership stability.`;
    opportunities = `Apply for premium listings with high gray market premiums or accumulate peer equities trading at lower valuations.`;
    risks = `Over-pricing at launch can lead to post-listing drawdowns and capital lockups, dampening retail sentiment.`;
  } else if (lowerTitle.includes("earnings") || lowerTitle.includes("revenue") || lowerTitle.includes("profit") || lowerTitle.includes("beat") || lowerTitle.includes("sales")) {
    whyItMatters = `Corporate earnings revisions are the ultimate driver of stock prices. Beat estimates validate current multiples and fuel upward target revisions.`;
    whoIsAffected = `Equity shareholders of ${tickerStr}, sector index funds, and institutional active fund managers.`;
    shortTerm = `Post-earnings gaps up or down depending on forward-looking revenue guidance and management commentary.`;
    longTerm = `Compounded EPS expansion, return on equity (ROE) benchmarks, and organic capital allocation trends.`;
    opportunities = `Add to existing core positions if earnings beats are driven by structural margin improvements.`;
    risks = `Margin pressure from rising input costs or guidance downgrades despite beating past quarters.`;
  } else if (lowerTitle.includes("acquisition") || lowerTitle.includes("merger") || lowerTitle.includes("buy") || lowerTitle.includes("deal") || lowerTitle.includes("takeover")) {
    whyItMatters = `M&A activity points to corporate consolidation cycles, strategic asset acquisitions, and capital reallocations across industry leaders.`;
    whoIsAffected = `Shareholders of target and acquiring firms, regulators reviewing antitrust codes, and direct competitors.`;
    shortTerm = `Arbitrage spreads and target stock price rallying to match premium deal prices.`;
    longTerm = `Synergy capture, debt levels of the acquiring firm, and post-merger cultural and operational integration audits.`;
    opportunities = `Hold target stocks for conversion premiums or look for undervaluation in competing peers.`;
    risks = `Integration failures, overpayment for goodwill assets, or regulatory deal blockages.`;
  } else {
    // Default dynamic context-aware analysis based on impact and tickers
    if (impact === "Bullish") {
      whyItMatters = `Positive catalysts surrounding ${tickerStr} trigger buying momentum, raising capital inflows and supporting sector benchmarks.`;
      whoIsAffected = `Retail swing traders, long-only institutional portfolios, and sector-specific benchmark trackers.`;
      shortTerm = `Expect immediate bullish continuation with short-term support levels forming at previous consolidation highs.`;
      longTerm = `Structural growth trends remain supportive, indicating higher potential EPS revisions over the next 2-3 quarters.`;
      opportunities = `Accumulate leading high-momentum assets on minor intraday pullbacks.`;
      risks = `Profit-taking volatility near key technical resistance levels or over-extended valuations.`;
    } else if (impact === "Bearish") {
      whyItMatters = `Unfavorable developments for ${tickerStr} spark selling pressure, raising risk premiums and leading to short-term margin caution.`;
      whoIsAffected = `Leveraged long traders, retail portfolios holding direct exposure, and sector mutual funds.`;
      shortTerm = `Risk of breakdown below support levels; expect defensive capital reallocation to safer cash alternatives.`;
      longTerm = `Potential structural shifts in sector dynamics requiring detailed balance sheet audits.`;
      opportunities = `Reallocate surplus cash into defensive sectors or buy quality large-caps at significant discounts.`;
      risks = `Sustained selling flows leading to cascading stop-losses across leverage positions.`;
    } else {
      whyItMatters = `Consolidation phase for ${tickerStr} ahead of upcoming macro indicators or corporate guidelines.`;
      whoIsAffected = `Range-bound traders, index options sellers, and long-term asset accumulators.`;
      shortTerm = `Sideways pricing action with low overall volumes. Support and resistance ranges are tightly defined.`;
      longTerm = `Strategic accumulation period for value-focused portfolios aiming to expand core allocations.`;
      opportunities = `Utilize systematic investment plans (SIPs) to capture low-cost averaging benefits.`;
      risks = `Prolonged sideways stagnation or sudden breakout/breakdown driven by external global catalysts.`;
    }
  }

  return { whyItMatters, whoIsAffected, shortTerm, longTerm, opportunities, risks };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "finance";
  const country = searchParams.get("country") || "Global";
  
  // Construct search query based on category
  let categoryQuery = "finance";
  if (category.toLowerCase() === "markets") categoryQuery = "stock market";
  else if (category.toLowerCase() === "stocks") categoryQuery = "equities";
  else if (category.toLowerCase() === "economy") categoryQuery = "macroeconomics inflation interest rates";
  else if (category.toLowerCase() === "policy") categoryQuery = "central bank regulations monetary policy";
  else if (category.toLowerCase() === "technology") categoryQuery = "AI semiconductor tech stocks";

  // Combine category and country-specific queries
  let query = categoryQuery;
  if (country.toLowerCase() !== "global") {
    if (country.toLowerCase() === "india") {
      query = "Indian Markets";
    } else if (country.toLowerCase() === "usa") {
      query = "US Markets";
    } else if (country.toLowerCase() === "europe") {
      query = "European Markets";
    } else if (country.toLowerCase() === "japan") {
      query = "Nikkei";
    } else if (country.toLowerCase() === "asia") {
      query = "Asian Markets";
    }
  }

  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=15`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store" // disable cache to guarantee fresh, country-specific queries
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
        const isUp = impact === "Bullish" || (impact === "Neutral" && Math.random() > 0.5);
        const delta = (Math.random() * 2 + 0.1) * (isUp ? 1 : -1);
        return {
          symbol: tick,
          name: tick.split(".")[0],
          change: parseFloat(delta.toFixed(2))
        };
      });

      if (affected.length === 0) {
        if (country.toLowerCase() === "india") {
          affected.push(
            { symbol: "^BSESN", name: "SENSEX", change: impact === "Bullish" ? 0.95 : impact === "Bearish" ? -1.12 : 0.12 },
            { symbol: "^NSEI", name: "NIFTY 50", change: impact === "Bullish" ? 1.05 : impact === "Bearish" ? -1.18 : 0.15 }
          );
        } else {
          affected.push(
            { symbol: "^GSPC", name: "S&P 500", change: impact === "Bullish" ? 0.85 : impact === "Bearish" ? -0.92 : 0.05 },
            { symbol: "^IXIC", name: "NASDAQ", change: impact === "Bullish" ? 1.25 : impact === "Bearish" ? -1.45 : -0.12 }
          );
        }
      }

      // Dynamically generate descriptive analysis blocks based on headline keywords
      const analysis = generateNewsAnalysis(title, impact, affected);

      let crux = n.summary || n.description || "";
      if (!crux || crux.length < 15) {
        crux = generateNewsSummary(title, impact, affected);
      }

      return {
        id: n.uuid || `news-${idx}-${Date.now()}`,
        country: country.toLowerCase() !== "global" ? country : (lowerTitle.includes("india") ? "India" : lowerTitle.includes("china") ? "China" : lowerTitle.includes("europe") ? "Europe" : "Global"),
        category: category.charAt(0).toUpperCase() + category.slice(1),
        headline: title,
        summary: crux,
        source: n.publisher || "Yahoo Finance",
        timestamp,
        breaking: idx < 2 && impact !== "Neutral",
        impact,
        severity,
        confidence: 85 + Math.floor(Math.random() * 12),
        affected,
        whyItMatters: analysis.whyItMatters,
        whoIsAffected: analysis.whoIsAffected,
        shortTerm: analysis.shortTerm,
        longTerm: analysis.longTerm,
        opportunities: analysis.opportunities,
        risks: analysis.risks,
        url: n.link || "https://finance.yahoo.com"
      };
    });

    return NextResponse.json(formattedNews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load news" }, { status: 500 });
  }
}
