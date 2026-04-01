# ImageMagick WebGUI

A modern, beautiful web interface for ImageMagick with AI-powered features.

## Features

- **Image Processing**: Resize, crop, rotate, format conversion (WebP, AVIF, JPEG, PNG, GIF, TIFF, PDF)
- **Filters & Effects**: Blur, sharpen, grayscale, sepia, brightness, contrast, saturation
- **Batch Processing**: Process multiple images simultaneously
- **AI Features**: Background removal with one-click, auto-enhance, smart upscaling (2x/4x)
- **Watermark & Text**: Custom text overlays with position, opacity, and font size control
- **User Interface**: Real-time preview, drag & drop upload, dark/light mode, PWA support
- **Security**: Command whitelist, resource limits, rate limiting
- **Authentication**: Optional login requirement with email/password support

## Technical Details

- Frontend: Next.js 15 with TypeScript
- Backend: FastAPI with Python 3.12
- Database: PostgreSQL
- Queue: Redis with RQ for background jobs
- Image Processing: ImageMagick 6

## Default Configuration

- **Frontend Port**: 3000
- **Max Upload Size**: 100MB (configurable)
- **No Authentication Required** by default
- **Database**: PostgreSQL (internal)
- **Queue**: Redis (internal)

For full documentation and advanced configuration, visit: https://github.com/PrzemekSkw/imagemagick-webui
