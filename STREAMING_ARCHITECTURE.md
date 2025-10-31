# Streaming Architecture - HLS/DASH with CDN

This document explains the adaptive bitrate streaming setup and CDN integration.

## Technologies Used

### 1. **HLS.js (HTTP Live Streaming)**
- **Purpose**: Adaptive bitrate streaming
- **How it works**: 
  - Video is encoded in multiple quality levels (360p, 480p, 720p, 1080p, 4K)
  - Player automatically switches between qualities based on network speed
  - Minimizes buffering and provides smooth playback

### 2. **CDN Integration**
- **Providers Supported**:
  - Cloudflare (recommended for video)
  - AWS CloudFront
  - Bunny CDN
  - Fastly

## How Adaptive Bitrate Works

```
User's Network Speed    →    Quality Selected
─────────────────────────────────────────────
< 1 Mbps                →    360p (SD)
1-3 Mbps                →    480p (SD)
3-5 Mbps                →    720p (HD)
5-10 Mbps               →    1080p (Full HD)
> 10 Mbps               →    4K (Ultra HD)
```

### Player Features

✅ **Automatic Quality Switching** - Seamlessly adjusts to network conditions  
✅ **Manual Quality Selection** - Users can override and select specific quality  
✅ **Buffer Management** - Smart buffering to prevent playback interruptions  
✅ **Error Recovery** - Automatically retries on network errors  
✅ **Mobile Optimized** - Respects data saver modes  

## Current Setup

### VidSrc Integration
- VidSrc already provides HLS streams
- Our custom player (`AdaptivePlayer`) handles:
  - Quality selection
  - Adaptive bitrate switching
  - Custom controls
  - Error handling

### For Custom Video Hosting

If you want to host your own videos with CDN:

#### 1. **Video Encoding**
Use FFmpeg to create multiple quality levels:

```bash
# 1080p
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 -preset slow \
  -c:a aac -b:a 128k output_1080p.mp4

# 720p
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset slow \
  -c:a aac -b:a 128k output_720p.mp4

# 480p
ffmpeg -i input.mp4 -vf scale=854:480 -c:v libx264 -crf 23 -preset slow \
  -c:a aac -b:a 96k output_480p.mp4

# 360p
ffmpeg -i input.mp4 -vf scale=640:360 -c:v libx264 -crf 23 -preset slow \
  -c:a aac -b:a 64k output_360p.mp4
```

#### 2. **Generate HLS Playlist**
```bash
ffmpeg -i input.mp4 \
  -filter_complex \
  "[0:v]split=4[v1][v2][v3][v4]; \
   [v1]scale=640:360[v1out]; \
   [v2]scale=854:480[v2out]; \
   [v3]scale=1280:720[v3out]; \
   [v4]scale=1920:1080[v4out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 800k \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 1400k \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 2800k \
  -map "[v4out]" -c:v:3 libx264 -b:v:3 5000k \
  -map a:0 -c:a:0 aac -b:a:0 96k \
  -map a:0 -c:a:1 aac -b:a:1 96k \
  -map a:0 -c:a:2 aac -b:a:2 128k \
  -map a:0 -c:a:3 aac -b:a:3 192k \
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3" \
  -master_pl_name master.m3u8 \
  -f hls -hls_time 6 -hls_list_size 0 \
  -hls_segment_filename "v%v/segment_%03d.ts" \
  v%v/playlist.m3u8
```

#### 3. **CDN Setup**

##### Option A: Cloudflare Stream (Easiest)
```javascript
// Upload video to Cloudflare
const response = await fetch(
  'https://api.cloudflare.com/client/v4/accounts/{account_id}/stream',
  {
    method: 'POST',
    headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' },
    body: formData
  }
);

// Use in player
<AdaptivePlayer 
  src="https://customer-{code}.cloudflarestream.com/{video_id}/manifest/video.m3u8"
  poster="https://customer-{code}.cloudflarestream.com/{video_id}/thumbnails/thumbnail.jpg"
/>
```

##### Option B: AWS CloudFront + S3
1. Upload HLS files to S3
2. Create CloudFront distribution
3. Configure S3 bucket as origin
4. Enable CORS headers

```javascript
// Use CDN URL
<AdaptivePlayer 
  src="https://d123.cloudfront.net/videos/movie_id/master.m3u8"
/>
```

##### Option C: Bunny CDN (Budget-friendly)
1. Create pull zone
2. Upload videos to storage zone
3. Videos automatically cached globally

```javascript
<AdaptivePlayer 
  src="https://video.bunnycdn.com/play/{library_id}/{video_guid}"
/>
```

## Benefits of This Architecture

### 1. **Performance**
- ⚡ **Reduced Latency**: CDN serves from nearest location
- 📈 **Scalability**: Handles millions of concurrent users
- 💾 **Cache Hit Rate**: 90%+ of requests served from cache

### 2. **Cost Efficiency**
- 💰 **Bandwidth Savings**: CDN caching reduces origin bandwidth by 80%
- 📊 **Quality Adaptation**: Lower quality for slower connections = less data

### 3. **User Experience**
- 🎯 **No Buffering**: Automatic quality adjustment prevents stalls
- 📱 **Mobile Optimized**: Respects data saver modes
- 🌍 **Global Reach**: Fast playback worldwide

## Implementation in Your App

### Using the Adaptive Player

```tsx
import { AdaptivePlayer } from '@/components/adaptive-player';

// For HLS stream
<AdaptivePlayer 
  src="https://cdn.example.com/video.m3u8"
  poster="https://cdn.example.com/poster.jpg"
  autoPlay={false}
/>

// For iframe (current VidSrc setup)
<iframe 
  src={`https://vidsrc.xyz/embed/movie/${imdbId}`}
  allowFullScreen
/>
```

### Features Available

1. **Quality Selector Dropdown**
   - Auto (adaptive bitrate)
   - 360p, 480p, 720p, 1080p, 4K
   
2. **Custom Controls**
   - Play/Pause
   - Mute/Unmute
   - Fullscreen
   
3. **Network Resilience**
   - Auto-retry on errors
   - Graceful degradation
   - Buffer management

## Monitoring & Analytics

### Key Metrics to Track

1. **Quality Distribution**
   - % of viewers at each quality level
   - Average bitrate delivered

2. **Performance**
   - Start time (time to first frame)
   - Rebuffering ratio
   - Quality switches per session

3. **CDN Stats**
   - Cache hit rate
   - Bandwidth usage
   - Geographic distribution

### Recommended Tools

- **Cloudflare Analytics**: Built-in CDN metrics
- **Google Analytics**: Custom events for quality changes
- **Sentry**: Error tracking for playback issues

## Next Steps

To implement full HLS/CDN setup:

1. ✅ Install HLS.js (Done)
2. ✅ Create adaptive player component (Done)
3. ⏳ Choose CDN provider (Cloudflare recommended)
4. ⏳ Encode videos in multiple qualities
5. ⏳ Upload to CDN/storage
6. ⏳ Update player to use HLS URLs

## Cost Estimates (Monthly)

### Video Hosting + CDN

| Provider | 1TB Bandwidth | 100GB Storage | HLS Transcoding |
|----------|---------------|---------------|-----------------|
| Cloudflare Stream | $5 | Included | Included |
| AWS CloudFront | $85 | $2.30 | Extra |
| Bunny CDN | $10 | $0.50 | Extra |

### Recommended: Bunny CDN + Bunny Stream
- **$15/month** for 1TB bandwidth + HLS encoding
- Best price/performance ratio
- Easy setup, great documentation
