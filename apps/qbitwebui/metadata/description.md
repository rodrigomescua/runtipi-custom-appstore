# qBitWebUI

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Maciejonos/qbitwebui)
[![Docker](https://img.shields.io/badge/Docker-GHCR-blue?logo=docker)](https://ghcr.io/maciejonos/qbitwebui)

## Overview

qBitWebUI is a modern, feature-rich alternative web interface for qBittorrent. Built with React 19, TypeScript, and Tailwind CSS, it provides multi-instance management, Prowlarr integration, and a comprehensive set of tools for advanced torrent management.

## Features

### Multi-Instance Management (v2.0+)
- **Multiple qBittorrent Instances** - Manage unlimited instances from a single interface
- **User Authentication** - Secure registration/login with AES-256-GCM encrypted credential storage
- **Instance Dashboard** - Overview of all instances with statistics and speed graphs

### Core Functionality
- **Real-time Monitoring** - Live updates on download/upload speeds, progress, and peer information
- **Advanced Search** - Integrated Prowlarr support for indexer search across all instances
- **File Management** - Browse, download, copy, move, and delete files directly from the server
- **Torrent Operations** - Drag & drop uploads, magnet links, file priority management, and sequential download

### Tools & Features
- **Settings Panel** - Edit most qBittorrent settings directly in the UI
- **Orphaned Torrents Detection** - Find and manage torrents with missing data files
- **Global/Alternative Speed Controls** - Speed limit scheduling and management
- **File Browser** - Navigate and manage server files with download-to-client capability

### User Experience
- **Multiple Themes** - Light and dark modes with customizable color schemes
- **Mobile Support** - Progressive Web App (PWA) with responsive design and compact mode
- **Fuzzy Search** - Intelligent search across all torrents
- **Pagination & Filtering** - Efficient navigation through large torrent collections
- **Keyboard Navigation** - Full keyboard shortcuts for power users

## Requirements

- A running qBittorrent instance with Web UI enabled (or multiple instances)
- Network access to qBittorrent Web API

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `ENCRYPTION_KEY` | Secret key for credential encryption (32+ characters) | Yes |

## Usage

1. **First Launch:** Register an account to secure the application
2. **Add Instances:** Configure one or more qBittorrent instances via the UI
3. **Optional:** Connect Prowlarr for integrated torrent search
4. **Manage Torrents:** Switch between instances and manage torrents with all available tools

## Notes

- All qBittorrent credentials are encrypted with AES-256-GCM before storage
- The ENCRYPTION_KEY is generated automatically during installation
- User data and instance configurations are persisted in the `/data` volume
- For Prowlarr integration, ensure it's accessible from the qBitWebUI container
- The Web UI runs on nginx serving static files
