const fetchData = async (searchFor) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "decc9f4d",
            s: searchFor
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async function (event) {
    // to use await, its executing context needs to be async in nature.
    const movies = await fetchData(event.target.value);

    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }

    resultsWrapper.innerHTML = '';

    dropdown.classList.add('is-active');

    for (let movie of movies) {
        const a = document.createElement('a');
        const imgURL = movie.Poster === "N/A" ? "" : movie.Poster;
        a.classList.add('dropdown-item');
        a.innerHTML= `
            <img src="${imgURL}"/>
            ${movie.Title}
        `;
        resultsWrapper.appendChild(a);

        a.addEventListener('click', () => {
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            onMovieSelect(movie)
        })
    }
};

input.addEventListener('input', debounce(onInput));

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    };
})

const onMovieSelect = async movie => {
    const movieID = movie.imdbID;
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "decc9f4d",
            i: movieID
        }
    });
    
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"/>
            </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}
