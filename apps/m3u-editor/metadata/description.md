# M3U Editor

A full-featured and powerful IPTV editor with comprehensive playlist and EPG management capabilities.

## Features

- **Playlist Management**: Support for M3U, M3U8, M3U+ formats and Xtream codes API
- **EPG Integration**: XMLTV files (local/remote), XMLTV URLs, and full Schedules Direct integration
- **Xtream API Output**: Full Xtream codes API compatibility for client streaming
- **Series Management**: Ability to store and sync .strm files with automatic metadata lookup
- **Post Processing**: Custom scripts, webhook requests, and email notifications
- **Channel Editing**: Full-featured editor with categorization and filtering
- **VOD Management**: Complete video-on-demand catalog with metadata
- **Proxy Streaming**: Built-in M3U proxy with hardware acceleration support
- **Multi-User**: Support for multiple users and custom playlists

## Quick Start

1. Access the web interface at the configured port
2. Create your first admin account
3. Add your IPTV playlists (M3U URL or Xtream API credentials)
4. Configure EPG sources
5. Start managing your channels and content

## Documentation

Full documentation available at: https://sparkison.github.io/m3u-editor-docs

## Hardware Acceleration

The M3U proxy service supports hardware acceleration for transcoding. Ensure `/dev/dri` is available on your host system for GPU acceleration.

## Default Credentials

- Database: m3ue/[auto-generated password]
- No default web credentials - create admin on first run
