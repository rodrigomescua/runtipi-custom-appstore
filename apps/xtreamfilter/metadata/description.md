# XtreamFilter

XtreamFilter is a self-hosted Xtream Codes proxy and IPTV media workflow tool. Combine multiple providers, filter their content, browse the resulting catalog and expose clean Xtream or M3U endpoints to your clients.

## Features

- Merge multiple Xtream sources with virtualized IDs
- Filter live, VOD and series content per source
- Provide merged and dedicated Xtream endpoints
- Browse, search and preview the catalog in the web UI
- Create custom categories and monitor movies or series
- Download movies and episodes with Jellyfin/Kodi-friendly metadata
- Optional stream proxying and Telegram notifications

## Getting Started

1. Open XtreamFilter at the configured Runtipi port.
2. Add one or more Xtream sources.
3. Configure filters and refresh the cache.
4. Use the displayed Xtream or M3U URLs in your IPTV client.

## Storage

Application data and cache are stored in the persistent `data` directory. Downloaded media is stored in the persistent `downloads` directory.

## Documentation

See the [official XtreamFilter repository](https://github.com/SpanishST/xtreamfilter) for configuration details and API documentation.
