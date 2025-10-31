# API Fallback System

This project uses multiple APIs with automatic fallback to ensure movies always load.

## API Priority Order

### 1. Primary: TMDB (The Movie Database)
- **Usage**: Main source for movie data, posters, and metadata
- **Pros**: Comprehensive data, high-quality posters, free tier
- **Cons**: Rate limits, occasional connection issues

### 2. Secondary: Watchmode API  
- **Usage**: Fallback for popular movies when TMDB fails
- **Pros**: Good coverage, streaming availability data
- **Cons**: Requires API key (free tier available)
- **Get Key**: https://api.watchmode.com

### 3. Tertiary: OMDb API
- **Usage**: Final fallback for search and movie details
- **Pros**: Simple, reliable, works with IMDB IDs
- **Cons**: Limited free tier (1000 requests/day)
- **Get Key**: http://www.omdbapi.com/apikey.aspx

## How It Works

### Popular Movies (`/api/movies/popular`)
1. Tries to fetch from TMDB (3 pages, ~60 movies)
2. If TMDB returns < 20 movies, fetches from Watchmode
3. For each Watchmode movie, gets detailed info from OMDb
4. Returns combined results

### Search (`/api/search`)
1. Searches TMDB first
2. If TMDB fails completely, falls back to OMDb search
3. Returns whichever source succeeds

### Movie Details (`/api/poster`, `/api/episodes`)
- Use TMDB primarily
- Cache results for 1 hour to reduce API calls

## Environment Variables

Add these to your `.env.local`:

```env
# Required
TMDB_API_KEY=your_tmdb_key_here

# Optional (fallbacks will still work with demo keys)
OMDB_API_KEY=your_omdb_key_here
WATCHMODE_API_KEY=your_watchmode_key_here
```

## Getting API Keys

### TMDB (Free)
1. Sign up at https://www.themoviedb.org/
2. Go to Settings → API
3. Copy your API key

### OMDb (Free tier: 1000/day)
1. Go to http://www.omdbapi.com/apikey.aspx
2. Select free tier
3. Verify email
4. Copy your API key

### Watchmode (Free tier: 1000/month)
1. Sign up at https://api.watchmode.com
2. Get your API key from dashboard
3. Free tier includes 1000 requests/month

## Benefits

✅ **Reliability**: If one API is down, others take over  
✅ **No downtime**: Users always see content  
✅ **Rate limit protection**: Spreads load across multiple APIs  
✅ **Cost effective**: Uses free tiers efficiently  
✅ **Fast**: Caches responses for 1 hour  

## Monitoring

Check your deployment logs for these messages:
- `"TMDB returned limited results, fetching from Watchmode..."`
- `"TMDB search failed, trying OMDb fallback"`
- `"OMDb search also failed"` (only in extreme cases)

## Troubleshooting

**No movies loading:**
1. Check if TMDB_API_KEY is set correctly
2. Verify API keys haven't expired
3. Check rate limits on each service

**Slow loading:**
1. Check network connection
2. Consider upgrading API tiers
3. Verify caching is working (1 hour TTL)

**Missing posters:**
- OMDb sometimes returns "N/A" for posters
- System filters these out automatically
- TMDB generally has better poster coverage
