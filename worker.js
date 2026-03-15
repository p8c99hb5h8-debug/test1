export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy Yahoo Finance API requests — no CORS issues
    if (url.pathname.startsWith('/api/yahoo/')) {
      const rest = url.pathname.slice('/api/yahoo/'.length);
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${rest}${url.search}`;
      const resp = await fetch(yahooUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      return new Response(resp.body, {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=30',
        },
      });
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
