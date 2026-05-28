# Rustpnews

Rustpnews is a high-performance, self-hosted developer news aggregator and RSS polling service built with Rust. It polls news sources and developer blogs, tracks feeds and articles, and aggregates them into a unified experience with dynamic concurrency and paging support.

## Features

- **RSS & News Polling:** Efficiently polls and monitors developer feeds.
- **Dynamic Paging & Filtering:** Page size, overlap, and maximum page limits are fully customizable.
- **Concurrent Fetching:** Concurrent detail page fetching to optimize speed and efficiency.
- **Robust Retries:** Automatically handles transient network or source failures with exponential backoff.
- **Lightweight & Fast:** Engineered in Rust to run with minimal resources.

## Tech Stack

- **Backend:** Rust
- **Docker Image:** ghcr.io/rodrigomescua/rustpnews
- **Storage:** Local file-based storage mapped via volumes

## Usage

After installation, configure the API token and the polling interval to begin aggregating news feeds. All collected news data is stored in the `/app/App_Data` volume.
