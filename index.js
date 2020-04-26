const fetchData =  async (searchTerm) => {
    const url = 'http://www.omdbapi.com/'
    const response = await axios.get(url, {
        //params would append all these values to the URL
        //it's a feature of axios 
        params: {
            apikey: 'b5c59523',
            s: searchTerm
        }
        //final url requested by axios : 
        //http://www.omdbapi.com/?apikey=b5c59523&s=avengers
    });

    //Error is something this API throws when it 
    //doesn't find any match, so just handling that!
    if (response.data.Error){
        return [];
    }
    return response.data.Search;
}

//ONE way of delaying the API request to wait 
//until the user stops typing // NOT USED HERE ! 
// // let timeoutId;
// const onIn = (e) => {
//     if (timeoutId) {
//         clearTimeout(timeoutId);
//     }
//     timeoutId = setTimeout(() => {
//         let searchTerm = e.target.value;
//         fetchData(searchTerm);
//     }, 2000)
// };
// input.addEventListener('input', onInput);    //NOT CALLIING IT!

createAutoComplete({
    root: document.querySelector('.autocomplete')
});
createAutoComplete({
    root: document.querySelector('.autocomplete-two')
});
createAutoComplete({
    root: document.querySelector('.autocomplete-three')
});

const onClick = async (id) => {
    const url = 'http://www.omdbapi.com/'
    const response = await axios.get(url, { 
        params : {
            apikey : 'b5c59523',  
            i : id
        }
    })
    const template = movieTemplate(response.data);
    document.querySelector(".template").innerHTML = template;
};

const movieTemplate = (detail) => {
    return `
        <article aclass="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${detail.Poster}">
                </p> 
            </figure>
            <div class="media-content">
                <div class="content media-right">
                    <h1>${detail.Title}</h1>
                    <h4>${detail.Genre}</h4>
                    <p>${detail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${detail.Awards}</p>
            <p class="subtitles">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${detail.BoxOffice}</p>
            <p class="subtitles">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${detail.Metascore}</p>
            <p class="subtitles">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${detail.imdbRating}</p>
            <p class="subtitles">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${detail.imdbVotes}</p>
            <p class="subtitles">IMDB Votes</p>
        </article>
    `;
}