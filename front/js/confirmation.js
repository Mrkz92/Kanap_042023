const getOrderId = new URL(location.href).searchParams.get("orderId");

document.querySelector('span#orderId').innerText = `${getOrderId}`;