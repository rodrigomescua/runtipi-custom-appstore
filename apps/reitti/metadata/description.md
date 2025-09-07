# Reitti - Personal Location Tracking & Analysis

**Reitti** is a comprehensive self-hosted application for tracking, analyzing, and visualizing your location data over time. The name "Reitti" comes from Finnish, meaning "route" or "path".

## Key Features

### Core Location Analysis
- **Visit Detection**: Automatically identify places where you spend time with configurable algorithms
- **Trip Analysis**: Track your movements between locations with transport mode detection (walking, cycling, driving)
- **Significant Places**: Recognize and categorize frequently visited locations with custom naming
- **Timeline View**: Interactive daily timeline showing visits and trips with duration and distance information
- **Raw Location Tracking**: Visualize your complete movement path with detailed GPS tracks

### Multi-User Support
- **Multi-User View**: Visualize all your family and friends on a single map
- **Live Mode**: Visualize incoming data automatically without having to reload the map
- **Fullscreen Mode**: Display the map in fullscreen for kiosk displays

### Data Import & Integration
- **Multiple Import Formats**: Support for GPX files, Google Takeout JSON, Google Timeline Exports and GeoJSON files
- **Real-time Data Ingestion**: Live location updates via OwnTracks and GPSLogger mobile apps
- **Batch Processing**: Efficient handling of large location datasets with queue-based processing
- **API Integration**: RESTful API for programmatic data access and ingestion

### Photo Integration
- **Photo Mapping**: Connect with Immich for location-based photo viewing
- **Automatic Geotagging**: Match photos to your location data automatically

### Privacy & Self-hosting
- **Complete Data Control**: Your location data never leaves your server
- **Self-hosted Solution**: Deploy on your own infrastructure
- **Asynchronous Processing**: Handle large datasets efficiently with RabbitMQ-based processing
- **No Cloud Dependencies**: Everything runs locally on your server

## Default Credentials
- **Username**: admin
- **Password**: admin

Please change these credentials immediately after installation!

## Getting Started

1. **Deploy**: Install Reitti using the Runtipi interface
2. **Create Account**: Set up your first user account via the web interface
3. **Generate API Token**: Create tokens for mobile app integration
4. **Import Data**: Upload existing location data (GPX, Google Takeout, GeoJSON)
5. **Configure Mobile Apps**: Set up OwnTracks or GPSLogger for real-time tracking
6. **Add Geocoding**: Configure address resolution services

## Mobile App Integration

Configure real-time location tracking with:
- **OwnTracks** (iOS/Android): Privacy-focused location sharing
- **GPSLogger** (Android): Lightweight GPS logging with custom URL support
- **Custom Apps**: Use the REST API for custom integrations

## Configuration Options

- **Country Code**: Set your main country for Photon geocoding service optimization
- **Processing Wait Time**: Configure how long to wait before processing location data
- **Data Management**: Enable advanced data management features (use with caution)

Reitti provides a complete solution for understanding your movement patterns while maintaining full control over your personal location data.
