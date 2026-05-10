# html2rss-web

`html2rss-web` serves RSS/JSON feeds from website sources using a Ruby (Roda) backend and a Preact frontend. It converts arbitrary websites into RSS 2.0 feeds.

## Features

- Convert any website into an RSS 2.0 or JSON feed
- Clean web UI for creating and previewing feed URLs
- Signed, per-account feed URLs via `POST /api/v1/feeds`
- Multiple extraction strategies (faraday, browserless)
- OpenAPI documentation at `/openapi.yaml`
- Health endpoints at `/api/v1/health`

## Configuration

After installation, place your `feeds.yml` configuration file in the app's data directory under `config/feeds.yml`. This file defines the feed configurations for your instance.

Example `feeds.yml`:

```yaml
feeds:
  ruby-lang-news:
    url: https://www.ruby-lang.org/en/news/
    selector: article.post
    title:
      selector: h1
    link:
      selector: h1 a
      attr: href
```

## Environment Variables

- `HTML2RSS_SECRET_KEY`: Auto-generated secret key for signing feed URLs (min 32 chars)
- `HEALTH_CHECK_TOKEN`: Optional token to secure the health check endpoint
- `AUTO_SOURCE_ENABLED`: Enable feed creation via the API (default: false)

## Links

- [GitHub Repository](https://github.com/html2rss/html2rss-web)
- [Docker Hub](https://hub.docker.com/r/html2rss/web)
- [Public Documentation](https://html2rss.github.io)
- [OpenAPI Spec](https://github.com/html2rss/html2rss-web/blob/main/public/openapi.yaml)
