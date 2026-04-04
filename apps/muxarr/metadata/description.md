# Muxarr

Quick and easy way to strip unwanted audio and subtitle tracks from your media files.

Ever had your player pick the wrong audio language, or show 20 subtitle options you'll never use? Most media files ship with far more tracks than you need.

Muxarr cleans them up by removing redundant audio and subtitle tracks and standardizing track metadata. It uses mkvmerge to remux - not re-encode - so there is zero quality loss. A 4GB file takes about a minute instead of hours, even on low-end hardware like a NAS or Raspberry Pi.

## Features

- **Lossless track removal**: Strip redundant audio tracks (commentary, foreign dubs) and subtitles (SDH, foreign).
- **Original language detection**: Integrates with your *arr stack so foreign films and shows always keep the correct audio track.
- **Automatic processing**: Webhook support to process new imports as they arrive.
- **Per-directory profiles**: Different language and track rules for different collections (e.g. anime vs western media).
- **Smart metadata fixes**: Cleans up encoder tags and codec dumps from track names.
- **Safe by default**: Validates the output file before replacing the original.
- **Library overview**: Browse your library with codec, resolution, and language breakdowns.
