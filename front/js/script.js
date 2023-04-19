generateIndex();

function generateIndex() {
    const getJsonData = fetch(`http://localhost:3000/api/products`)
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
                }
        })
        .catch((err) => alert(`Nous rencontrons un problème serveur, veulliez réessayer ultèrieurement.`));
}