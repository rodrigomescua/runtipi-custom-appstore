# PriceBuddy

PriceBuddy is a self-hostable application that tracks prices and sends you notifications when prices match your preferences.

## Features

- **Store Management**: Create and manage stores, fetch products from almost any store that has a product page
- **Product Tracking**: Create and manage products, each product can have multiple URLs and prices are fetched daily
- **Price History**: Visualize product price history with charts
- **Advanced Extraction**: Extract product information via CSS selectors, regular expressions or JSONPath
- **JavaScript Support**: Support for SPA/Javascript rendered sites via SeleniumBase Scraper
- **Product Organization**: Tagging of products for better organization
- **Multi-user Support**: Each user has their own products
- **Notifications**: Get notifications via the app, email or pushover/gotify when prices change
- **UI/UX**: Light and dark mode & Mobile friendly
- **SearXNG Integration**: Integration with SearXNG to search for products and add URLs within the app
- **Self-hostable**: Open source and self-hostable

## Default Login

- **Email**: admin@example.com
- **Password**: admin

**Important**: Change these credentials immediately after first login!

## Architecture

PriceBuddy runs with three integrated services:
- **App**: Main PriceBuddy application (PHP/Laravel based)
- **Database**: MySQL 8.2 for data persistence
- **Scraper**: SeleniumBase scraper for JavaScript-heavy websites

## Configuration

Most settings can be configured through the application settings page. For advanced configuration, you can modify environment variables through Runtipi settings.

### Data Volumes

| Host Path | Container Path | Purpose |
|-----------|-----------------|---------|
| `${APP_DATA_DIR}/data/storage` | `/app/storage` | Application storage, sessions, and assets |
| `${APP_DATA_DIR}/data/database` | `/var/lib/mysql` | MySQL database persistence |

## Background Tasks

The application includes a built-in cron job that takes care of background tasks such as:
- Fetching product prices daily from configured stores
- Sending notifications when prices match your criteria
- Database maintenance and optimization

## Affiliate Codes

By default, affiliate codes are added to a couple of stores to support project development. You can disable this through the application settings or environment configuration.

## Health Monitoring

Both the main application and database include health checks:
- **App**: HTTP health endpoint with 60-second startup period
- **Database**: MySQL ping check with 30-second startup period

## Documentation

For more information, visit:
- [PriceBuddy Docs](https://pricebuddy.jez.me/)
- [GitHub Repository](https://github.com/jez500/pricebuddy)
