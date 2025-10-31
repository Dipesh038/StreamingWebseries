import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imdbId = searchParams.get('imdbId');
  const type = searchParams.get('type');

  if (!imdbId) {
    return NextResponse.json({ error: 'IMDB ID is required' }, { status: 400 });
  }

  try {
    // Try OMDb first for movie posters
    console.log(`Fetching poster for ${imdbId} from OMDb`);
    const omdbRes = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
    );
    const omdbData = await omdbRes.json();
    
    if (omdbData.Poster && omdbData.Poster !== 'N/A') {
      console.log(`OMDb poster found for ${imdbId}`);
      return NextResponse.json({ posterUrl: omdbData.Poster });
    }

    // Fallback to TMDB if OMDb doesn't have the poster
    console.log(`OMDb poster not found for ${imdbId}, trying TMDB fallback`);
    const res = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    const data = await res.json();
    
    let posterPath = null;
    if (type === 'movie' && data.movie_results && data.movie_results[0]) {
      posterPath = data.movie_results[0].poster_path;
    } else if (type === 'tv' && data.tv_results && data.tv_results[0]) {
      posterPath = data.tv_results[0].poster_path;
    }

    if (posterPath) {
      console.log(`TMDB poster found for ${imdbId}`);
      return NextResponse.json({ posterUrl: `https://image.tmdb.org/t/p/w500${posterPath}` });
    }

    return NextResponse.json({ posterUrl: null });
  } catch (e) {
    console.error('Failed to fetch poster:', e);
    return NextResponse.json({ posterUrl: null, error: 'Failed to fetch poster' }, { status: 500 });
  }
}
