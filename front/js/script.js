generateIndex();

async function generateIndex() {
  /* ------- Call of the API ------- */
  try {
    const response = await fetch(`http://localhost:3000/api/products`);
    const data = await response.json();
    /* ------- Create loop for ------- */
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
  } catch (err) {
    console.error(err);
    alert(`Nous rencontrons un problème serveur, veulliez réessayer ultèrieurement.`);
  }
}
