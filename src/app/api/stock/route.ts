export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { stockMarketApi } from "@/lib/stockApi";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const symbol = searchParams.get("symbol");
  const query = searchParams.get("query");
  const range = searchParams.get("range") || "1m";

  try {
    if (action === "search") {
      if (!query) {
        return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
      }
      const data = await stockMarketApi.searchStocks(query);
      return NextResponse.json(data);
    } 
    
    if (action === "quote") {
      if (!symbol) {
        return NextResponse.json({ error: "Missing symbol parameter" }, { status: 400 });
      }
      const data = await stockMarketApi.getStockQuote(symbol);
      if (!data) {
        return NextResponse.json({ error: "Stock not found" }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    if (action === "history") {
      if (!symbol) {
        return NextResponse.json({ error: "Missing symbol parameter" }, { status: 400 });
      }
      const data = await stockMarketApi.getStockHistory(symbol, range);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
  }
}
