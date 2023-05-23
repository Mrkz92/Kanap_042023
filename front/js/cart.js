/* ------ Get data from localStorage ------- */
let cart = getCart();

/* ------- Hydrate the HTML if cart's empty ------- */
if (!cart.length) {
  const cartAndFormContainer = document.querySelector("#cartAndFormContainer");
  cartAndFormContainer.innerHTML = `<h1>Votre panier est vide.</h1>`;
} else {
  /* ------- Hydrate items section with api and localStorage data ------- */
  hydrateCart();
  async function hydrateCart() {
    for (let value of cart) {
      let apiData = await fetch(`http://localhost:3000/api/products/${value.id}`).then((res) => res.json());
      const cartItems = document.querySelector("section#cart__items");
      let cartItem = document.createElement("article");
      cartItem.setAttribute("class", "cart__item");
      cartItem.setAttribute("data-id", `${value.id}`);
      cartItem.setAttribute("data-color", `${value.color}`);
      cartItem.innerHTML = `   
                    <div class="cart__item__img">
                        <img src="${apiData.imageUrl}" alt="${apiData.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${apiData.name}</h2>
                        <p>${value.color}</p>
                        <p>${apiData.price},00 €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${value.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                        </div>
                    </div>
                </article>`;
      cartItems.appendChild(cartItem);

      /* ------- Create function to delete one item ------- */
      function deleteItem() {
        /* ------- Reach each all delete buttons before listen to them ------ */
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
        });
      }
      deleteItem();

      /* ------- Create function to modify item's quantity ------ */
      function inputQuantity() {
        const itemQuantityInputs = document.querySelectorAll(".itemQuantity");
        /* ------- Reach each all quantity inputs before listen to them ------ */
        itemQuantityInputs.forEach((input, index) => {
          /* ------- Listen to quantity button ------- */
          input.addEventListener("input", (event) => {
            event.preventDefault();
            let itemQuantityValue = event.target.value;

            /* ------- Update cart item quantity ------- */
            cart[index].quantity = itemQuantityValue;

            /* ------- Save updated cart to local storage ------- */
            localStorage.setItem("item", JSON.stringify(cart));

            if (itemQuantityValue == 0) {
              event.target.closest(".cart__item").remove();
              window.location.reload();
            }
          });
        });
      }
      inputQuantity();
    }
  }
}

getTotals();
/**
 * Get all price and quantity
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

async function getForm() {
  let form = document.querySelector("form.cart__order__form");
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

  /* ------- Listen to the the order button ------- */
  const submitButton = document.querySelector("input#order");
  submitButton.addEventListener("click", (submit) => {
    submit.preventDefault();
    /* Get all the form  value*/
    let firstNameInput = document.querySelector("input#firstName");
    let lastNameInput = document.querySelector("input#lastName");
    let addressInput = document.querySelector("input#address");
    let cityInput = document.querySelector("input#city");
    let emailInput = document.querySelector("input#email");

    let validationMsg =
      validFirstName(firstNameInput) ||
      validLastName(lastNameInput) ||
      validCity(cityInput) ||
      validAddress(addressInput) ||
      validEmail(emailInput);
    if (validationMsg) return alert(validationMsg);
    // if (validFirstName(firstNameInput)) return alert("Veuillez renseigner un prénom valide.");
    // if (validLastName(lastNameInput)) return alert("Veuillez renseigner un nom valide.");
    // if (validCity(cityInput)) return alert("Veuillez renseigner une ville valide.");
    // if (validAddress(addressInput)) return alert("Veuillez renseigner une adresse valide.");

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
    let order = { contact, products };
    console.log(JSON.stringify(order));

    /**
     *
     * @returns {Promise<>}
     */
    async function sendOrder() {
      /* ------- Method to POST on API ------- */
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
        let orderId = data.orderId;
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
getForm();

/**
 *Get JSON data from local storage and parse them to object if exist or create an array
 * @returns {Array<Product>}
 */
function getCart() {
  return JSON.parse(localStorage.getItem("item")) ?? [];
}
