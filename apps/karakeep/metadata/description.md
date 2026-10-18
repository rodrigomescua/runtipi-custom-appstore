### Karakeep

A self-hostable bookmark-everything app with a touch of AI for the data hoarders out there.

![homepage screenshot](https://github.com/karakeep-app/karakeep/blob/main/screenshots/homepage.png?raw=true)

## Features

- 🔗 Bookmark links, take simple notes and store images and pdfs.
- ⬇️ Automatic fetching for link titles, descriptions and images.
- 📋 Sort your bookmarks into lists.
- 🔎 Full text search of all the content stored.
- ✨ AI-based (aka chatgpt) automatic tagging. With supports for local models using ollama!
- 🔖 Browser extensions for quick bookmarking.
- 🗄️ Full page archival (using [monolith](https://github.com/Y2Z/monolith)) to protect against link rot.
- ☑️ Bulk actions support.
- 🌙 Dark mode support.
- 💾 Self-hosting first.
- Automatic offline downloads for recent bookmarks and selected lists in the mobile app (requires a compatible mobile app release).

**⚠️ This app is under heavy development and it's far from stable.**

## Documentation

- [Documentation](https://docs.karakeep.app/)

## Crawler settings

The crawler uses the Runtipi server timezone through `CRAWLER_BROWSER_TIMEZONE=${TZ}`; no separate timezone field is needed. Karakeep 0.34.0 documents no other timezone configuration variable. When using a proxy, its outbound IP location should match the configured timezone.

The crawler waits up to 60 seconds for self-clearing antibot challenges (`CRAWLER_CHALLENGE_WAIT_SEC=60`). Full-page archives have no size limit (`CRAWLER_FULL_PAGE_ARCHIVE_MAX_SIZE_MB=0`). These values are fixed in Compose and are not exposed in the store form.

## Upgrading to 0.34.0

Before upgrading, stop Karakeep and back up its persistent data. Preserve the backup for rollback: reverting the image alone does not undo database migrations.

Check for accounts whose email addresses differ only in letter case. Resolve conflicting accounts before upgrading; the authentication migration lowercases email addresses and unresolved conflicts can prevent login. Export any data you need before deleting an unused account.

The migration to better-auth runs automatically. All web users must sign in again; mobile sessions and API keys are unaffected. Keep the existing Nextauth Secret and server URL.

Pull and recreate the Chrome service as well as Karakeep. The store already uses the official `karakeep-chrome:release` image, but existing installations need a fresh pull to receive its crawler improvements. Google Chrome is used on amd64; arm64 uses Chromium. Mobile features require the corresponding mobile app update.
