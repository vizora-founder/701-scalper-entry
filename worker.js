
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigin =
      origin === "https://vizora-founder.github.io"
        ? origin
        : "https://vizora-founder.github.io";

    const headers = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);

    if (url.pathname !== "/candles") {
      return new Response(
        JSON.stringify({ message: "701 SCALPER API" }),
        { headers }
      );
    }

    if (!env.TWELVE_DATA_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers }
      );
    }

    const api = new URL("https://api.twelvedata.com/time_series");
    api.searchParams.set("symbol", "XAU/USD");
    api.searchParams.set("interval", "5min");
    api.searchParams.set("outputsize", "100");
    api.searchParams.set("apikey", env.TWELVE_DATA_API_KEY);

    try {
      const result = await fetch(api);
      const data = await result.json();

      return new Response(JSON.stringify(data), {
        status: result.status,
        headers
      });
    } catch {
      return new Response(
        JSON.stringify({ error: "Market data unavailable" }),
        { status: 502, headers }
      );
    }
  }
};
// Cloudflare deploy
