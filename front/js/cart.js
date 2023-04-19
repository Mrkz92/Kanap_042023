/* ------ Get data from localStorage ------- */
let cart = Array.from(JSON.parse(localStorage.getItem("item")));
if(cart.length == 0){
    const cartAndFormContainer = document.querySelector("#cartAndFormContainer")
    cartAndFormContainer.innerHTML = `<h1>Votre panier est vide.</h1>`
};

/* ------- Hydrate items section with api and localStorage data ------- */
hydrateCart();
async function hydrateCart() {
    for(let value in cart) {
        let apiData = await fetch(`http://localhost:3000/api/products/${cart[value].id}`)
            .then(res => res.json());
        const cartItems = document.querySelector('section#cart__items')
        let cartItem = document.createElement("article")
        cartItem.setAttribute("class", "cart__item")
        cartItem.setAttribute("data-id", "${cart[value].id}")
        cartItem.setAttribute("data-color", "${cart[value].color}")
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

        function deleteItem() {
            /* ------- Reach each all delete buttons before listen to them ------ */
            const deleteButtons = document.querySelectorAll('.deleteItem');
            deleteButtons.forEach((deleteButton) => {
                /* ------- Listen to the delete button ------- */
                deleteButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    const itemId = cart[value].id;
                    const itemColor = cart[value].color;
                    cart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
                    localStorage.setItem("item", JSON.stringify(cart));
                    hydrateCart();
                    window.location.reload()
                });
            });
        };
        deleteItem();
    };
};

// /* ------- Modify item's quantity with input's arrows ------ */
// function changeQuantity() {
//     const itemQuantityInputs = document.querySelectorAll('.itemQuantity')
//     console.log(modifyQuantity)
//     itemQuantityInputs.forEach((itemQuantity) => {
//         itemQuantity.addEventListener("change", (event) => {
//             event.preventDefault();
//             const itemQuantityValue = event.target.value;

//         });
//     });
// };
/* ------- Reach each all delete buttons before listen to them ------ */
// deleteItem();
// function deleteItem() {
//     const deleteButtons = document.querySelectorAll('.deleteItem');
//     deleteButtons.forEach((deleteButton) => {
//         deleteButton.addEventListener("click", (event) => {
//             event.preventDefault();
//             const itemId = event.target.getAttribute("data-id");
//             const itemColor = event.target.getAttribute("data-color");
//             console.log(itemColor)
//             cart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
//             localStorage.setItem("item", JSON.stringify(cart));
//             hydrateCart();
//             window.location.reload()
//         });
//     });
// };


const sumQuantity = [];
const sumPrice = [];

getData();
async function getData() {
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