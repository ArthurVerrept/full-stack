const idNames = ['accessorieSelect', 'hatSelect', 'outerwearSelect', 'topSelect', 'bottomSelect', 'fullbodySelect', 'shoeSelect'];
var items;
//This Script makes a fetch (essential a GET Http) request to the server
const clothesList = document.getElementById('clothesList');
fetch('http://localhost:5000/dashboard/getClothes')
    .then(res => res.json())
    .then((item) => {
        items = item;
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


//This Script makes a fetch (essential a GET Http) request to the server
const outfitList = document.getElementById('outfitList');
fetch('http://localhost:5000/dashboard/getOutfits')
    .then(res => res.json())
    .then((outfits) => {
        console.log(outfits)
        // console.log(outfits)
        // //.map() is used to cycle through the array, and a template literal is used to return HTML for
        // //each item in the array. We call these contact, and we can access items inside each contact, using contact.NAMEOFITEM. InnerHTML is then used to parse the returned HTML to the contactList object
        var dataFeed;

        dataFeed = outfits.map((outfit) => {
            var currSend = ``;
            if(outfit[0].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[0].type}</p>
                    <p> make: ${outfit[0].brand}</p>
                    <p> item: ${outfit[0].itemName}</p>
                </div>
                <hr>
                `
            }
            if(outfit[1].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[1].type}</p>
                    <p> make: ${outfit[1].brand}</p>
                    <p> item: ${outfit[1].itemName}</p>
                </div>
                <hr>
                ` 
            }
            if(outfit[2].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[2].type}</p>
                    <p> make: ${outfit[2].brand}</p>
                    <p> item: ${outfit[2].itemName}</p>
                </div>
                <hr>
                ` 
            }
            if(outfit[3].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[3].type}</p>
                    <p> make: ${outfit[3].brand}</p>
                    <p> item: ${outfit[3].itemName}</p>
                </div>
                <hr>
                ` 
            }
            if(outfit[4].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[4].type}</p>
                    <p> make: ${outfit[4].brand}</p>
                    <p> item: ${outfit[4].itemName}</p>
                </div>
                <hr>
                ` 
            }
            if(outfit[5].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[5].type}</p>
                    <p> make: ${outfit[5].brand}</p>
                    <p> item: ${outfit[5].itemName}</p>
                </div>
                <hr>
                ` 
            }
            if(outfit[6].itemName != 'none'){
                currSend += `
                <br>
                <div>
                    <p> type: ${outfit[6].type}</p>
                    <p> make: ${outfit[6].brand}</p>
                    <p> item: ${outfit[6].itemName}</p>
                </div>
                <hr>
                ` 
            }
            if(outfit[7].URL != 'none'){
                currSend += `
                <br>
                <div>
                    <img style="width:300px" src="${outfit[7].URL}"> 
                </div>
                <hr>
                ` 
            }
            return currSend;







            // return `
            //     <br>
            //     <div>
            //         <p> type: ${outfit[0].type}</p>
            //         <p> make: ${outfit[0].brand}</p>
            //         <p> item: ${outfit[0].itemName}</p>
            //     </div>
            //     <hr>
            //     <div>
            //         <p> type: ${outfit[1].type}</p>
            //         <p> make: ${outfit[1].brand}</p>
            //         <p> item: ${outfit[1].itemName}</p>
            //     </div>
            //     <hr>
            //     <div>
            //         <p> type: ${outfit[2].type}</p>
            //         <p> make: ${outfit[2].brand}</p>
            //         <p> item: ${outfit[2].itemName}</p>
            //     </div>
            //     <hr>
            //     <div>
            //         <p> type: ${outfit[3].type}</p>
            //         <p> make: ${outfit[3].brand}</p>
            //         <p> item: ${outfit[3].itemName}</p>
            //     </div>
            //     <hr>
            //     <hr>
            //     <hr>

            // `
        }).join('');
        outfitList.innerHTML = dataFeed;
    })
    .catch(err => { throw err });














function outfitSelect(item){
    // go through each item of that first array column
    for(var y = 0; y < item.length; y++) {
        var selected;
        var option = '';
        var el;
        if(item[y].type == 'Accessories'){
            selected = document.getElementById('accessorieSelect');
            option = item[y];

        }
        else if(item[y].type == 'Hats'){
            selected = document.getElementById('hatSelect');
            option = item[y];
        }
        else if(item[y].type == 'Outerwear'){
            selected = document.getElementById('outerwearSelect');
            option = item[y];
        }
        else if(item[y].type == 'Tops'){
            selected = document.getElementById('topSelect');
            option = item[y];
        }
        else if(item[y].type == 'Bottoms'){
            selected = document.getElementById('bottomSelect');
            option = item[y];
        }
        else if(item[y].type == 'FullBody'){
            selected = document.getElementById('fullbodySelect');
            option = item[y];
        }
        else if(item[y].type == 'Shoes'){
            selected = document.getElementById('shoeSelect');
            option = item[y];
        }
        if(option != ''){
            el = document.createElement("option");
            el.textContent = option.itemName;
            selected.appendChild(el);
        }
    }
}
