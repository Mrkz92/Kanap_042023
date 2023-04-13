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
        // const product = productJson;
          
        /*------- Get the container's element -------*/
        const item = document.querySelector(".item article")
        
            /*------- Create the image's element -------*/
            const itemImage = document.querySelector(".item__img")
                const image = document.createElement("img")
                image.src = productJson.imageUrl
                image.alt = productJson.altTxt
                itemImage.appendChild(image)
            
            /*------- Fill the name's element -------*/
            const itemName = document.querySelector("#title")
            itemName.innerText = productJson.name
            // 
            /*------- Fill the price's element -------*/
            const itemPrice = document.getElementById("price")
            itemPrice.innerText = productJson.price
            
            /*------- Fill the description's element -------*/
            const itemDescription = document.getElementById("description")
            itemDescription.innerText = productJson.description

            /*------- FIll the select field -------*/
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

        const addToLocalStorage = document.querySelector("#addToCart")
        addToLocalStorage.addEventListener("click", () => {

            const colorSelect = document.querySelector("select#colors");
            let color = colorSelect.value;
            
            const quantitySelect = document.querySelector("input#quantity");
            let quantity = quantitySelect.value;

            let cartItem = {
                "id" : productJson._id,
                "quantity" : quantity,
                "color" : color
            };
            console.log(cartItem)

            // Récupération de la valeur stockée dans le localstorage à partir de la clé "ma_cle"
            const localStorageContent = localStorage.getItem("item");
            console.log(localStorageContent)

            // Vérification si la valeur existe
            if (localStorageContent !== null) {
                return true
                console.log("La valeur de ma_cle est:", maValeur);
            } else {
                return false
                console.log("La clé ma_cle n'a pas été trouvée dans le localstorage.");
            }

            function checkProduct(cartItem) {
                if (localStorage.filter(id => item.id !== cartItem.id)) {
                    localStorage.setItem("item", JSON.stringify(cartItem));
                } else {

                }
            }
            // const localStorageContent = localStorage.getItem("item");
            // console.log(localStorageContent)

            // const checkLocalSorage = (cartItem) => {
            //     if (localStorage.length === 0) {
            //         return false;
            //     } else {
            //         if (localStorageContent.filter(i => i.id !== cartItem.id)) {
            //             return true
            //         } else {
            //             return false
            //         }
            //     }
            // }
            // if (checkLocalSorage(cartItem)) {
            //     let checkItemColor = localStorageContent.filter(j => j.color === cartItem.color);
            //     localStorageContent[checkItemColor].quantity = localStorageContent[checkItemColor].quantity + cartItem.quantity;
            //     localStorage.setItem("item", JSON.stringify(localStorageContent))
            // } else {
            //     if (!localStorage) {
            //         // const localStorageContent = []
            //         localStorageContent.push(cartItem);
            //         localStorage.setItem("item", JSON.stringify(localStorageContent));
            //         confirm(`Le ${productJSON.name} ${cartItem.color}`)
            //     }
            // }
        })
    })
        