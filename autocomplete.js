const createAutoComplete = ({
        root,
        renderOption, 
        onOptionSelect, 
        inputFieldValue,
        fetchData, 
    }) => {

    root.innerHTML = `
    <label>Search</label>
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

    //as soon as the user starts typing, this is called!
    const onInput = async (e) => {
        resultsWrapper.innerHTML = '';

        let searchTerm = e.target.value;
        const items = await fetchData(searchTerm);
        
        //to check if there are no movies returned
        if (!items.length){
            dropdown.classList.remove('is-active');
            return;
        };

        dropdown.classList.add('is-active'); //to expand the drop down 

        for (let item of items){
            const option = document.createElement('a');
            
            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(item);
            resultsWrapper.appendChild(option);
            
            
            option.addEventListener('click', () => {
                //collapse the list when user clicks on movie
                dropdown.classList.remove('is-active');
                
                //make input field text = clicked movie's name
                const value = inputFieldValue(item)
                input.value = value;
                
                //render template when the use clicks on movie
                onOptionSelect(item);
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

    //MAIN FUNCTION WHEN USER STARTS TO TYPE!
    input.addEventListener('input', debounce(onInput));

    //close the dropdown if user clicks anywhere on the window
    //except the dropdown itself
    document.addEventListener('click', (e)=>{
        if (!root.contains(e.target)){
            dropdown.classList.remove('is-active');
        }
    });
}