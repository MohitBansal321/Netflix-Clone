window.onload = () => {
    getOriginals()
    getTrendingNow()
    getTopRated()
  }
  function fetchMovies(url, dom_element, path_type) {
      fetch(url)
        .then(Response=>Response.json())
        .then(data=>showMovies(data,dom_element,path_type))
        .catch(error=>{
          console.log(error)
        })
  }
  showMovies = (movies, dom_element, path_type) => {
  
      var moviesEl=document.querySelector(dom_element)
     for(let movie of movies.results){
       let imageElement=document.createElement('img');
       imageElement.setAttribute('data-id',movie.id);          
       imageElement.src= 
        `https://image.tmdb.org/t/p/original${movie[path_type]}`;
       imageElement.addEventListener('click',e=>{
         handleMovieSelection(e)
       })
       moviesEl.appendChild(imageElement)
     }
    }
  function getOriginals() {
    const URL='https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213'
    fetchMovies(URL,'.original__movies','poster_path',)
  }
  function getTrendingNow() {
    const URL='https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'
    fetchMovies(URL,'#trending','backdrop_path')
  }
  function getTopRated() {
      const URL='https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'
    fetchMovies(URL,'#top_rated','backdrop_path')
  }
  async function getMovieTrailer(id) {
    let URL=`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
    return await fetch(URL)
    .then(response=>{
      if(response.ok){
        return response.json();
      }
      else{
        throw new Error('something went wrong')
      }
    });
  }
  const setTrailer = trailers => {
    const iframe=document.getElementById('movieTrailer')
    const movieNotFound=document.querySelector('.movieNotFound')
    if (trailers.length > 0) {
      movieNotFound.classList.add('d-none')
      iframe.classList.remove('d-none')
      iframe.src=`https://www.youtube.com/embed/${trailers[0].key}`
    } else {
      iframe.classList.add('d-none')
      movieNotFound.classList.remove('d-none')
    }
  }
  const handleMovieSelection = e => {
    const id = e.target.getAttribute('data-id')
    const iframe = document.getElementById('movieTrailer')
    getMovieTrailer(id).then(data => {
      const results = data.results
      const youtubeTrailers = results.filter(result => {
        if (result.site == 'YouTube' && result.type == 'Trailer') {
          return true
        } else {
          return false
        }
      })
      setTrailer(youtubeTrailers)
    })
  
    // open modal
    $('#trailerModal').modal('show')
    // we need to call the api with the ID
  }
  
  
  
  
  