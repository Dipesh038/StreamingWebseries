import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY || '8e9d4fd2';

// Fallback search using OMDb
async function searchOMDb(query: string) {
  try {
    const res = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    if (data.Response === 'True' && data.Search) {
      return data.Search.map((item: any) => ({
        id: item.imdbID,
        title: item.Title,
        year: parseInt(item.Year) || 0,
        poster: item.Poster !== 'N/A' ? item.Poster : '',
        genre: [item.Type === 'movie' ? 'Movie' : 'TV Series'],
        rating: 0,
        description: '',
        imdbId: item.imdbID,
        type: item.Type === 'movie' ? 'movie' : 'tv',
      }));
    }
  } catch (e) {
    console.error('OMDb search failed:', e);
  }
  return [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search TMDB for movies and TV shows with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    const searchData = await searchRes.json();
    const searchItems = (searchData.results || [])
      .filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
      .slice(0, 10); // Reduced from 20 to 10 for faster processing

    // Fetch details to get imdb_id with rate limiting
    const itemsWithDetails: any[] = [];
    const batchSize = 3; // Process 3 items at a time
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < searchItems.length; i += batchSize) {
      const batch = searchItems.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (item: any) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per item
          
          const detailRes = await fetch(
            `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`,
            { signal: controller.signal, next: { revalidate: 3600 } }
          );
          clearTimeout(timeoutId);
          
          if (!detailRes.ok) {
            console.error(`Failed to fetch details for ${item.id}: ${detailRes.status}`);
            return null;
          }
          
          const detailData = await detailRes.json();
          return { ...item, ...detailData };
        } catch (e) {
          console.error(`Error fetching details for ${item.id}:`, e);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      itemsWithDetails.push(...batchResults.filter(item => item !== null));
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < searchItems.length) {
        await delay(300); // 300ms delay between batches
      }
    }

    // Map to our app's Movie type
    const availableItems = itemsWithDetails
      .filter((item: any) => item.external_ids?.imdb_id)
      .map((item: any) => ({
        id: item.external_ids.imdb_id, // Use imdbId as the main ID for consistency
        title: item.title || item.name,
        year: item.release_date
          ? parseInt(item.release_date.slice(0, 4), 10)
          : item.first_air_date
          ? parseInt(item.first_air_date.slice(0, 4), 10)
          : 0,
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        genre: (item.genres || []).map((g: any) => g.name),
        rating: item.vote_average,
        description: item.overview,
        imdbId: item.external_ids.imdb_id,
        type: item.media_type,
        duration: item.runtime ? `${item.runtime} min` : undefined,
        seasons: item.number_of_seasons,
      }));

    return NextResponse.json({ results: availableItems });
  } catch (e) {
    console.error('TMDB search failed, trying OMDb fallback:', e);
    
    // Try OMDb as fallback
    try {
      const omdbResults = await searchOMDb(query);
      return NextResponse.json({ results: omdbResults });
    } catch (omdbError) {
      console.error('OMDb search also failed:', omdbError);
      return NextResponse.json({ results: [], error: 'All search methods failed' }, { status: 500 });
    }
  }
}
