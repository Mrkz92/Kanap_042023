/* ------- Get the orderId from the backend ------- */
const getOrderId = new URL(location.href).searchParams.get("orderId");

if (!getOrderId) {
  const confirmation = document.querySelector("div.confirmation");
  const errorMessage = document.querySelector("p");
  errorMessage.innerText = `Un problème est survenu, veuillez nous en excuser.`;
  confirmation.appendChild(errorMessage);

  const redirectionBtn = document.createElement("a");
  redirectionBtn.innerText = "Retourner à l'accueil.";
  redirectionBtn.href = "./index.html";
  confirmation.appendChild(redirectionBtn);
}
/* ------- Hydrate the HTML with data ------- */
document.querySelector("span#orderId").innerText = `${getOrderId}`;
