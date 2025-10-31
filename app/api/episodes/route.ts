import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imdbId = searchParams.get('imdbId');
  const seasonParam = searchParams.get('season');
  const season = seasonParam ? parseInt(seasonParam, 10) : 1;

  if (!imdbId || isNaN(season)) {
    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
  }

  try {
    // 1. Find the TMDB ID using the IMDB ID
    const findRes = await fetch(`${TMDB_API_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
    if (!findRes.ok) {
      console.error(`Failed to find TMDB ID for IMDB ID ${imdbId}:`, findRes.statusText);
      return NextResponse.json({ episodes: [], error: 'Failed to find show on TMDB' }, { status: 404 });
    }
    const findData = await findRes.json();
    const showResult = findData.tv_results?.[0];

    if (!showResult) {
      return NextResponse.json({ episodes: [], error: 'TV show not found on TMDB' }, { status: 404 });
    }
    const tmdbId = showResult.id;

    // 2. Fetch season details from TMDB
    const seasonRes = await fetch(`${TMDB_API_URL}/tv/${tmdbId}/season/${season}?api_key=${TMDB_API_KEY}`);
    if (!seasonRes.ok) {
      // If the season doesn't exist, TMDB returns a 404. We'll return an empty list.
      if (seasonRes.status === 404) {
        return NextResponse.json({ episodes: [] });
      }
      console.error(`Failed to fetch season details for TMDB ID ${tmdbId}, Season ${season}:`, seasonRes.statusText);
      return NextResponse.json({ episodes: [], error: 'Failed to fetch season details' }, { status: 500 });
    }
    const seasonData = await seasonRes.json();

    // 3. Map the TMDB episode data to our Episode type
    const episodes = (seasonData.episodes || []).map((ep: any) => ({
      id: ep.id.toString(),
      number: ep.episode_number,
      title: ep.name || `Episode ${ep.episode_number}`,
      description: ep.overview || `Description for Episode ${ep.episode_number}.`,
    }));

    return NextResponse.json({ episodes });

  } catch (error) {
    console.error('Error fetching episodes from TMDB:', error);
    return NextResponse.json({ episodes: [], error: 'An internal error occurred' }, { status: 500 });
  }
} 