# Mydia

A modern, self-hosted media management platform for tracking, organizing, and monitoring your media library.

## Features

- **Unified Media Management** – Track both movies and TV shows with rich metadata from TMDB/TVDB
- **Automated Downloads** – Background search and download with quality profiles and smart release ranking
- **Multiple Download Clients** – qBittorrent, Transmission, SABnzbd, NZBGet, and rTorrent support
- **Indexer Integration** – Search via Prowlarr, Jackett, and native Cardigann indexer support
- **Multi-User System** – Built-in admin/guest roles with request approval workflow
- **SSO Support** – Local authentication plus OIDC/OpenID Connect integration
- **Release Calendar** – Track upcoming releases and monitor episodes
- **Real-Time UI** – Phoenix LiveView with instant updates and responsive design
- **Quality Profiles** – Built-in and customizable quality profiles with TRaSH Guides compatibility
- **PostgreSQL Support** – Optional PostgreSQL backend for scalability

## Getting Started

1. On first access, you'll be guided through creating the initial admin user
2. Configure your media library paths (movies and TV shows)
3. Add download clients (qBittorrent, Transmission, etc.)
4. Configure indexers (Prowlarr, Jackett, or built-in Cardigann)
5. Start adding media to your library

## Configuration

Mydia requires two secret keys for operation:
- **SECRET_KEY_BASE**: Phoenix session secret (auto-generated)
- **GUARDIAN_SECRET_KEY**: JWT signing key for authentication (auto-generated)

Media library paths and download client configurations can be managed through the admin interface after initial setup.

## Documentation

For advanced configuration, download client setup, and OIDC integration details, visit the [official documentation](https://github.com/getmydia/mydia).
