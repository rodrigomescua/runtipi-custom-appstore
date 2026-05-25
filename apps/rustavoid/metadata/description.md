# Rustavoid

Rustavoid is a self-hosted web application for registering products, services, and companies that delivered a bad experience — helping you avoid future repurchases.

## Features

- Register and track companies/products with bad experiences
- Server-side rendered interface using Askama templates
- Async interactions powered by HTMX (no custom JS frontend)
- Lightweight and fast, built with Rust and Axum
- Persistent storage with SQLite

## Tech Stack

- **Backend:** Rust + Axum
- **Templates:** Askama (server-side HTML rendering)
- **Database:** SQLite with SQLx migrations
- **Frontend:** HTMX for async interactions
- **Deployment:** Docker

## Usage

After installation, open the app and start registering products or companies you want to avoid. Data is persisted in a local SQLite database.
