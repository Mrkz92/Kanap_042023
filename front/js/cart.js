/**
 * Get JSON data from local storage and convert them to object if exist or create an empty array
 * @returns {Promise<Array>}
 */
const getCart = () => JSON.parse(localStorage.getItem("item")) || [];
let cart = getCart();
/* ------- Hydrate the HTML if cart's empty ------- */
if (!cart.length) throw (document.querySelector("#cartAndFormContainer").innerHTML = `<h1>Votre panier est vide.</h1>`);
/**
 * Create a loop to hydrate and manage the cart section
 */
async function loopToManageCartSection() {
  for (let index = 0; index < cart.length; index++) {
    const product = cart[index];
    /* ------- Fetch data from API ------- */
    const data = await fecthDataFromApi(product);
    /* ------- Hydrate cart HTML with API and local storage data ------- */
    hydrateCart(product, data);
    getTotals();
  }
}
loopToManageCartSection();
/* ------- Listen to all form's input and verify validity ------- */
getForm();

/**
 * Fetch data from product in API
 * @param {number} product
 * @returns {Promise<data>}
 */
async function fecthDataFromApi(product) {
  const response = await fetch(`http://localhost:3000/api/products/${product.id}`);
  const data = await response.json();
  return data;
}
/**
 *Hydrate cart HTML with API and local storage data
 */
function hydrateCart(product, data) {
  const cartItems = document.querySelector("section#cart__items");
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", `${product.id}`);
  cartItem.setAttribute("data-color", `${product.color}`);
  cartItems.appendChild(cartItem);

  const cartItemImg = document.createElement("div");
  cartItemImg.classList.add("cart__item__img");
  cartItemImg.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
  cartItem.appendChild(cartItemImg);

  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");
  cartItem.appendChild(cartItemContent);

  const itemDescription = document.createElement("div");
  itemDescription.classList.add("cart__item__content");
  itemDescription.innerHTML = `
  <div class="cart__item__content__description">
    <h2>${data.name}</h2>
    <p>${product.color}</p>
    <p>${data.price},00 €</p>
  </div>`;
  cartItemContent.appendChild(itemDescription);

  const cartSettings = document.createElement("div");
  cartSettings.classList.add("cart__item__content__settings");
  cartItemContent.appendChild(cartSettings);

  const quantitySettings = document.createElement("div");
  quantitySettings.classList.add("cart__item__content__settings__quantity");
  quantitySettings.innerHTML = `<p>Qté : </p>`;
  cartSettings.appendChild(quantitySettings);

  const inputQuantity = document.createElement("input");
  inputQuantity.classList.add("itemQuantity");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("name", "itemQuantity");
  inputQuantity.setAttribute("min", "1");
  inputQuantity.setAttribute("max", "100");
  inputQuantity.value = product.quantity;
  inputQuantity.addEventListener("input", modifyQuantity); //Listen to the input to modify quantity
  quantitySettings.appendChild(inputQuantity);
  console.log(inputQuantity);

  const deleteSettings = document.createElement("div");
  deleteSettings.classList.add("cart__item__content__settings__delete");
  cartSettings.appendChild(deleteSettings);

  const deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");
  deleteItem.innerText = `Supprimer`;
  deleteItem.addEventListener("click", deleteCartItem); //Listen to the button to delete the product
  deleteSettings.appendChild(deleteItem);
  console.log(deleteItem);
}

/**
 *Listen to the button to delete the product
 */
function deleteCartItem() {
  const cartItem = this.closest("article");
  const itemId = cartItem.getAttribute("data-id");
  const itemColor = cartItem.getAttribute("data-color");
  const itemIndex = cart.findIndex((item) => item.id === itemId && item.color === itemColor);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    cartItem.remove();
    localStorage.setItem("item", JSON.stringify(cart)); // Mettre à jour le local storage
    getTotals();
  }
}

/**
 *Listen to the input to modify the product quantity
 */
function modifyQuantity() {
  let itemQuantityValue = parseInt(this.value);
  const cartItem = this.closest("article");
  const itemId = cartItem.getAttribute("data-id");
  const itemColor = cartItem.getAttribute("data-color");
  const itemIndex = cart.findIndex((item) => item.id === itemId && item.color === itemColor);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = itemQuantityValue;
    localStorage.setItem("item", JSON.stringify(cart));
    if (itemQuantityValue === 0) {
      deleteCartItem.call(this);
    }
    getTotals();
  }
}
/**
 * Get all prices and quantities to have totals
 */
async function getTotals() {
  const sumQuantity = [];
  const sumPrice = [];
  for (let value of cart) {
    const apiItem = await fetch(`http://localhost:3000/api/products/${value.id}`);
    const itemData = await apiItem.json();
    const itemQuantity = parseInt(value.quantity);
    sumQuantity.push(itemQuantity);
    const itemTotalPrice = itemData.price * parseInt(value.quantity);
    sumPrice.push(itemTotalPrice);
  }

  const totalQuantity = sumQuantity.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const totalPrice = sumPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const cartPrice = document.querySelector(".cart__price");
  cartPrice.innerHTML = `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice">${totalPrice}</span> €</p>`;
}

/**
 *Listen to all form's input and verify validity
 */
function getForm() {
  const form = document.querySelector("form.cart__order__form");
  /* Listen to firstName input */
  form.firstName.addEventListener("input", (event) => validFirstName(event.target));
  /* Listen to lastName input */
  form.lastName.addEventListener("input", (event) => validLastName(event.target));
  /* Listen to address input */
  form.address.addEventListener("input", (event) => validAddress(event.target));
  /* Listen to city input */
  form.city.addEventListener("input", (event) => validCity(event.target));
  /* Listen to email input */
  form.email.addEventListener("input", (event) => validEmail(event.target));

  const regexName = /^[A-Za-zàèéêëîïôöûü0-9' -]*$/;
  /* Validate the firstNameInput value */
  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  function validFirstName(firstNameInput) {
    if (!firstNameInput.value.length) return (firstNameErrorMsg.innerText = "Veuillez remplir ce champ de formulaire.");
    if (!regexName.test(firstNameInput.value))
      return (firstNameErrorMsg.innerText = "Veuillez renseigner un prénom valide.");
    if (!(firstNameInput.value.length > 2)) return (firstNameErrorMsg.innerText = "Prénom trop court.");
    if (!(firstNameInput.value.length < 100)) return (firstNameErrorMsg.innerText = "Prénom trop long.");
    return (firstNameErrorMsg.innerText = "");
  }

  /* Validate the lastNameInput value */
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  function validLastName(lastNameInput) {
    if (!lastNameInput.value.length) return (lastNameErrorMsg.innerText = "Veuillez remplir ce champ de formulaire.");
    if (!regexName.test(lastNameInput.value))
      return (lastNameErrorMsg.innerText = "Veuillez renseigner un nom valide.");
    if (!(lastNameInput.value.length > 2)) return (lastNameErrorMsg.innerText = "Nom trop court.");
    if (!(lastNameInput.value.length < 100)) return (lastNameErrorMsg.innerText = "Nom trop long.");
    return (lastNameErrorMsg.innerText = "");
  }

  /* Validate the addressInput value */
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  function validAddress(addressInput) {
    if (!addressInput.value.length) return (addressErrorMsg.innerText = "Veuillez remplir ce champ de formulaire.");
    if (!regexName.test(addressInput.value))
      return (addressErrorMsg.innerText = "Veuillez renseigner une adresse valide.");
    if (!(addressInput.value.length > 2)) return (addressErrorMsg.innerText = "Adresse trop courte.");
    if (!(addressInput.value.length < 100)) return (addressErrorMsg.innerText = "Adresse trop longue.");
    return (addressErrorMsg.innerText = "");
  }

  /* Validate the cityInput value */
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  function validCity(cityInput) {
    if (!cityInput.value.length) return (cityErrorMsg.innerText = "Veuillez remplir ce champ de formulaire.");
    if (!regexName.test(cityInput.value)) return (cityErrorMsg.innerText = "Veuillez renseigner une ville valide.");
    if (!(cityInput.value.length > 2)) return (cityErrorMsg.innerText = "Ville trop courte.");
    if (!(cityInput.value.length < 100)) return (cityErrorMsg.innerText = "Ville trop longue.");
    return (cityErrorMsg.innerText = "");
  }

  /* Validate the emailInput value */
  const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const emailErrorMsg = document.querySelector("#emailErrorMsg");
  function validEmail(emailInput) {
    if (!emailInput.value.length) return (emailErrorMsg.innerText = "Veuillez remplir ce champ de formulaire.");
    if (!regexEmail.test(emailInput.value)) return (emailErrorMsg.innerText = "Veuillez renseigner un mail valide.");
    return (emailErrorMsg.innerText = "");
  }

  document.querySelector("input#order").addEventListener("click", (submit) => {
    submit.preventDefault();
    /* Get all the form  value*/
    const firstNameInput = document.querySelector("input#firstName");
    const lastNameInput = document.querySelector("input#lastName");
    const addressInput = document.querySelector("input#address");
    const cityInput = document.querySelector("input#city");
    const emailInput = document.querySelector("input#email");

    let validationMsg =
      validFirstName(firstNameInput) ||
      validLastName(lastNameInput) ||
      validCity(cityInput) ||
      validAddress(addressInput) ||
      validEmail(emailInput);
    if (validationMsg) return alert(validationMsg);

    contact = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      address: addressInput.value,
      city: cityInput.value,
      email: emailInput.value,
    };

    /* ------- Create array of id products ------- */
    const products = cart.map((product) => product.id);

    /* ------- Create object to POST on API ------- */
    const order = { contact, products };
    console.log(JSON.stringify(order));

    /**
     * Post order JSON on API and get orderId before redirect to the confirmation page
     * @returns {Promise<orderId(number)>}
     */
    async function sendOrder() {
      /* ------- Post order JSON on API and get orderId before redirect to the confirmation page ------- */
      try {
        const response = await fetch(`http://localhost:3000/api/products/order`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });
        const data = await response.json();
        const orderId = data.orderId;
        /* ------- Redirect to the confirmation page or display a success message ------- */
        if (!orderId) return;
        localStorage.clear();
        document.location.href = `confirmation.html?orderId=${orderId}`;
      } catch (err) {
        alert("Le serveur a rencontré un problême, veuillez réessayer ultérieurement.");
      }
    }
    sendOrder();
  });
}
