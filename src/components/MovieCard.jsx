import React from 'react';

const MovieCard = ({ movie: {title, vote_average, poster_path, release_date, original_language}, onClick }) => {
    return (
        <div className="movie-card cursor-pointer group" onClick={onClick}>
            <div className="relative overflow-hidden rounded-lg">
                <img 
                    src={poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : '/no-movie.png'} 
                    alt={title}
                    className="transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-white group-hover:text-indigo-400 transition-colors duration-300">{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="./star.svg" alt="rating icon" width="16" height="16" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className='lang'>{original_language}</p>
                    <span>•</span>
                    <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;