Tuliprox is a powerful self-hosted IPTV proxy and playlist processor. It supports Xtream Codes API and M3U playlist sources, offering advanced features like reverse proxy streaming, channel filtering and mapping using a custom DSL, TMDB/PTT metadata enrichment, and EPG integration.

Key features:
- Supports Xtream Codes API, M3U, HDHomeRun, Plex, Emby input sources
- Reverse proxy with filtering, mapping, and metadata enrichment
- Zero-downtime configuration reload via atomic swaps
- Disk-based playlist processing for reduced memory usage
- Embedded web UI with live dashboard, user management, and config editor
- No external database required — uses embedded B+Tree databases
- CLI mode for one-shot batch processing or long-running server mode
- Healthcheck endpoint at `/api/v1/status`

After installation, place your `config.yml`, `source.yml`, and `api-proxy.yml` files in the app's config data directory and access the web UI to complete setup.
