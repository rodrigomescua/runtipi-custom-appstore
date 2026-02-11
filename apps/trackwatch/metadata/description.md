TrackWatch is a self-hosted tool that helps you stay on top of new music releases on Spotify.

## Features

- **Release Radar**: Automatically scans your followed artists for new releases.
- **Auto-Sync**: Adds new releases directly to your Spotify playlists.
- **Ghost Tracking**: Identify tracks that were removed from Spotify but still exist in your playlists.
- **Discography Generation**: Create complete discography playlists for artists.
- **Customizable**: Configurable scan intervals and playlist settings.

## Setup

To use TrackWatch, you need to create a Spotify Developer Application:
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create an app and set the **Redirect URI** to `http://<your-tipi-ip>:8834/callback`.
3. Copy the **Client ID** and **Client Secret** into the app configuration.
4. Set a random string for the **Secret Key**.
