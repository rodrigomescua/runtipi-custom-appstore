# GeoPulse

A self-hosted location tracking and analysis platform that transforms raw GPS data from tracking apps into organized timelines and insights.

## Features

- **GPS Integration**: Works with OwnTracks (HTTP or MQTT), Overland, Dawarich, HomeAssistant and GPSLogger
- **Timeline & Maps**: Automatic categorization of GPS data into stays, trips and data gaps
- **Analytics**: Dashboard with distance traveled, visit statistics, and journey insights
- **AI Chat**: Ask questions about your location data and get intelligent insights
- **Social Features**: Connect with friends to share locations with privacy controls
- **Sharing**: Public share links with time-limited and password-protected access
- **Places Management**: Save favorite locations with reverse geocoding support
- **Customization**: Adjustable timeline settings, custom map tiles, dark/light themes

## Architecture

- **Backend**: Java with Quarkus framework in Native mode
- **Database**: PostGIS (PostgreSQL with geographic extensions)
- **Frontend**: Vue.js 3 with PrimeVue components and chart.js
- **Maps**: Leaflet with OpenStreetMap

## Configuration

GeoPulse requires PostgreSQL credentials during setup. You can optionally set an admin email to grant admin privileges to a specific user.

## Documentation

Full documentation is available at: https://tess1o.github.io/geopulse/

## License

Licensed under Business Source License 1.1 (BSL 1.1) - Free for personal, educational, and non-commercial use.
