# Omnom - Web Content Preservation Service

A self-hosted web content preservation service for bookmarking, feed aggregation, and Fediverse integration.

## Key Features

- **📌 Bookmarking** - Save web pages as snapshots with full content preservation
- **📸 Web Snapshots** - Capture pages as your browser renders them (JavaScript-heavy pages included)
- **📰 Feed Reader** - Aggregate RSS and Atom feeds with multi-feed search
- **🌐 ActivityPub/Fediverse** - Follow Mastodon, Pleroma, and other Fediverse accounts
- **🔍 Full-Text Search** - Search across all saved content with flexible filtering
- **📊 Snapshot Comparison** - Compare multiple snapshots of the same URL with diff views
- **👥 Multi-User** - Multiple user accounts with isolated bookmarks and feeds
- **🧩 Browser Extension** - Firefox and Chrome addons for quick bookmarking
- **💾 Locally Stored** - All multimedia content saved locally on your server
- **🔐 Self-Hosted** - Complete privacy and control over your data

## Perfect For

- Privacy-conscious users who want to preserve web content
- Content archivists and researchers
- Teams managing knowledge preservation
- RSS feed enthusiasts with ActivityPub integration

## Getting Started

1. Access at `http://localhost:8842` (or your configured domain)
2. Create a new account (unless signup is disabled)
3. Use the web interface to bookmark pages or subscribe to feeds
4. Install browser extension for quick bookmarking from any page

**Important:** Omnom requires a valid base URL for ActivityPub functionality. Configure this in `config.yml` at `/omnom/config/config.yml`.

## Volumes

- `/omnom/config` - Database (SQLite), ActivityPub keys, and configuration
- `/omnom/static/data` - Snapshot data and user-uploaded content

For more information, visit: https://github.com/asciimoo/omnom
