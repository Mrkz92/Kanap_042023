/* ------- Get the orderId from the backend ------- */
const getOrderId = new URL(location.href).searchParams.get("orderId");

/* ------- Hydrate the HTML with data ------- */
document.querySelector('span#orderId').innerText = `${getOrderId}`;