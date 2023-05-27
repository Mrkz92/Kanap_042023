generateIndex();

/**
 * Call of functions to get all datas from the API and hydrate the HTML
 */
async function generateIndex() {
  try {
    const data = await fetchDataFromApi();
    loopToCreateHTMLSheetForEachProducts(data);
  } catch (err) {
    console.error(err);
    alert(`Nous rencontrons un problème serveur, veulliez réessayer ultèrieurement.`);
  }
}

/**
 *Fetch all data from products in API
 * @returns {Promise<Products>}
 */
async function fetchDataFromApi() {
  const response = await fetch(`http://localhost:3000/api/products`);
  const data = await response.json();
  return data;
}

/**
 * Hydrate index.html with data from API
 * @param {*} data
 */
function loopToCreateHTMLSheetForEachProducts(data) {
  for (const product of data) {
    const items = document.getElementById("items");

    let productLink = document.createElement("a");
    productLink.href = `./product.html?id=${product._id}`;
    productLink.innerHTML = `
                            <article>
                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                <h3 class="productName">${product.name}</h3>
                                <p class="productDescription">${product.description}<p>`;
    items.appendChild(productLink);
  }
}
