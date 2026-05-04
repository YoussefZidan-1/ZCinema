import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // Now fully handled
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies. Please check your network or API key.');
      }

      const data = await response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movie/popular?language=en-US&page=1`, API_OPTIONS);
      const data = await response.json();
      setPopularMovies(data.results.slice(0, 10) || []);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const trending = await getTrendingMovies();
      setTrendingMovies(trending);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
    fetchPopularMovies();
  }, []);
  
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.webp" alt="Hero Banner" width="1000" height="400" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Error Message Display */}
        {errorMessage && (
           <div className="mt-10 bg-red-500/10 border border-red-500/50 p-4 rounded-lg">
             <p className="text-red-500 text-center">{errorMessage}</p>
           </div>
        )}

        {!searchTerm && !errorMessage && (
          <>
            {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id} className="cursor-pointer" onClick={() => setSelectedMovieId(movie.movie_id)}>
                        <p>{index + 1}</p>
                        <img src={movie.poster_url} alt={movie.searchTerm} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {popularMovies.length > 0 && (
              <section className="popular-shelf mt-12">
                <h2 className="mb-6">Global Popular Hits</h2>
                <div className="shelf-container">
                  {popularMovies.map((movie) => (
                    <div 
                      key={movie.id} 
                      className="shelf-item group"
                      onClick={() => setSelectedMovieId(movie.id)}
                    >
                      <div className="shelf-card">
                        <img 
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                          alt={movie.title} 
                        />
                        <div className="shelf-overlay">
                            <span className="text-white text-xs font-bold line-clamp-1">{movie.title}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className="all-movies">
          <h2 className="mt-10">{searchTerm ? `Search Results for "${searchTerm}"` : 'Discover More'}</h2>

          {isLoading ? (
            <Spinner/>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovieId(movie.id)} />
              ))}
            </ul>
          )}
        </section>
      </div>

      {selectedMovieId && (
        <MovieDetails movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}
    </main>
  );
};

export default App;