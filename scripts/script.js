//This Script makes a fetch (essential a GET Http) request to the server

const clothesList = document.querySelector('#clothesList');
fetch('http://localhost:5000/getClothes')
    .then(res => res.json())
    .then((item) => {
        //.map() is used to cycle through the array, and a template literal is used to return HTML for
        //each item in the array. We call these contact, and we can access items inside each contact, using contact.NAMEOFITEM. InnerHTML is then used to parse the returned HTML to the contactList object
        let dataFeed = users.map((item) => {
            return `
                <span >@${item.type}</span>
                <p>${item.brand}</p>
                <p>${item.itemName}</p>
        `
        }).join('');
        clothesList.innerHTML = dataFeed;
    })
    .catch(err => { throw err });