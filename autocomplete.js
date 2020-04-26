const createAutoComplete = ({root}) => {
    root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"></input>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"</div>
        </div>
    </div>
`;

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');
const body = document.querySelector('body');

const onInput = async (e) => {
    resultsWrapper.innerHTML = '';
    let searchTerm = e.target.value;
    //fetch data being an async function we need 
    //to await for it's response and hence treat onInput as 
    //an ASYNC function as well
    const movies = await fetchData(searchTerm);
    //if there are no movies returned
    if (!movies.length){
        dropdown.classList.remove('is-active');
        return;
    };
    dropdown.classList.add('is-active'); //to expand the drop down 
    for (let movie of movies){
        const a = document.createElement('a');
        a.classList.add('dropdown-item')
        a.innerHTML = `
            <img src="${movie.Poster}"></img>
            ${movie.Title}
        `;
        resultsWrapper.appendChild(a);
        //update the input field with clicked movie's name
        a.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onClick(movie.imdbID)
            });
        }
    };
    
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
        }, 500);
    }
};

    //THE SOLE PURPOSE OF USING THE ABOVE FUNCTION IS 
    //THAT WE COULD HAVE MULTIPLE INSTANCES WHERE WE MIGHT NEED
    //TO DELAY A CERTAIN FUNCTION
    input.addEventListener('input', debounce(onInput));

    //close the dropdown if user clicks anywhere on the window
    //except the dropdown itself
    document.addEventListener('click', (e)=>{
        if (!root.contains(e.target)){
            dropdown.classList.remove('is-active')
        }
    });
}