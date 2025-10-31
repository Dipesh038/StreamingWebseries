# API Security Changes

This document outlines the changes made to hide API endpoints and keys from the browser's network tab.

## Changes Made

### 1. Environment Variables (`.env.local`)
- Created `.env.local` file to store TMDB API key server-side only
- The key is now `TMDB_API_KEY` (without `NEXT_PUBLIC_` prefix)
- This ensures the key is never exposed to the client browser
- ⚠️ **Important**: Never commit `.env.local` to Git (already in `.gitignore`)

### 2. New Server-Side API Routes

Created the following API routes that run on your server:

- **`/api/search`** - Handles movie/TV show search (replaces direct TMDB search calls)
- **`/api/movies/popular`** - Fetches popular movies (replaces direct TMDB popular endpoint)
- **`/api/genres`** - Fetches movie and TV genres (replaces direct TMDB genre calls)
- **`/api/poster`** - Fetches poster images by IMDB ID (replaces direct TMDB find calls)
- **`/api/episodes`** - Already existed, updated to use server-side env variable

### 3. Client-Side Updates

Modified `app/page.tsx` to:
- Replace all direct TMDB API calls with calls to our API routes
- Remove hardcoded API keys from client code
- Use `/api/*` endpoints instead of `https://api.themoviedb.org/*`

Modified `components/video-card.tsx` to:
- Use `/api/poster` endpoint instead of direct TMDB calls
- Remove hardcoded API key

### 4. Security Middleware

Created `middleware.ts` to add security headers to all API routes:
- Prevents search engines from indexing API endpoints
- Adds cache control headers to prevent caching of API responses

## What Users Will See in Network Tab

**Before:**
```
https://api.themoviedb.org/3/search/multi?api_key=YOUR_KEY&query=...
https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY&page=1
```

**After:**
```
/api/search?query=...
/api/movies/popular
/api/genres
/api/poster?imdbId=...&type=...
```

## Benefits

✅ API keys are completely hidden from browser  
✅ External API endpoints are obscured  
✅ Users can't see which third-party services you're using  
✅ Prevents API key theft and abuse  
✅ Centralized API calls make it easier to add rate limiting later  
✅ Can switch API providers without changing client code  

## Deployment Notes

When deploying to production (Vercel, Netlify, etc.):

1. Add `TMDB_API_KEY` to your deployment platform's environment variables
2. Never expose the `.env.local` file
3. The API routes will automatically use the server-side environment variable

## VidSrc Embedding

The video player still uses VidSrc directly via iframe embedding:
```
https://vidsrc.xyz/embed/movie/[imdbId]
https://vidsrc.xyz/embed/tv/[imdbId]/[season]/[episode]
```

This is visible in the network tab but is necessary for iframe embedding. The VidSrc service is free and doesn't require authentication, so this is acceptable.
