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

const input = document.querySelector('input');

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

//now we can actually pass in the function
//to the above function.
//THE SOLE PURPOSE OF USING THE ABOVE FUNCTION IS 
//THAT WE COULD HAVE MULTIPLE INSTANCES WHERE WE MIGHT NEED
//TO DELAY A CERTAIN FUNCTION

const body = document.querySelector('body');
const onInput = async (e) => {
    let searchTerm = e.target.value;
    //fetch data being an async function we need 
    //to await for it's response and hence treat onInput as 
    //an ASYNC function as well
    const movies = await fetchData(searchTerm);
    for (let movie of movies){
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${movie.Poster}"></img>
            <h1>${movie.Title}</h1>
        `;
        document.querySelector('#target').appendChild(div);
    }
}
input.addEventListener('input', debounce(onInput));