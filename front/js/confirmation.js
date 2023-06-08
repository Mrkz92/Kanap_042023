/* ------- Get the orderId from the backend ------- */
const getOrderId = new URL(location.href).searchParams.get("orderId");

if (!getOrderId) {
  document.querySelector("div.confirmation").innerHTML = `<p>Problème serveur !</p>`;
  alert("Un problème est survenu, veuillez nous en excuser.");
  document.location.href = `index.html`;
}
/* ------- Hydrate the HTML with data ------- */
document.querySelector("span#orderId").innerText = `${getOrderId}`;
