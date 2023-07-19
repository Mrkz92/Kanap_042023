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
    const errorMessage = document.querySelector("h2");
    errorMessage.innerText = "Désolé mais nos produits sont indisponibles, veuillez réessayer ultèrieurement.";
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
    items.appendChild(productLink);

    let productArticle = document.createElement("article");
    productLink.appendChild(productArticle);

    let productImage = document.createElement("img");
    productImage.src = `${product.imageUrl}`;
    productImage.alt = product.altTxt;
    productArticle.appendChild(productImage);

    let productName = document.createElement("h3");
    productName.innerText = `${product.name}`;
    productName.classList.add("productName");
    productArticle.appendChild(productName);

    let productDescription = document.createElement("p");
    productDescription.innerText = `${product.description}`;
    productDescription.classList.add("productDescription");
    productArticle.appendChild(productDescription);
  }
}
