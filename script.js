const tmdbKey = 'c461b51d1fe04cf2d844e7dd5356c316';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const playBtn = document.getElementById('playBtn');

const getGenres = async () => {
const genreRequestEndpoint = '/genre/movie/list';
const requestParams = `?api_key=${tmdbKey}`;
const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
try {
const response = await fetch(urlToFetch);
if(response.ok) {
    const jsonResponse = await response.json();
   console.log(jsonResponse);
   const genres = jsonResponse.genres;
   console.log(genres);
   return genres;
}
} catch (error){
console.log(error);
}
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
    // tmdb only allow 500 pages as the maximum.
  const randomPage = Math.floor(Math.random() * 500); 
  const discoverMovieEndpoint = '/discover/movie';
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${randomPage}`;
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
    const jsonResponse = await response.json();
   console.log(jsonResponse);
   const movies = jsonResponse.results;
   console.log(movies);
   return movies;
}
  } catch (error) {
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
const movieId = movie.id;
const movieEndpoint = `/movie/${movieId}`;
const requestParams = `?api_key=${tmdbKey}`;
const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
    const movieInfo = await response.json();
   return movieInfo;
}
  } catch (error) {
    console.log(error);
  }
};
// Get Movie cast
const getCast = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}/credits`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      const castInfo = jsonResponse.cast;
      let castName = '<strong>Starring:</strong> ';
      for (let i = 0; i < castInfo.length; i++){
        castName += castInfo[i].name + ', ';
      };
      return castName;
    }; 
  } catch(error){
      console.log(error);
  };
};

// Get Movie Ratings
const getRating = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}&language=en-US&append_to_response=release_dates`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  try{
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      rating = jsonResponse.release_dates.results[0].release_dates[0].certification;
      if (rating === ''){
        return 'Rating: Unrated';
      } else {
        return `Rating: ${rating}`;
      };
    };
  } catch(error){
    console.log(error);
  };
};

// Add movies liked by user to a list
const addToLikedMovies = (movieInfo) => {
  let likedMovies = '';
  likedMovies += movieInfo + (', ');
  displayLikedMovies(likedMovies);
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  const movies = await getMovies();
  const randomMovie = await getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  const cast = await getCast(randomMovie);
  const rating = await getRating(randomMovie);
  displayMovie(info, cast, rating);;
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;