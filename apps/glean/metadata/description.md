# Glean

Glean (拾灵) is a self-hosted RSS reader and personal knowledge management tool designed for information-heavy consumers who want to efficiently manage their reading.

## Features

### Core Features
- **RSS Subscription** - Subscribe and organize RSS/Atom feeds with OPML import/export
- **Smart Reading** - Clean reading experience with content filtering
- **Read Later** - Save articles for later reading with automatic cleanup
- **Folders & Tags** - Multi-level folders and tags for content organization
- **Bookmarks** - Save articles from feeds or external URLs
- **Background Sync** - Automatic feed updates every 15 minutes
- **Modern UI** - Beautiful, responsive interface with warm dark theme
- **Admin Dashboard** - User management and system monitoring

### Planned Features
- Smart recommendations with AI-powered preference learning
- Rule engine with Jinja2-style conditions for automated processing
- AI features: summary generation, auto-tagging, keyword extraction
- Full content fetch for RSS summaries
- Chrome extension for one-click bookmarking
- Mobile PWA for responsive mobile experience

## Tech Stack

### Backend
- Python 3.11+ with FastAPI
- SQLAlchemy 2.0 ORM
- PostgreSQL database
- Redis for caching and task queue
- arq for background job processing

### Frontend
- React 18 with TypeScript
- Vite bundler
- Tailwind CSS styling
- Zustand for state management
- TanStack Query for data fetching

## Configuration

The app requires two main environment variables during setup:
- **SECRET_KEY** - JWT signing key for session management (auto-generated)
- **POSTGRES_PASSWORD** - Database password for secure access

## Support

- GitHub Repository: https://github.com/LeslieLeung/glean
- Join Discord community for updates and support
- License: AGPL-3.0

## Note

This project is still in active development. Currently in Phase 1-2 of the roadmap with core MVP features and organization features completed.
