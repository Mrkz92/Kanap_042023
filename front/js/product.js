/*------- Get JSON's data from API -------*/
async function getProductJson() {
    const productId = new URL(location.href).searchParams.get('id');
    const productJson = await fetch(`http://localhost:3000/api/products/${productId}`)
        .then(res => res.json());
    return productJson;
}

/*------- Generate and impregnate sheet's html with JSON's data-------*/
getProductJson()
    .then(function(productJson) {
          
        /*------- Get container's element -------*/
        const item = document.querySelector(".item article")
        
            /*------- Create image's element -------*/
            const itemImage = document.querySelector(".item__img")
                const image = document.createElement("img")
                image.src = productJson.imageUrl
                image.alt = productJson.altTxt
                itemImage.appendChild(image)
            
            /*------- Fill name's element -------*/
            const itemName = document.querySelector("#title")
            itemName.innerText = productJson.name
            // 
            /*------- Fill price's element -------*/
            const itemPrice = document.getElementById("price")
            itemPrice.innerText = productJson.price
            
            /*------- Fill description's element -------*/
            const itemDescription = document.getElementById("description")
            itemDescription.innerText = productJson.description

            /*------- FIll select field -------*/
            const itemSelector = document.querySelector("#colors")
            const colorsJson = productJson.colors
            fillOption(itemSelector, colorsJson);
            function fillOption(itemSelector, colorsJson) {
                colorsJson.forEach(color => {
                    let colors = document.createElement("option")
                    colors.label = color
                    colors.value = color
                    colors.innerText = color
                    itemSelector.appendChild(colors)
                });
            }
        /* ------- Listen to the click on the #addToCart button -------*/
        const addToLocalStorage = document.querySelector("#addToCart")
        addToLocalStorage.addEventListener("click", () => {
            
            /* ------- Get color's value ------- */
            const colorSelect = document.querySelector("select#colors");
            let color = colorSelect.value;
            
            /* ------- Get quantity's value ------- */
            const quantityInput = document.querySelector("input#quantity");
            let quantity = quantityInput.value;

            /* ------- Check if a color and quantity have been chosen  ------- */
            if (color == "" && (quantity < 1 || quantity > 100)) { return alert(`Veuillez choisir une couleur et une quantité comprise entre 1 et 100.`) }
            if (color == "") { return alert(`Veuillez choisir une couleur.`) }
            if (quantity < 1 || quantity > 100) { return alert(`Veuillez choisir une quantité comprise entre 1 et 100`) }
            else {
                /* ------- Create item's object ------- */
                let selectItem = {
                    "id" : productJson._id,
                    "quantity" : parseInt(quantity),
                    "color" : color
                };
                console.log(selectItem)
                
                /* ------ Get value stored in localstorage from "item" key ------- */
                const localStorageContent = JSON.parse(localStorage.getItem("item")) ?? [];
    
                /* ------ Check if object already exists in localstorage ------- */
                const existingItem = localStorageContent.find(item => item.id === selectItem.id && item.color === selectItem.color);
                    if (existingItem) {
                        existingItem.quantity = parseInt(existingItem.quantity) + parseInt(quantity);
                        console.log(existingItem)
                    } else {
                        localStorageContent.push(selectItem);
                    }
                    /* ------ Updating value in localstorage ------- */
                localStorage.setItem("item", JSON.stringify(localStorageContent));
                if (selectItem.quantity > 1) {
                    alert(`${selectItem.quantity} exemplaires ${productJson.name} ${selectItem.color} ont été ajoutés au panier.`)
                } else {
                    alert(`${selectItem.quantity} exemplaire ${productJson.name} ${selectItem.color} a été ajouté au panier.`)
                }
            }
        })
    })
    .catch((err) => alert(`Désolé pour le désagrément mais le produit est actuellement indisponible.`));
        