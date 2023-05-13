/* ------ Get data from localStorage ------- */
let cart = Array.from(JSON.parse(localStorage.getItem("item")) ?? []);
console.log(cart);

if(cart === null || cart == 0) {
    const cartAndFormContainer = document.querySelector("#cartAndFormContainer")
    cartAndFormContainer.innerHTML = `<h1>Votre panier est vide.</h1>`
} else {
    /* ------- Hydrate items section with api and localStorage data ------- */
    hydrateCart();
    async function hydrateCart() {
        for(let value in cart) {
            let apiData = await fetch(`http://localhost:3000/api/products/${cart[value].id}`)
                .then(res => res.json());
            const cartItems = document.querySelector('section#cart__items')
            let cartItem = document.createElement("article")
            cartItem.setAttribute("class", "cart__item")
            cartItem.setAttribute("data-id", `${cart[value].id}`)
            cartItem.setAttribute("data-color", `${cart[value].color}`)
            cartItem.innerHTML = `   
                    <div class="cart__item__img">
                        <img src="${apiData.imageUrl}" alt="${apiData.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${apiData.name}</h2>
                        <p>${cart[value].color}</p>
                        <p>${apiData.price},00 €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[value].quantity}">
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
                const deleteButtons = document.querySelectorAll('p.deleteItem');
                deleteButtons.forEach(button => {
                    /* ------- Listen to the delete button ------- */
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                    
                        const itemId = event.target.closest(".cart__item").dataset.id;
                        const itemColor = event.target.closest(".cart__item").dataset.color;
                        /* ------- Filter item from cart ------- */
                        cart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
                    
                        /* ------- Save updated cart to local storage ------- */
                        localStorage.setItem('item', JSON.stringify(cart));
                        window.location.reload()
                    });
                });
            };
            deleteItem();
            
            /* ------- Create function to modify item's quantity ------ */
            function changeQuantity() {
                const itemQuantityInputs = document.querySelectorAll('.itemQuantity')
                /* ------- Reach each all quantity inputs before listen to them ------ */
                itemQuantityInputs.forEach((input, index) => {
                    /* ------- Listen to quantity button ------- */
                    input.addEventListener('change', (event) => {
                        event.preventDefault();
                        let itemQuantityValue = event.target.value;

                        /* ------- Update cart item quantity ------- */
                        cart[index].quantity = itemQuantityValue;

                        /* ------- Save updated cart to local storage ------- */
                        localStorage.setItem('item', JSON.stringify(cart));

                        if (itemQuantityValue == 0) {
                            event.target.closest(".cart__item").remove();
                            window.location.reload()
                        };
                    });
                });
            };
            changeQuantity();
        };
    };
};


getTotals();
async function getTotals() {
    const sumQuantity = [];
    const sumPrice = [];
    for(let v in cart) {
        const apiItem = await fetch(`http://localhost:3000/api/products/${cart[v].id}`)
        const itemData = await apiItem.json()
        const itemQuantity = parseInt(cart[v].quantity);
        sumQuantity.push(itemQuantity);
        const itemTotalPrice = itemData.price * parseInt(cart[v].quantity);
        sumPrice.push(itemTotalPrice);
    };

    const totalQuantity = sumQuantity.reduce((accumulator, currentValue) => accumulator + currentValue);
    const totalPrice = sumPrice.reduce((accumulator, currentValue) => accumulator + currentValue);
    
    const cartPrice = document.querySelector('.cart__price')
    cartPrice.innerHTML = `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice">${totalPrice}</span> €</p>`;
};

function getForm() {
    let form = document.querySelector('form.cart__order__form');

    /* Listen to firstName change */
    form.firstName.addEventListener('change', (event) => {
        validFirstName(event.target)
    });
    /* Listen to lastName change */
    form.lastName.addEventListener('change', (event) => {
        validLastName(event.target);
    });
    /* Listen to address change */
    form.address.addEventListener('change', (event) => {
        validAddress(event.target);
    });
    /* Listen to city change */
    form.city.addEventListener('change', (event) => {
        validCity(event.target);
    });
    /* Listen to email change */
    form.email.addEventListener('change', (event) => {
        validEmail(event.target);
    });
    
    /* Validate the firstNameInput value */
    const validFirstName = (firstNameInput) => {
        if (firstNameInput !== undefined) {
            return true;
        } else {
            document.querySelector('#firstNameErrorMsg').innerText = 'Veuillez renseigner un prénom valide.';
        };
    };
    /* Validate the lastNameInput value */
    const validLastName = (lastNameInput) => {
        if (lastNameInput !== undefined) {
            return true;
        } else {
            document.querySelector('#lastNameErrorMsg').innerText = 'Veuillez renseigner un nom valide.';
        };
    };
    /* Validate the addressInput value */
    const validAddress = (addressInput) => {
        if (addressInput !== undefined) {
            return true;
        } else { 
            document.querySelector('#addressErrorMsg').innerText = 'Veuillez renseigner une adresse valide.';
        };
    };
    /* Validate the cityInput value */
    const validCity = (cityInput) => {
        if (cityInput !== undefined) {
            return true;
        } else {
            document.querySelector('#cityErrorMsg').innerText = 'Veuillez renseigner une ville valide.';
        };
    };
    /* Validate the emailInput value */
    const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
    const validEmail = (emailInput) => {
        if (regexEmail.test(emailInput.value)) {
            return true;
        } else {
            document.querySelector('#emailErrorMsg').innerText = 'Veuillez renseigner une adresse mail valide.';
        };
    };

    /* ------- Listen to the the order button ------- */
    const submitButton = document.querySelector('input#order');
    submitButton.addEventListener('click', (submit) => {
        
        /* Get all the value*/
        let firstNameInput = document.querySelector('input#firstName');
        let lastNameInput = document.querySelector('input#lastName');
        let addressInput = document.querySelector('input#address');
        let cityInput = document.querySelector('input#city');
        let emailInput = document.querySelector('input#email');

        if ((validFirstName(firstNameInput) && validLastName(lastNameInput) && validCity(cityInput) && validAddress(addressInput) && validEmail(emailInput)) !== true) {
            submit.preventDefault();
            alert(`Veuillez renseigner des informations valides dans le.s champ.s soustitré.s en rouge.`)
            console.log('KO')
        } else {
            submit.preventDefault();
            console.log('Ok')

            /* ------- Create array of id products ------- */
            let productsID = [];
            for (let i in cart) {
                productsID.push(cart[i].id);
            };
            console.log(productsID);

            let order = {
                contact : {
                    firstName : firstNameInput.value,
                    lastName : lastNameInput.value,
                    address : addressInput.value,
                    city : cityInput.value,
                    email : emailInput.value
                },
                products : productsID
            };
            console.log(JSON.stringify(order));
            fetch(`http://localhost:3000/api/products/order`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(order)
            })
            .then(res => res.json())
            .then(data => {
                alert(data.orderId)
                let orderId = data.orderId;
                /* ------- Redirect to the confirmation page or display a success message ------- */
                if (orderId !== null || orderId !== undefined) {
                    document.location.href = `confirmation.html?orderId=${orderId}`;
                    localStorage.clear();
                }
            })
            .catch((err) => console.error('There was a problem sending the order'));
        };
    });
};
getForm();
