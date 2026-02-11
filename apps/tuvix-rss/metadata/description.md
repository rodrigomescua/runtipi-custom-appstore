# Tuvix RSS

A self-hostable RSS aggregator for the masses.

**Note:** This app uses a custom Nginx configuration to proxy API requests internally, allowing it to work without specialized client-side build arguments.

## Features

- Clean, modern interface
- RSS/Atom feed support
- Article aggregation
- Self-hosted for privacy

## Setup

1. Generate a random string for `Better Auth Secret` (e.g., using `openssl rand -base64 32`).
2. Set your desired Admin credentials.
