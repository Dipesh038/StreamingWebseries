import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`),
    ]);

    const movieData = await movieRes.json();
    const tvData = await tvRes.json();

    const movieGenres = (movieData.genres || []).map((g: any) => ({ ...g, type: 'movie' as const }));
    const tvGenres = (tvData.genres || []).map((g: any) => ({ ...g, type: 'tv' as const }));

    return NextResponse.json({ genres: [...movieGenres, ...tvGenres] });
  } catch (e) {
    console.error('Failed to fetch genres:', e);
    return NextResponse.json({ genres: [], error: 'Failed to fetch genres' }, { status: 500 });
  }
}
