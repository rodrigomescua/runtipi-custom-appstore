## A simple service for caching images locally, specifically designed for FreshRSS

FreshRSS Image Cache Service is a lightweight, high-performance image caching service written in Rust. It's specifically designed to work with the [freshrss-image-cache-plugin](https://github.com/Victrid/freshrss-image-cache-plugin) extension for FreshRSS.

### Key Features

- **Fast Image Caching**: Built in Rust for optimal performance and low resource usage
- **Time-Limited Link Support**: Perfect for handling ephemeral image URLs (e.g., from rsshub.app)
- **Drop-in Replacement**: Compatible replacement for piccache.php
- **Secure**: Token-based authentication for API access
- **Lightweight**: Minimal resource footprint

### Use Cases

- Cache images from RSS feeds with time-limited URLs
- Improve FreshRSS performance by serving cached images locally
- Ensure image availability even when original sources become unavailable
- Reduce bandwidth usage by avoiding repeated image downloads

### Setup

1. Install this app through Runtipi
2. Configure a secure access token during installation
3. In your FreshRSS installation, configure the freshrss-image-cache-plugin to use this service
4. Point the plugin to: `http://your-runtipi-host:port/cache`

### API Usage

The service exposes a simple API:
- `GET /cache?url=<image_url>&token=<access_token>` - Cache and serve an image
- Images are automatically cached on first request and served from cache on subsequent requests

### Security

Make sure to set a strong, unique access token during installation. This token is required for all API requests to prevent unauthorized access to the caching service.
