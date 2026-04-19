# MurkRSS

MurkRSS is an autonomous RSS feed generator designed for websites that don't provide native feeds. It bridges the gap between static web content and your favorite RSS reader (like FreshRSS or Miniflux) by using intelligent scraping patterns.

## Features

- **Heuristic Scraping**: Automatically attempts to detect titles and links in common article structures.
* **Custom CSS Selectors**: Define exact selectors for item containers, titles, and links for non-standard sites.
- **Visual Sandbox (Point-and-Click)**: Test and configure selectors in real-time using a built-in proxy with visual highlights.
- **Background Worker**: Periodically checks for new content and updates your feeds automatically.
- **FreshRSS Integration**: Generates native subscription links for a seamless workflow.
- **Anti-Bot Support**: Integrates with FlareSolverr to bypass Cloudflare and other protections.

## Getting Started

1. Set the **Worker Interval** (how often MurkRSS should check for new content).
2. (Optional) Provide your **FlareSolverr URL** if you need to scrape sites behind Cloudflare.
3. Access the dashboard at `http://your-server-ip:8863`.
4. Add your first site and use the **Visual Mode (⚙️)** to configure exact selectors if the default detection fails.

## Documentation

For more details, visit the [official repository](https://github.com/rodrigomescua/MurkRSS).
