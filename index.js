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

    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden'); //bulma class
        onClick(movie, document.querySelector('#left-summary'), 'left');
    }, //this way you could tell widget what 
       //custom funtion you would wanna run
       //if the user clicks on an item from 
       //the widget dropdown
},);


//using/calling the reusable widgets
createAutoComplete({
    ...autoCompleteConfig,  //add everything from the above 
                            //object and prepend it here
    root: document.querySelector('#right-autocomplete'),

    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden'); //bulma class
        onClick(movie, document.querySelector('#right-summary'), 'right');
    }, //this way you could tell widget what 
       //custom funtion you would wanna run
       //if the user clicks on an item from 
       //the widget dropdown
},);


let leftMovie;
let rightMovie;
const onClick = async (movie, detailArea, side) => {
    console.log(side);
    const url = 'http://www.omdbapi.com/'
    const response = await axios.get(url, { 
        params : {
            apikey : 'b5c59523',  
            i : movie.imdbID
        }
    })
    const template = movieTemplate(response.data);
    detailArea.innerHTML = template;

    if(side == 'left'){
        leftMovie = response.data;
    } 
    else{
        rightMovie = response.data;
    } //when both are clicked
    if (leftMovie && rightMovie){
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.getAttribute('data-value'));
        const rightSideValue = parseInt(rightStat.getAttribute('data-value'));
        if (rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = (detail) => {
    const dollars = parseInt(
        detail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
        );
    const metaScore = parseInt(detail.Metascore);
    const imdbRating = parseFloat(detail.imdbRating);
    const votes = parseInt(detail.imdbVotes.replace(/,/g, ''));
    const awards = detail.Awards.split(' ')
    let tot = 0;
    awards.forEach((x) => {
        if (parseInt(x)){
            tot = tot + parseInt(x);
        }
    })
    
    return `
        <article aclass="media">
        <div class="container info">
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
        </div>
        </article>
        <article data-value=${tot} class="notification is-primary">
            <p class="title awards">${detail.Awards}</p>
            <p class="subtitles">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${detail.BoxOffice}</p>
            <p class="subtitles">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${detail.Metascore}</p>
            <p class="subtitles">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${detail.imdbRating}</p>
            <p class="subtitles">IMDB Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${detail.imdbVotes}</p>
            <p class="subtitles">IMDB Votes</p>
        </article>
    `;
}