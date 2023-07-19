fetchProductFromUrlId()
  .then(function (data) {
    if (Object.keys(data).length !== 0) {
      /*------- Get container's element -------*/
      hydrateProductHTMLWithData(data);

      /*------- Fill select field -------*/
      hydrateOptionWithData(data);

      /* ------- Listen to the click on the #addToCart button -------*/
      listenBtnToSendOnLocalStorage(data);
    } else {
      displayErrorMessage();
    }
  })
  .catch((err) => {
    displayErrorMessage();
  });

/**
 * Fetch a product data from id search param in URL
 * @returns {Promise<Product>}
 */
async function fetchProductFromUrlId() {
  const productId = new URL(location.href).searchParams.get("id");
  const response = await fetch(`http://localhost:3000/api/products/${productId}`);
  const data = await response.json();
  return data;
}

/**
 * Populate product.html with data
 * @param {*} data
 */
function hydrateProductHTMLWithData(data) {
  const itemImage = document.querySelector(".item__img");
  const itemName = document.querySelector("#title");
  const itemPrice = document.querySelector("#price");
  const itemDescription = document.querySelector("#description");

  /*------- Create image's element -------*/
  const image = document.createElement("img");
  image.src = data.imageUrl;
  image.alt = data.altTxt;
  itemImage.appendChild(image);

  /*------- Fill name's element -------*/
  itemName.innerText = data.name;

  /*------- Fill price's element -------*/
  itemPrice.innerText = data.price;

  /*------- Fill description's element -------*/
  itemDescription.innerText = data.description;
}

/**
 * Populate option with data from API
 * @param {} data
 */
function hydrateOptionWithData(data) {
  const itemSelector = document.querySelector("#colors");
  const colorsJson = data.colors;

  fillOption(itemSelector, colorsJson);

  function fillOption(itemSelector, colorsJson) {
    colorsJson.forEach((color) => {
      let colors = document.createElement("option");
      colors.label = color;
      colors.value = color;
      colors.innerText = color;
      itemSelector.appendChild(colors);
    });
  }
}

/**
 * Listen to the button click to send JSON data on local storage
 * @param {*} data
 */
function listenBtnToSendOnLocalStorage(data) {
  const addToLocalStorage = document.querySelector("#addToCart");
  addToLocalStorage.addEventListener("click", () => {
    /* ------- Get color's value ------- */
    const colorSelect = document.querySelector("select#colors");
    let color = colorSelect.value;

    /* ------- Get quantity's value ------- */
    const quantityInput = document.querySelector("input#quantity");
    let quantity = quantityInput.value;

    /* ------- Check if a color and quantity have been chosen  ------- */
    if (color == "" && (quantity < 1 || quantity > 100)) {
      return alert(`Veuillez choisir une couleur et une quantité comprise entre 1 et 100.`);
    }
    if (color == "") {
      return alert(`Veuillez choisir une couleur.`);
    }
    if (quantity < 1 || quantity > 100) {
      return alert(`Veuillez choisir une quantité comprise entre 1 et 100`);
    }

    /* ------- Create item's object ------- */
    let selectItem = {
      id: data._id,
      quantity: parseInt(quantity),
      color: color,
    };
    console.log(selectItem);

    /* ------ Get value stored in localstorage from "item" key ------- */
    const localStorageContent = JSON.parse(localStorage.getItem("item")) ?? [];

    /* ------ Check if object already exists in localstorage ------- */
    const existingItem = localStorageContent.find(
      (item) => item.id === selectItem.id && item.color === selectItem.color
    );
    if (existingItem) {
      existingItem.quantity = parseInt(existingItem.quantity) + parseInt(quantity);
      console.log(existingItem);
    } else {
      localStorageContent.push(selectItem);
    }
    /* ------ Updating value in localstorage ------- */
    localStorage.setItem("item", JSON.stringify(localStorageContent));
    if (selectItem.quantity > 1) {
      alert(`${selectItem.quantity} exemplaires ${data.name} ${selectItem.color} ont été ajoutés au panier.`);
    } else {
      alert(`${selectItem.quantity} exemplaire ${data.name} ${selectItem.color} a été ajouté au panier.`);
    }
  });
}

/**
 * Display error message when product data is not found
 */
function displayErrorMessage() {
  const item = document.querySelector(".item");
  item.innerHTML = "";

  const errorMessageContainer = document.createElement("article");
  item.appendChild(errorMessageContainer);

  const errorMessage = document.createElement("h2");
  errorMessage.innerText = "Désolé mais ce produit est indisponible, veuillez réessayer ultérieurement.";
  errorMessageContainer.appendChild(errorMessage);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("item__content__addButton");
  errorMessageContainer.appendChild(buttonContainer);

  const redirectionBtn = document.createElement("a");
  redirectionBtn.innerText = "Retourner à l'accueil.";
  redirectionBtn.href = "./index.html";
  buttonContainer.appendChild(redirectionBtn);
}
