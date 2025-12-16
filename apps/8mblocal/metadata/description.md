# 8mb.local - Self-Hosted GPU Video Compressor

A fire-and-forget video compressor with GPU acceleration support.

## Key Features

- **Multi-vendor GPU support**: Auto-detects NVIDIA NVENC, Intel/AMD VAAPI (Linux), or falls back to CPU
- **Drag-and-drop UI**: Simple SvelteKit interface for uploading and compressing videos
- **Multiple codec options**: AV1, HEVC (H.265), H.264 with hardware acceleration when available
- **Real-time progress tracking**: Watch compression progress with live FFmpeg logs
- **Automatic optimization**: Files exceeding target size are automatically re-encoded with adjusted bitrate
- **Live queue management**: View active jobs, monitor progress, and cancel individual jobs
- **Flexible output formats**: MP4 or MKV container selection
- **Resolution control**: Set max width/height while maintaining aspect ratio
- **Video trimming**: Specify start/end times for video segments
- **Authentication support**: Optional login for protected access

## Hardware Support

- **NVIDIA**: NVENC support for RTX/GTX series (best support for AV1, HEVC, H.264)
- **Intel**: Quick Sync Video (QSV) support on Linux with compatible CPUs
- **AMD**: VAAPI support on Linux with compatible GPUs
- **CPU fallback**: Works on any system without GPU using software encoders

## Settings

Configure via the web UI at `/settings`:
- Enable/disable authentication
- Set default compression presets
- Toggle codec visibility
- Manage worker concurrency

## Default Configuration

- Backend port: 8001
- File retention: 24 hours
- Worker concurrency: 4 jobs
- Authentication: Disabled by default

See the [GitHub repository](https://github.com/JMS1717/8mb.local) for detailed documentation and troubleshooting.
