var items = [
    accessories= {},
    hats= {},
    tops= {}
];
const select = ['accessorieSelect', 'hatSelect', 'outerwearSelect', 'topSelect', 'bottomSelect', 'fullbodySelect', 'shoeSelect'];

//This Script makes a fetch (essential a GET Http) request to the server
const clothesList = document.getElementById('clothesList');
fetch('http://localhost:5000/dashboard/getClothes')
    .then(res => res.json())
    .then((item) => {
        //.map() is used to cycle through the array, and a template literal is used to return HTML for
        //each item in the array. We call these contact, and we can access items inside each contact, using contact.NAMEOFITEM. InnerHTML is then used to parse the returned HTML to the contactList object
        let dataFeed = item.map((item) => {
            return `
            <br>
            <div>
                <p>${item.type}</p>
                <p>${item.brand}</p>
                <p>${item.itemName}</p>
            </div>
            <hr>
        `
        }).join('');
        //console.log(dataFeed)
        clothesList.innerHTML = dataFeed;
        outfitSelect(item);
    })
    .catch(err => { throw err });


function outfitSelect(item){
    for(var i = 0; i < item.length; i++) {
        if(item[i].type == 'Accessories'){
            items.accessories.push(item[i]);
        }
        if(item[i].type == 'Hats'){
            items.hats.push(item[i]);
        }
        if(item[i].type == 'Tops'){
            items.tops.push(item[i]);
        }
        console.log(items);
    }

    // for(var i = 0; i < select.length; i++) {
    //     // select the first tag
    //     var selected = document.getElementById(select[i]);
    //     // go through each first dimension of array
    //     for(var x = 0; x < 7; x++) {
    //         // go through each item of that first array column
    //         for(var y = 0; y < items[x].length; y++) {
    //             console.log(selected, items[x][y])
    //             var option = items[x][y];
    //             var el = document.createElement("option");
    //             el.textContent = option.itemName;
    //             selected.appendChild(el);
    //         }
    //     }
    // }
}