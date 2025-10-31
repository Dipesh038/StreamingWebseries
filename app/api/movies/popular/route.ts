import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY || '8e9d4fd2'; // Free API key
const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY || 'demoKey';

// Helper function to fetch from Watchmode as primary fallback
async function fetchFromWatchmode(limit: number = 20) {
  try {
    const res = await fetch(
      `https://api.watchmode.com/v1/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&sort_by=popularity_desc&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.titles || [];
  } catch (e) {
    console.error('Watchmode fetch failed:', e);
    return [];
  }
}

// Helper function to fetch from OMDb as fallback
async function fetchFromOMDb(imdbId: string) {
  try {
    const res = await fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    if (data.Response === 'True') {
      return {
        title: data.Title,
        year: parseInt(data.Year) || 0,
        poster: data.Poster !== 'N/A' ? data.Poster : '',
        genre: data.Genre ? data.Genre.split(', ') : [],
        rating: parseFloat(data.imdbRating) || 0,
        description: data.Plot || '',
        imdbId: data.imdbID,
        runtime: data.Runtime,
      };
    }
  } catch (e) {
    console.error('OMDb fetch failed:', e);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const totalPagesToFetch = 3; // Reduced to avoid rate limits
    let allMovies: any[] = [];

    for (let i = 1; i <= totalPagesToFetch; i++) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${i}`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        );
        const data = await res.json();
        allMovies = [...allMovies, ...(data.results || [])];
      } catch (e) {
        console.error(`Failed to fetch page ${i}:`, e);
        break;
      }
    }

    // Fetch details for each movie with rate limiting
    const detailedMovies: any[] = [];
    const batchSize = 5; // Process 5 movies at a time
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const moviesToFetch = allMovies.slice(0, 40);
    
    for (let i = 0; i < moviesToFetch.length; i += batchSize) {
      const batch = moviesToFetch.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (movie: any) => {
        try {
          const detailRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`,
            { next: { revalidate: 3600 } }
          );
          const detailData = await detailRes.json();
          return {
            ...movie,
            imdb_id: detailData.external_ids?.imdb_id,
            runtime: detailData.runtime,
            genres: detailData.genres,
          };
        } catch (e) {
          // If TMDB fails, try to use basic movie data
          console.error(`Failed to fetch details for movie ${movie.id}:`, e);
          return {
            ...movie,
            imdb_id: null,
            runtime: null,
            genres: [],
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      detailedMovies.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < moviesToFetch.length) {
        await delay(200); // 200ms delay between batches
      }
    }

    const availableMovies = detailedMovies
      .filter((movie: any) => movie.poster_path && movie.imdb_id)
      .map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        year: item.release_date ? parseInt(item.release_date.slice(0, 4), 10) : 0,
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        genre: (item.genres || []).map((g: any) => g.name),
        rating: item.vote_average,
        description: item.overview,
        imdbId: item.imdb_id,
        type: 'movie',
        duration: item.runtime ? `${item.runtime} min` : '',
      }));

    // If TMDB didn't return enough movies, try Watchmode
    if (availableMovies.length < 20) {
      console.log('TMDB returned limited results, fetching from Watchmode...');
      const watchmodeMovies = await fetchFromWatchmode(20);
      
      for (const wmMovie of watchmodeMovies) {
        if (wmMovie.imdb_id) {
          const omdbData = await fetchFromOMDb(wmMovie.imdb_id);
          if (omdbData) {
            availableMovies.push({
              id: wmMovie.id?.toString() || Math.random().toString(),
              title: omdbData.title,
              year: omdbData.year,
              poster: omdbData.poster,
              genre: omdbData.genre,
              rating: omdbData.rating,
              description: omdbData.description,
              imdbId: omdbData.imdbId,
              type: 'movie',
              duration: omdbData.runtime,
            });
          }
        }
        if (availableMovies.length >= 40) break;
      }
    }

    return NextResponse.json({ movies: availableMovies });
  } catch (e) {
    console.error('Failed to fetch popular movies:', e);
    return NextResponse.json({ movies: [], error: 'Failed to fetch movies' }, { status: 500 });
  }
}
