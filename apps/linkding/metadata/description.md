# Linkding

Linkding is a self-hosted bookmark manager that allows you to save, organize, and share your bookmarks efficiently.

## Features

- **Self-hosted**: Run it on your own server or local machine
- **Bookmark Management**: Save and organize your bookmarks with tags
- **Full-text Search**: Quickly find bookmarks using full-text search capabilities
- **Browser Extensions**: Available for Chrome, Firefox, and Edge for quick bookmarking
- **Clean UI**: Minimalist and intuitive user interface
- **REST API**: Programmatically manage your bookmarks
- **Database Support**: Uses SQLite by default, but also supports PostgreSQL
- **Multi-user**: Support for multiple users with different permissions
- **Import/Export**: Easily import bookmarks from other services or export your collection

## Getting Started

1. After installation, access Linkding at `http://localhost:8830` (or your configured port)
2. Log in with the credentials you set during installation
3. Start adding and organizing your bookmarks
4. Install browser extensions for quick bookmarking from your browser

## Documentation

For more information, visit [Linkding Documentation](https://linkding.link/installation/)

## System Requirements

- Docker and Docker Compose installed
- At least 256MB of RAM
- Minimal disk space for bookmark storage (depends on the number of bookmarks and snapshots)

## Advanced Configuration

Linkding supports various environment variables for advanced configuration. Refer to the official documentation for additional options like:

- Database configuration (PostgreSQL support)
- Archiving settings (requires additional storage)
- CSRF trusted origins for reverse proxy setups
- SSL/TLS configuration

## License

Linkding is released under the MIT License. See the [GitHub repository](https://github.com/sissbruecker/linkding) for more details.
