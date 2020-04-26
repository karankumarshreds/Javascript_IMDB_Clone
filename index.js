//this will be concatinated with latter functions and passed 
//into the widget function. We are using this to avoid redundancy!
const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster == "N/A" ? '' : movie.Poster;
        return `
                <img src="${imgSrc}"></img>
                ${movie.Title} (${movie.Year})
            `;
    },

    onOptionSelect: (movie) => {
        onClick(movie);
    }, //this way you could tell widget what 
       //custom funtion you would wanna run
       //if the user clicks on an item from 
       //the widget dropdown
    
       inputFieldValue: (movie) => {
        return movie.Title;
    },

    fetchData: async (searchTerm) => {
        const url = 'http://www.omdbapi.com/'
        const response = await axios.get(url, {
            //params would append all these values to the URL
            //it's a feature of axios 
            params: {
                apikey: 'b5c59523',
                s: searchTerm
            }
            //final url requested by axios: 
            //http://www.omdbapi.com/?apikey=b5c59523&s=avengers
        });
        //Error is something this API throws when it 
        //doesn't find any match, so just handling that!
        if (response.data.Error){
            return [];
        }
        return response.data.Search;
    },
};



//using/calling the reusable widgets
createAutoComplete({
    ...autoCompleteConfig,  //add everything from the above 
                            //object and prepend it here
    root: document.querySelector('#left-autocomplete'),
},);


//using/calling the reusable widgets
createAutoComplete({
    ...autoCompleteConfig,  //add everything from the above 
                            //object and prepend it here
    root: document.querySelector('#right-autocomplete'),
},);



const onClick = async (id) => {
    const url = 'http://www.omdbapi.com/'
    const response = await axios.get(url, { 
        params : {
            apikey : 'b5c59523',  
            i : id.imdbID
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