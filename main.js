const autocompleteConfig = {
    renderOption(m) {
        const imgURL = m.Poster === "N/A" ? "" : m.Poster;
        return `
            <img src="${imgURL}"/>  
            ${m.Title} (${m.Year})
        `;
    },


    inputValue(m) {
        return m.Title;
    },

    async fetchData(searchFor) {
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
}


createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(m) {
        onSelect(m, document.querySelector('#left-summary'), 'left');
        document.querySelector('.tutorial').classList.add('is-hidden');
    },
});

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(m) {
        onSelect(m, document.querySelector('#right-summary'), 'right');
        document.querySelector('.tutorial').classList.add('is-hidden');
    },
});


let leftMovie, rightMovie;
const onSelect = async (select, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "decc9f4d",
            i: select.imdbID
        }
    });

    if (response.data.Type === "series") {
        summaryElement.innerHTML = serieTemplate(response.data);
    } else {
        summaryElement.innerHTML = movieTemplate(response.data);
    }

    if (side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];  // get left and rightstats together

        const leftValue = parseFloat(leftStat.dataset.value);
        const rightValue = parseFloat(rightStat.dataset.value);

        if (rightValue > leftValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = (movieDetail) => {
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0)

    if (movieDetail.BoxOffice) {
        var amount = parseInt(
            movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
        );
    }
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

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

            <article data-value=${awards} class="notification is-primary">
                <p class="title">${movieDetail.Awards}</p>
                <p class="subtitle">Awards</p>
            </article>

            <article data-value=${amount} class="notification is-primary">
                <p class="title">${movieDetail.BoxOffice}</p>
                <p class="subtitle">Box Office</p>
            </article>

            <article data-value=${metascore} class="notification is-primary">
                <p class="title">${movieDetail.Metascore}</p>
                <p class="subtitle">Metascore</p>
            </article>

            <article data-value=${imdbRating} class="notification is-primary">
                <p class="title">${movieDetail.imdbRating}</p>
                <p class="subtitle">IMDB Rating</p>
            </article>

            <article data-value=${imdbVotes} class="notification is-primary">
                <p class="title">${movieDetail.imdbVotes}</p>
                <p class="subtitle">IMDB Votes</p>
            </article>
        `;
}

const serieTemplate = (serieDetail) => {
    const awards = serieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0)

    const imdbRating = parseFloat(serieDetail.imdbRating);
    const imdbVotes = parseInt(serieDetail.imdbVotes.replace(/,/g, ''));

    return `
        <article class="media">
            <figure class="media-left">
            <p class="image">
                <img src="${serieDetail.Poster}"/>
            </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${serieDetail.Title}</h1>
                    <h4>${serieDetail.Genre}</h4>
                    <p>${serieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${serieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${serieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${serieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}