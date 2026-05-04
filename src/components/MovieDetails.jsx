import { useEffect, useState } from 'react';
import Spinner from './Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = ({ movieId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${movieId}?append_to_response=videos,credits`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${API_KEY}`
            }
          }
        );
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
    
    // Prevent scrolling on the main page when modal is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [movieId]);

  if (loading) return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
      <Spinner />
    </div>
  );

  const trailer = details?.videos?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-dark-100 max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl border border-white/10 animate-zoomIn hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 z-50 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center border border-white/20"
        >
          ✕
        </button>

        {/* Hero Section: Trailer or Backdrop */}
        <div className="relative w-full aspect-video bg-black">
          {trailer ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&rel=0`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img 
              src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`} 
              alt={details.title} 
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-dark-100 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="px-6 pb-12 -mt-20 relative z-10 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
            <h2 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg">{details.title}</h2>
            <div className="flex items-center gap-3 pb-2">
                <span className="text-green-400 font-bold text-xl">{Math.round(details.vote_average * 10)}% Match</span>
                <span className="text-gray-400 border border-gray-400 px-2 py-0.5 text-xs rounded">{details.release_date?.split('-')[0]}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Description */}
            <div className="lg:col-span-2 space-y-6">
              <p className="text-white text-lg leading-relaxed antialiased">
                {details.overview}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {details.genres?.map(genre => (
                  <span key={genre.id} className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-4 py-1 rounded-full text-sm font-medium">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Cast & Details */}
            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
              <div>
                <h3 className="text-gray-500 text-sm uppercase tracking-widest mb-2 font-bold">Cast</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {details.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}
                </p>
              </div>

              <div>
                <h3 className="text-gray-500 text-sm uppercase tracking-widest mb-2 font-bold">Runtime</h3>
                <p className="text-gray-200 text-sm">{details.runtime} minutes</p>
              </div>

              <div>
                <h3 className="text-gray-500 text-sm uppercase tracking-widest mb-2 font-bold">Production</h3>
                <p className="text-gray-200 text-sm">{details.production_companies?.slice(0, 2).map(p => p.name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;