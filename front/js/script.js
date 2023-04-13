generateIndex();

function generateIndex() {
    const getJsonData = fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .then(function(jsonData) {
                for(let d in jsonData) {
                    let items = document.getElementById('items')
                        
                        let productLink = document.createElement("a")
                        productLink.href = `./product.html?id=${jsonData[d]._id}`
                        productLink.innerHTML = `
                            <article>
                                <img src="${jsonData[d].imageUrl}" alt="${jsonData[d].altTxt}">
                                <h3 class="productName">${jsonData[d].name}</h3>
                                <p class="productDescription">${jsonData[d].description}<p>`
                        items.appendChild(productLink)

                            // let productArticle = document.createElement("article")
                            // productLink.appendChild(productArticle)

                            //     let productImage = document.createElement("img")
                            //     productImage.src = jsonData[d].imageUrl
                            //     productImage.alt = jsonData[d].altTxt
                            //     productArticle.appendChild(productImage)

                            //     let productName = document.createElement("h3")
                            //     productName.classList.add("productName")
                            //     productName.innerText = jsonData[d].name
                            //     productArticle.appendChild(productName)

                            //     let productDescription = document.createElement("p")
                            //     productDescription.classList.add("productDescription")
                            //     productDescription.innerText = jsonData[d].description
                            //     productArticle.appendChild(productDescription)
                }
        })
        .catch(function(err) {
            alert(`Nous rencontrons un problème serveur, veulliez réessayer ultèrieurement.`)
            console.log(`Veuillez nous excuser, un problème est survenu.`);
        });
}