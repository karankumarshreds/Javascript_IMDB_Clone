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
// let timeoutId;
const onIn = (e) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        let searchTerm = e.target.value;
        fetchData(searchTerm);
    }, 2000)
};
// input.addEventListener('input', onInput);    //NOT CALLIING IT!

//better way of doing it by creating some sort 
//of debounce function
//this  funtion would take in a function (API function call)
// delay the output and would return the funtion
const debounce = (func) => {
    let timeoutId;
    return (...args) => {       //similar to return(arg1, arg2, arg3)
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);     //similar to func(arg1, arg2, arg3)
        }, 1000);
    }
};




//Generating the HTML using JavaScript 
//for code reusability
const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"></input>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"</div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');
const body = document.querySelector('body');

const onInput = async (e) => {
    resultsWrapper.innerHTML = '';
    let searchTerm = e.target.value;
    //fetch data being an async function we need 
    //to await for it's response and hence treat onInput as 
    //an ASYNC function as well
    const movies = await fetchData(searchTerm);
    dropdown.classList.add('is-active'); //to expand the drop down 
    for (let movie of movies){
        const a = document.createElement('a');
        a.classList.add('dropdown-item')
        a.innerHTML = `
            <img src="${movie.Poster}"></img>
            ${movie.Title}
        `;
        resultsWrapper.appendChild(a);
    }
}

//THE SOLE PURPOSE OF USING THE ABOVE FUNCTION IS 
//THAT WE COULD HAVE MULTIPLE INSTANCES WHERE WE MIGHT NEED
//TO DELAY A CERTAIN FUNCTION
input.addEventListener('input', debounce(onInput));


//<div class="dropdown is-active">
//<input/>
//       <div class="dropdown-menu">
//          <div class="dropdown-content">
//            <a class="dropdown-item">Movie #1</a>
//            <a class="dropdown-item">Movie #2</a>
//            <a class="dropdown-item">Movie #3</a>
//          </div>
//        </div>
//      </div>
//<div id="target"></div>