# Razorstash

Razorstash is a high-performance, self-hosted StashDB scraper built with Rust. It fetches metadata from the StashDB GraphQL API and stores local studio and performer reactions in a SQLite database.

## Features

- **StashDB GraphQL Integration:** Queries StashDB data using your API key.
- **Local SQLite Storage:** Persists reactions and local data in a simple embedded database.
- **Health Endpoint:** Provides `/health` endpoint for container health checks.
- **Lightweight & Fast:** Built with Rust for efficient resource usage.

## Tech Stack

- **Backend:** Rust
- **Docker Image:** ghcr.io/rodrigomescua/razorstash
- **Storage:** SQLite database mapped via persistent volume

## Usage

After installation, provide your StashDB API key in the app settings. Razorstash will store its SQLite database in `/data/razorstash.sqlite3`.
