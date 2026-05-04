const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className='search'>
            <div className="relative">
                <img src="./search.svg" alt="search image"/>
                <input 
                    type='text'
                    placeholder='Search through thousands of movies'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Search