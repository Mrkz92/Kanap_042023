/* ------ Get data from localStorage ------- */
let cart = getCart();
console.log(cart.length);

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
    /* ------- Create function to delete one item ------- */
    deleteItem();
    /* ------- Create function to modify item's quantity ------ */
    modifyQuantity();
  }
}
loopToManageCartSection();
/* ------- Listen to all form's input and verify validity ------- */
getForm();

/**
 *Get JSON data from local storage and parse them to object if exist or create an array
 * @returns {Array<Product>}
 */
function getCart() {
  return Array.from(JSON.parse(localStorage.getItem("item"))) ?? [];
}

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
  cartItem.setAttribute("class", "cart__item");
  cartItem.setAttribute("data-id", `${product.id}`);
  cartItem.setAttribute("data-color", `${product.color}`);
  cartItem.innerHTML = `   
    <div class="cart__item__img">
        <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>${product.color}</p>
        <p>${data.price},00 €</p>
        </div>
        <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
        </div>
        </div>
    </div>`;
  cartItems.appendChild(cartItem);
}

/**
 *Listen to the button to delete the product
 */
function deleteItem() {
  const deleteButtons = document.querySelectorAll("p.deleteItem");
  deleteButtons.forEach((button) => {
    /* ------- Listen to the delete button ------- */
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const itemId = event.target.closest(".cart__item").dataset.id;
      const itemColor = event.target.closest(".cart__item").dataset.color;
      /* ------- Filter item from cart ------- */
      cart = cart.filter((item) => !(item.id === itemId && item.color === itemColor));

      /* ------- Save updated cart to local storage ------- */
      localStorage.setItem("item", JSON.stringify(cart));
      window.location.reload();
    });
    /* ------- Get all prices and quantities to have totals ------- */
    getTotals();
  });
}

/**
 *Listen to the input to modify the product quantity
 */
function modifyQuantity() {
  const itemQuantityInputs = document.querySelectorAll(".itemQuantity");
  /* ------- Reach each all quantity inputs before listen to them ------ */
  itemQuantityInputs.forEach((input, index) => {
    /* ------- Listen to quantity button ------- */
    input.addEventListener("input", (event) => {
      event.preventDefault();
      let itemQuantityValue = parseInt(event.target.value);

      /* ------- Update cart item quantity ------- */
      cart[index].quantity = itemQuantityValue;

      /* ------- Save updated cart to local storage ------- */
      localStorage.setItem("item", JSON.stringify(cart));
      console.log(index);

      // if (itemQuantityValue == 0) {
      //   event.target.closest(".cart__item").remove();
      //   cart.splice(cart[index], 1);
      //   localStorage.setItem("item", JSON.stringify(cart));
      // }
      getTotals();
    });
  });
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

  /* Validate the firstNameInput value */
  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  function validFirstName(firstNameInput) {
    if (!firstNameInput) return (firstNameErrorMsg.innerText = "Veuillez remplir ce champ.");
    if (!(firstNameInput.value.length > 2)) return (firstNameErrorMsg.innerText = "Prénom trop court.");
    if (!(firstNameInput.value.length < 100)) return (firstNameErrorMsg.innerText = "Prénom trop long.");
    return (firstNameErrorMsg.innerText = "");
  }

  /* Validate the lastNameInput value */
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  function validLastName(lastNameInput) {
    if (!lastNameInput) return (lastNameErrorMsg.innerText = "Veuillez remplir ce champ.");
    if (!(lastNameInput.value.length > 2)) return (lastNameErrorMsg.innerText = "Nom trop court.");
    if (!(lastNameInput.value.length < 100)) return (lastNameErrorMsg.innerText = "Nom trop long.");
    return (lastNameErrorMsg.innerText = "");
  }

  /* Validate the addressInput value */
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  function validAddress(addressInput) {
    if (!addressInput) return (addressErrorMsg.innerText = "Veuillez remplir ce champ.");
    if (!(addressInput.value.length > 2)) return (addressErrorMsg.innerText = "Adresse trop courte.");
    if (!(addressInput.value.length < 100)) return (addressErrorMsg.innerText = "Adresse trop longue.");
    return (addressErrorMsg.innerText = "");
  }

  /* Validate the cityInput value */
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  function validCity(cityInput) {
    if (!cityInput) return (cityErrorMsg.innerText = "Veuillez remplir ce champ.");
    if (!(cityInput.value.length > 2)) return (cityErrorMsg.innerText = "Ville trop courte.");
    if (!(cityInput.value.length < 100)) return (cityErrorMsg.innerText = "Ville trop longue.");
    return (cityErrorMsg.innerText = "");
  }

  /* Validate the emailInput value */
  const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const emailErrorMsg = document.querySelector("#emailErrorMsg");
  function validEmail(emailInput) {
    if (!emailInput) return (emailErrorMsg.innerText = "Veuillez remplir ce champ.");
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
