const MovieCard = ({ movie: {title, vote_average, poster_path, release_date, original_language}, onClick }) => {
    return (
        <div className="movie-card cursor-pointer" onClick={onClick}>
            <img 
                src={poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : '/no-movie.png'} 
                alt={title}
                width="342"
                height="513"
                loading="lazy"
            />
            <div className="mt-4">
                <h3 className="text-white">{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="./star.svg" alt="rating icon" width="16" height="16" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span className="text-gray-100">•</span>
                    <p className='lang text-gray-100'>{original_language}</p>
                    <span className="text-gray-100">•</span>
                    <p className='year text-gray-100'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;