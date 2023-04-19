/* ------ Get data from localStorage ------- */
const cart = Array.from(JSON.parse(localStorage.getItem("item")));
if(cart.length == 0){
    const cartItems = document.querySelector("section#cart__items")
    cartItems.innerHTML = `<span>Votre panier est vide</span>`
}

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

        // /* ------- Modify item's quantity with input's arrows ------ */
        // const itemQuantityInputs = document.querySelectorAll('.itemQuantity')
        // console.log(modifyQuantity)
        // itemQuantityInputs.forEach((itemQuantity) => {
        //     itemQuantity.addEventListener("change", (event) => {
        //         event.preventDefault();
        //         const itemQuantityValue = event.target.value;
        //     });
        // });

        /* ------- Reach each all delete buttons before listen to them ------ */
        const deleteItem = document.querySelectorAll('.deleteItem');
        const deleteClick = () => {
            const itemColor = cart[value].color;
            const itemIndex = cart.findIndex(item => item.color === itemColor);
            if (0 <= itemIndex <= cart.length) {
                cart.splice(itemIndex, 1);
                localStorage.setItem("item", JSON.stringify(cart));
                hydrateCart();
                window.location.reload()
            }
        }
        /* ------- Listen to the delete button ------- */
        Array.prototype.forEach.call((deleteItem), (item) => {
            item.addEventListener("click", deleteClick);
        });
    }
}


const sumQuantity = [];
const sumPrice = [];

getData();
async function getData() {
    for(let v in cart) {
        const itemQuantity = parseInt(cart[v].quantity);
        sumQuantity.push(itemQuantity);

        const apiItem = await fetch(`http://localhost:3000/api/products/${cart[v].id}`)
        const itemData = await apiItem.json()
        const itemTotalPrice = itemData.price * parseInt(cart[v].quantity);
        sumPrice.push(itemTotalPrice);
    }

    const totalQuantity = sumQuantity.reduce((accumulator, currentValue) => accumulator + currentValue);
    const totalPrice = sumPrice.reduce((accumulator, currentValue) => accumulator + currentValue);

    const cartPrice = document.querySelector('.cart__price')
    cartPrice.innerHTML = `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice">${totalPrice}</span> €</p>`;
}