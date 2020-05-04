const idNames = ['accessorieSelect', 'hatSelect', 'outerwearSelect', 'topSelect', 'bottomSelect', 'fullbodySelect', 'shoeSelect'];

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


//  
// 
// 
















function outfitSelect(item){
    // go through each item of that first array column
    for(var y = 0; y < item.length; y++) {
        var selected;
        var option = '';
        var el;
        if(item[y].type == 'Accessories'){
            selected = document.getElementById('accessorieSelect');
            console.log(item[y])
            option = item[y];

        }
        else if(item[y].type == 'Hats'){
            selected = document.getElementById('hatSelect');
            console.log(item[y])
            option = item[y];
        }
        else if(item[y].type == 'Outerwear'){
            selected = document.getElementById('outerwearSelect');
            console.log(item[y])
            option = item[y];
        }
        else if(item[y].type == 'Tops'){
            selected = document.getElementById('topSelect');
            console.log(item[y])
            option = item[y];
        }
        else if(item[y].type == 'Bottoms'){
            selected = document.getElementById('bottomSelect');
            console.log(item[y])
            option = item[y];
        }
        else if(item[y].type == 'FullBody'){
            selected = document.getElementById('fullbodySelect');
            console.log(item[y])
            option = item[y];
        }
        else if(item[y].type == 'Shoes'){
            selected = document.getElementById('shoeSelect');
            console.log(item[y])
            option = item[y];
        }
        if(option != ''){
            el = document.createElement("option");
            el.textContent = option.itemName;
            selected.appendChild(el);
        }
    }
}
