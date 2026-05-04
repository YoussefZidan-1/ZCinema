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
          { headers: { accept: 'application/json', Authorization: `Bearer ${API_KEY}` } }
        );
        const data = await response.json();
        setDetails(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchFullDetails();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [movieId]);

  if (loading) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <Spinner />
    </div>
  );

  const trailer = details?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative bg-dark-100 max-w-4xl w-full max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl border border-white/10 animate-zoom-in" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-5 right-5 z-50 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-white/20 transition-all flex items-center justify-center">✕</button>

        {/* 1. VIDEO CONTAINER WITH RELATIVE POSITION */}
        <div className="relative aspect-video w-full bg-black">
          {trailer ? (
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&rel=0`} frameBorder="0" allowFullScreen></iframe>
          ) : (
            <img src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`} className="w-full h-full object-cover" />
          )}

          {/* 2. THE GRADIENT OVERLAY (Fades from transparent to the background color) */}
          <div className="absolute inset-0 bg-linear-to-t from-dark-100 via-dark-100/40 to-transparent pointer-events-none" />
        </div>

        {/* 3. CONTENT DIV WITH NEGATIVE MARGIN TO PULL IT UP */}
        <div className="relative px-8 pb-8 -mt-24 z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{details.title}</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded">{Math.round(details.vote_average * 10)}% Score</span>
            <span className="text-gray-300 font-medium">{details.release_date?.split('-')[0]}</span>
            <span className="text-gray-300 font-medium border border-gray-500 px-2 py-0.5 text-xs rounded">HD</span>
            <span className="text-gray-300 font-medium">{details.runtime} min</span>
          </div>

          <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-2xl">{details.overview}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm border-t border-white/10 pt-8">
            <div>
              <h3 className="text-gray-500 uppercase font-bold mb-2 tracking-wider">Cast</h3>
              <p className="text-white/80">{details.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}</p>
            </div>
            <div>
              <h3 className="text-gray-500 uppercase font-bold mb-2 tracking-wider">Genres</h3>
              <p className="text-white/80">{details.genres?.map(g => g.name).join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;