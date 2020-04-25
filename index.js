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
    console.log(response.data)
}

const input = document.querySelector('input');
let timeoutId;

const onInput = (e) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        let searchTerm = e.target.value;
        fetchData(searchTerm);
    }, 2000)
};

input.addEventListener('input', onInput);


