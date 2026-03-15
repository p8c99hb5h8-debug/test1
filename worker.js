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

    // Proxy Google News RSS for financial market news
    if (url.pathname === '/api/news') {
      const rssUrl = 'https://news.google.com/rss/search?q=stock+market+OR+cryptocurrency+OR+federal+reserve+OR+wall+street&hl=en-US&gl=US&ceid=US:en';
      const resp = await fetch(rssUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      return new Response(resp.body, {
        status: resp.status,
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
