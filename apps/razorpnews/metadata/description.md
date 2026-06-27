# RazorPnews

RazorPnews is a high-performance, self-hosted TPDB browser built with Rust. It fetches metadata from the TPDB REST API and stores local studio and performer reactions in a SQLite database.

## Features

- **TPDB REST Integration:** Queries TPDB data using your API key.
- **Local SQLite Storage:** Persists reactions and local data in a simple embedded database.
- **Health Endpoint:** Provides `/health` endpoint for container health checks.
- **Lightweight & Fast:** Built with Rust for efficient resource usage.

## Tech Stack

- **Backend:** Rust
- **Docker Image:** ghcr.io/rodrigomescua/razorpnews
- **Storage:** SQLite database mapped via persistent volume

## Usage

After installation, provide your TPDB API key in the app settings. RazorPnews will store its SQLite database in `/data/razorpnews.sqlite3`.
