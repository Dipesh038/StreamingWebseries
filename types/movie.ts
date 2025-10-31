export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  genre: string[];
  rating: number;
  description: string;
  imdbId: string;
  tmdbId?: string;
  type: 'movie' | 'tv';
  duration?: string;
  seasons?: number;
  episodes?: number;
  quality?: '4K' | '1080p' | '720p';
}

export interface TVShow extends Movie {
  type: 'tv';
  seasons: number;
  episodes: number;
  currentSeason?: number;
  currentEpisode?: number;
}

// Generate extensive movie and TV show database
const generateMovieDatabase = (): Movie[] => {
  const movies: Movie[] = [];
  let id = 1;

  // Popular Movies (Real IMDB IDs)
  const popularMovies = [
    { title: 'The Shawshank Redemption', year: 1994, imdbId: 'tt0111161', rating: 9.3, genre: ['Drama'], duration: '2h 22min', description: 'Over the course of several years, two convicts form a friendship, seeking consolation and eventual redemption through basic compassion.', poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
    { title: 'The Godfather', year: 1972, imdbId: 'tt0068646', rating: 9.2, genre: ['Crime', 'Drama'], duration: '2h 55min', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { title: 'The Dark Knight', year: 2008, imdbId: 'tt0468569', rating: 9.0, genre: ['Action', 'Crime', 'Drama'], duration: '2h 32min', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { title: 'Pulp Fiction', year: 1994, imdbId: 'tt0110912', rating: 8.9, genre: ['Crime', 'Drama'], duration: '2h 34min', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
    { title: 'Forrest Gump', year: 1994, imdbId: 'tt0109830', rating: 8.8, genre: ['Drama', 'Romance'], duration: '2h 22min', description: 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other history unfold through the perspective of an Alabama man.', poster: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg' },
    { title: 'Inception', year: 2010, imdbId: 'tt1375666', rating: 8.8, genre: ['Action', 'Sci-Fi', 'Thriller'], duration: '2h 28min', description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg' },
    { title: 'Fight Club', year: 1999, imdbId: 'tt0137523', rating: 8.8, genre: ['Drama'], duration: '2h 19min', description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.', poster: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg' },
    { title: 'The Matrix', year: 1999, imdbId: 'tt0133093', rating: 8.7, genre: ['Action', 'Sci-Fi'], duration: '2h 16min', description: 'A computer programmer discovers that reality as he knows it is a simulation controlled by cyber-intelligence.', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { title: 'Goodfellas', year: 1990, imdbId: 'tt0099685', rating: 8.7, genre: ['Biography', 'Crime', 'Drama'], duration: '2h 26min', description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen.', poster: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003, imdbId: 'tt0167260', rating: 9.0, genre: ['Action', 'Adventure', 'Drama'], duration: '3h 21min', description: 'Gandalf and Aragorn lead the World of Men against Saurons army to draw his gaze from Frodo and Sam.', poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' },
    { title: 'Interstellar', year: 2014, imdbId: 'tt0816692', rating: 8.6, genre: ['Adventure', 'Drama', 'Sci-Fi'], duration: '2h 49min', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.' },
    { title: 'Parasite', year: 2019, imdbId: 'tt6751668', rating: 8.5, genre: ['Comedy', 'Drama', 'Thriller'], duration: '2h 12min', description: 'A poor family schemes to become employed by a wealthy family by infiltrating their household.' },
    { title: 'Joker', year: 2019, imdbId: 'tt7286456', rating: 8.4, genre: ['Crime', 'Drama', 'Thriller'], duration: '2h 2min', description: 'A mentally troubled comedian is disregarded and mistreated by society, he embarks on a downward spiral of revolution.' },
    { title: 'Avengers: Endgame', year: 2019, imdbId: 'tt4154796', rating: 8.4, genre: ['Action', 'Adventure', 'Drama'], duration: '3h 1min', description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos actions.' },
    { title: 'Spider-Man: No Way Home', year: 2021, imdbId: 'tt10872600', rating: 8.2, genre: ['Action', 'Adventure', 'Fantasy'], duration: '2h 28min', description: 'With Spider-Mans identity revealed, Peter asks Doctor Strange for help, but the spell goes wrong.' },
    { title: 'Top Gun: Maverick', year: 2022, imdbId: 'tt1745960', rating: 8.3, genre: ['Action', 'Drama'], duration: '2h 11min', description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.' },
    { title: 'Dune', year: 2021, imdbId: 'tt1160419', rating: 8.0, genre: ['Action', 'Adventure', 'Drama'], duration: '2h 35min', description: 'A noble family becomes embroiled in a war for control over the galaxys most valuable asset.' },
    { title: 'No Time to Die', year: 2021, imdbId: 'tt2382320', rating: 7.3, genre: ['Action', 'Adventure', 'Thriller'], duration: '2h 43min', description: 'James Bond has left active service, but his peace is short-lived when his old friend Felix Leiter asks for help.' },
    { title: 'The Batman', year: 2022, imdbId: 'tt1877830', rating: 7.8, genre: ['Action', 'Crime', 'Drama'], duration: '2h 56min', description: 'Batman ventures into Gotham Citys underworld when a sadistic killer leaves behind a trail of cryptic clues.' },
    { title: 'Black Panther', year: 2018, imdbId: 'tt1825683', rating: 7.3, genre: ['Action', 'Adventure', 'Sci-Fi'], duration: '2h 14min', description: 'TChalla, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people.' },
    { title: 'Oppenheimer', year: 2023, imdbId: 'tt15398776', rating: 8.4, genre: ['Biography', 'Drama', 'History'], duration: '3h 0min', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
    { title: 'Barbie', year: 2023, imdbId: 'tt1517268', rating: 6.9, genre: ['Adventure', 'Comedy', 'Fantasy'], duration: '1h 54min', description: 'Barbie and Ken are having the time of their lives in the colorful world of Barbie Land.' },
    { title: 'John Wick', year: 2014, imdbId: 'tt2911666', rating: 7.4, genre: ['Action', 'Crime', 'Thriller'], duration: '1h 41min', description: 'An ex-hitman comes out of retirement to track down the gangsters that took everything from him.' },
    { title: 'Mad Max: Fury Road', year: 2015, imdbId: 'tt1392190', rating: 8.1, genre: ['Action', 'Adventure', 'Sci-Fi'], duration: '2h 0min', description: 'In a post-apocalyptic wasteland, Max teams up with a mysterious woman to flee from a tyrannical warlord.' },
    { title: 'Blade Runner 2049', year: 2017, imdbId: 'tt1856101', rating: 8.0, genre: ['Action', 'Drama', 'Mystery'], duration: '2h 44min', description: 'A young blade runner discovers a secret that leads him to find Rick Deckard, missing for thirty years.' },
    // Additional TMDB movies
    { title: 'The Godfather: Part II', year: 1974, imdbId: 'tt0071562', rating: 9.0, genre: ['Crime', 'Drama'], duration: '3h 22min', description: 'The early life and career of Vito Corleone in 1920s New York is portrayed, while his son expands and tightens his grip on the family crime syndicate.', poster: 'https://image.tmdb.org/t/p/w500/amvmeQWheahG3StKwIE1f7jRnkZ.jpg' },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, imdbId: 'tt0120737', rating: 8.8, genre: ['Action', 'Adventure', 'Drama'], duration: '2h 58min', description: 'A meek Hobbit and eight companions set out on a journey to destroy the One Ring and the Dark Lord Sauron.', poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg' },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002, imdbId: 'tt0167261', rating: 8.7, genre: ['Action', 'Adventure', 'Drama'], duration: '2h 59min', description: 'While Frodo and Sam edge closer to Mordor with the help of Gollum, the divided fellowship makes a stand against Sauron\'s new ally, Saruman.', poster: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg' },
    { title: 'Se7en', year: 1995, imdbId: 'tt0114369', rating: 8.6, genre: ['Crime', 'Drama', 'Mystery'], duration: '2h 7min', description: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.', poster: 'https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg' },
    { title: 'The Silence of the Lambs', year: 1991, imdbId: 'tt0102926', rating: 8.6, genre: ['Crime', 'Drama', 'Thriller'], duration: '1h 58min', description: 'A young F.B.I. cadet must confide in an incarcerated and manipulative killer to catch another serial killer.', poster: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg' },
    { title: 'Saving Private Ryan', year: 1998, imdbId: 'tt0120815', rating: 8.6, genre: ['Drama', 'War'], duration: '2h 49min', description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.', poster: 'https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg' },
    { title: 'The Green Mile', year: 1999, imdbId: 'tt0120689', rating: 8.6, genre: ['Crime', 'Drama', 'Fantasy'], duration: '3h 9min', description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.', poster: 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg' },
    { title: 'Gladiator', year: 2000, imdbId: 'tt0172495', rating: 8.5, genre: ['Action', 'Adventure', 'Drama'], duration: '2h 35min', description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg' },
    { title: 'The Prestige', year: 2006, imdbId: 'tt0482571', rating: 8.5, genre: ['Drama', 'Mystery', 'Sci-Fi'], duration: '2h 10min', description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.', poster: 'https://image.tmdb.org/t/p/w500/5MXyQfz8xUP3dIFPTubhTsbFY6N.jpg' },
    { title: 'The Departed', year: 2006, imdbId: 'tt0407887', rating: 8.5, genre: ['Crime', 'Drama', 'Thriller'], duration: '2h 31min', description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.', poster: 'https://image.tmdb.org/t/p/w500/jyAleeq4LzNj6tWQ8gRSlaAR5EK.jpg' },
  ];

  // Popular TV Series (Real IMDB IDs)
  const popularSeries = [
    { title: 'Breaking Bad', year: 2008, imdbId: 'tt0903747', rating: 9.5, genre: ['Crime', 'Drama', 'Thriller'], seasons: 5, episodes: 62, description: 'A chemistry teacher diagnosed with cancer teams up with a former student to cook crystal meth.' },
    { title: 'Game of Thrones', year: 2011, imdbId: 'tt0944947', rating: 9.2, genre: ['Action', 'Adventure', 'Drama'], seasons: 8, episodes: 73, description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.' },
    { title: 'Stranger Things', year: 2016, imdbId: 'tt4574334', rating: 8.7, genre: ['Drama', 'Fantasy', 'Horror'], seasons: 4, episodes: 42, description: 'When a young boy disappears, supernatural forces are revealed as a town uncovers a government conspiracy.' },
    { title: 'Death Note', year: 2006, imdbId: 'tt0877057', rating: 9.0, genre: ['Animation', 'Crime', 'Drama'], seasons: 1, episodes: 37, description: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it.', poster: 'https://image.tmdb.org/t/p/w500/4MoypKQEOHTpoI7hJYJ8pG9uJp6.jpg' },
    { title: 'Attack on Titan', year: 2013, imdbId: 'tt2560140', rating: 9.0, genre: ['Animation', 'Action', 'Adventure'], seasons: 4, episodes: 87, description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger joins the Survey Corps to fight gigantic man-eating humanoids called Titans.', poster: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg' },
    { title: 'Fullmetal Alchemist: Brotherhood', year: 2009, imdbId: 'tt1355642', rating: 9.1, genre: ['Animation', 'Action', 'Adventure'], seasons: 1, episodes: 64, description: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.', poster: 'https://image.tmdb.org/t/p/w500/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg' },
    { title: 'One Punch Man', year: 2015, imdbId: 'tt4508902', rating: 8.7, genre: ['Animation', 'Action', 'Comedy'], seasons: 2, episodes: 24, description: 'The story of Saitama, a hero who can defeat any opponent with a single punch, but seeks meaning in his life.', poster: 'https://image.tmdb.org/t/p/w500/iKjD18m4F3c7OqJ43zU8gJ8T9gV.jpg' },
    { title: 'The Crown', year: 2016, imdbId: 'tt4786824', rating: 8.6, genre: ['Biography', 'Drama', 'History'], seasons: 6, episodes: 60, description: 'Follows the political rivalries and romance of Queen Elizabeth IIs reign and the events that shaped Britain.' },
    { title: 'The Mandalorian', year: 2019, imdbId: 'tt8111088', rating: 8.7, genre: ['Action', 'Adventure', 'Fantasy'], seasons: 3, episodes: 24, description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.' },
    { title: 'House of Cards', year: 2013, imdbId: 'tt1856010', rating: 8.7, genre: ['Drama'], seasons: 6, episodes: 73, description: 'A congressman works with his equally conniving wife to exact revenge on the people who betrayed him.' },
    { title: 'The Witcher', year: 2019, imdbId: 'tt5180504', rating: 8.2, genre: ['Action', 'Adventure', 'Drama'], seasons: 3, episodes: 24, description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people prove more wicked than beasts.' },
    { title: 'Wednesday', year: 2022, imdbId: 'tt13443470', rating: 8.1, genre: ['Comedy', 'Horror', 'Mystery'], seasons: 1, episodes: 8, description: 'Follows Wednesday Addams years as a student at Nevermore Academy.' },
    { title: 'The Bear', year: 2022, imdbId: 'tt14452776', rating: 8.7, genre: ['Comedy', 'Drama'], seasons: 3, episodes: 28, description: 'A young chef from the fine dining world returns to Chicago to run his familys Italian beef shop.' },
    { title: 'Squid Game', year: 2021, imdbId: 'tt10919420', rating: 8.0, genre: ['Action', 'Drama', 'Mystery'], seasons: 2, episodes: 17, description: 'Hundreds of cash-strapped players accept an invitation to compete in deadly childrens games for a tempting prize.' },
    { title: 'The Office', year: 2005, imdbId: 'tt0386676', rating: 9.0, genre: ['Comedy'], seasons: 9, episodes: 201, description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes and inappropriate behavior.' },
    { title: 'Friends', year: 1994, imdbId: 'tt0108778', rating: 8.9, genre: ['Comedy', 'Romance'], seasons: 10, episodes: 236, description: 'Follows the personal and professional lives of six twenty to thirty-something friends living in Manhattan.' },
    { title: 'The Sopranos', year: 1999, imdbId: 'tt0141842', rating: 9.2, genre: ['Crime', 'Drama'], seasons: 6, episodes: 86, description: 'New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life.' },
    { title: 'Better Call Saul', year: 2015, imdbId: 'tt3110726', rating: 8.9, genre: ['Crime', 'Drama'], seasons: 6, episodes: 63, description: 'The trials and tribulations of criminal lawyer Jimmy McGill in the time before he established his strip-mall law office.' },
    { title: 'Westworld', year: 2016, imdbId: 'tt0475784', rating: 8.6, genre: ['Drama', 'Mystery', 'Sci-Fi'], seasons: 4, episodes: 36, description: 'At the intersection of the near future and the reimagined past, waits a world in which every human appetite can be indulged.' },
    { title: 'The Last of Us', year: 2023, imdbId: 'tt3581920', rating: 8.7, genre: ['Action', 'Adventure', 'Drama'], seasons: 1, episodes: 9, description: 'Twenty years after a pandemic destroys civilization, a hardened survivor and an immune teenager navigate a post-apocalyptic America.' },
    { title: 'House of the Dragon', year: 2022, imdbId: 'tt11198330', rating: 8.4, genre: ['Action', 'Adventure', 'Drama'], seasons: 2, episodes: 18, description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys.' },
    { title: 'Euphoria', year: 2019, imdbId: 'tt8772296', rating: 8.4, genre: ['Drama'], seasons: 2, episodes: 18, description: 'A look at life for a group of high school students as they grapple with issues of drugs, sex, and violence.' },
    { title: 'Money Heist', year: 2017, imdbId: 'tt6468322', rating: 8.2, genre: ['Action', 'Crime', 'Mystery'], seasons: 5, episodes: 41, description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.' },
    { title: 'Ozark', year: 2017, imdbId: 'tt5071412', rating: 8.4, genre: ['Crime', 'Drama', 'Thriller'], seasons: 4, episodes: 44, description: 'A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.' }
  ];

  // Add popular movies
  popularMovies.forEach(movie => {
    const poster = movie.poster || `https://images.unsplash.com/photo-${1440404653325 + id}?w=300&h=450&fit=crop&auto=format`;
    const qualities = ['4K', '1080p', '720p'] as const;
    const quality: '4K' | '1080p' | '720p' = qualities[Math.floor(Math.random() * qualities.length)];
    movies.push({
      id: id.toString(),
      title: movie.title,
      year: movie.year,
      poster,
      genre: movie.genre,
      rating: movie.rating,
      description: movie.description,
      imdbId: movie.imdbId,
      type: 'movie',
      duration: movie.duration,
      quality
    });
    id++;
  });

  // Add popular series
  popularSeries.forEach(series => {
    const poster = `https://images.unsplash.com/photo-${1440404653325 + id}?w=300&h=450&fit=crop&auto=format`;
    const qualities = ['4K', '1080p', '720p'] as const;
    const quality: '4K' | '1080p' | '720p' = qualities[Math.floor(Math.random() * qualities.length)];
    movies.push({
      id: id.toString(),
      title: series.title,
      year: series.year,
      poster,
      genre: series.genre,
      rating: series.rating,
      description: series.description,
      imdbId: series.imdbId,
      type: 'tv',
      seasons: series.seasons,
      episodes: series.episodes,
      quality
    });
    id++;
  });

  // Generate additional content to reach 1000+ items
  const genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'];
  const moviePrefixes = ['The', 'Dark', 'Last', 'Final', 'Secret', 'Hidden', 'Lost', 'Forbidden', 'Ancient', 'Eternal', 'Silent', 'Broken', 'Rising', 'Fallen', 'Golden', 'Shadow', 'Blood', 'Fire', 'Ice', 'Storm'];
  const movieSuffixes = ['Legacy', 'Chronicles', 'Awakening', 'Revolution', 'Redemption', 'Destiny', 'Origins', 'Empire', 'Kingdom', 'Prophecy', 'War', 'Battle', 'Quest', 'Journey', 'Adventure', 'Mystery', 'Secret', 'Code', 'Files', 'Protocol'];

  // Generate additional movies (reaching 1000+)
  for (let i = 0; i < 500; i++) {
    const prefix = moviePrefixes[Math.floor(Math.random() * moviePrefixes.length)];
    const suffix = movieSuffixes[Math.floor(Math.random() * movieSuffixes.length)];
    const title = `${prefix} ${suffix}`;
    const year = 2010 + Math.floor(Math.random() * 14);
    const rating = 6.0 + Math.random() * 3.5;
    const selectedGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 2));
    const duration = `${1 + Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 60)}min`;
    const poster = `https://images.unsplash.com/photo-${1440404653325 + id}?w=300&h=450&fit=crop&auto=format`;
    const qualities = ['4K', '1080p', '720p'] as const;
    const quality: '4K' | '1080p' | '720p' = qualities[Math.floor(Math.random() * qualities.length)];
    
    movies.push({
      id: id.toString(),
      title,
      year,
      poster,
      genre: selectedGenres,
      rating: Math.round(rating * 10) / 10,
      description: `An epic ${selectedGenres[0].toLowerCase()} film that takes viewers on an unforgettable journey through ${title.toLowerCase()}.`,
      imdbId: `tt${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      type: 'movie',
      duration,
      quality
    });
    id++;
  }

  // Generate additional TV series (reaching 1000+)
  for (let i = 0; i < 500; i++) {
    const prefix = moviePrefixes[Math.floor(Math.random() * moviePrefixes.length)];
    const suffix = movieSuffixes[Math.floor(Math.random() * movieSuffixes.length)];
    const title = `${prefix} ${suffix}`;
    const year = 2010 + Math.floor(Math.random() * 14);
    const rating = 6.0 + Math.random() * 3.5;
    const selectedGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 2));
    const seasons = 1 + Math.floor(Math.random() * 8);
    const episodes = seasons * (8 + Math.floor(Math.random() * 16));
    const poster = `https://images.unsplash.com/photo-${1440404653325 + id}?w=300&h=450&fit=crop&auto=format`;
    const qualities = ['4K', '1080p', '720p'] as const;
    const quality: '4K' | '1080p' | '720p' = qualities[Math.floor(Math.random() * qualities.length)];
    
    movies.push({
      id: id.toString(),
      title,
      year,
      poster,
      genre: selectedGenres,
      rating: Math.round(rating * 10) / 10,
      description: `A captivating ${selectedGenres[0].toLowerCase()} series that follows the incredible story of ${title.toLowerCase()}.`,
      imdbId: `tt${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      type: 'tv',
      seasons,
      episodes,
      quality
    });
    id++;
  }

  console.log(`Generated ${movies.length} movies and TV shows`);
  return movies;
};

export const movieDatabase = generateMovieDatabase();

// Helper function to check if poster URL is valid
const hasValidPoster = (item: Movie) => {
  // Allow all posters that start with http/https (includes TMDB and Unsplash)
  return item.poster && 
         item.poster.trim() !== '' && 
         item.poster.trim() !== 'N/A' &&
         (item.poster.startsWith('https://') || item.poster.startsWith('http://'));
};

// Filter functions for different sections - all now filter out invalid posters
export const getMovies = () => movieDatabase
  .filter(item => item.type === 'movie' && hasValidPoster(item))
  .sort((a, b) => b.year - a.year)
  .slice(0, 50);

export const getSeries = () => movieDatabase
  .filter(item => item.type === 'tv' && hasValidPoster(item))
  .sort((a, b) => b.year - a.year)
  .slice(0, 50);

export const get4KContent = () => movieDatabase
  .filter(item => item.quality === '4K' && hasValidPoster(item))
  .slice(0, 50);

export const getTrendingContent = () => movieDatabase
  .filter(item => item.type === 'movie' && item.rating > 8 && hasValidPoster(item))
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 50);

export const getTopRated = () => movieDatabase
  .filter(item => hasValidPoster(item))
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 100);

export const getTop50WithPoster = () => movieDatabase
  .filter(item => item.type === 'movie' && hasValidPoster(item))
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 50);
