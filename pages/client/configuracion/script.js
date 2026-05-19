const token = localStorage.getItem("token");
var user;
if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

$("document").ready(() => {
  console.log(user);
  cargarPagos();
});

document.getElementById("formAgregarTarjeta").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tarjeta = {
    id: user.id,
    nombre: $("#formAgregarTarjetaNombre").val(),
    mes: $("#formAgregarTarjetaMes").val(),
    anio: $("#formAgregarTarjetaAnio").val(),
    numero: $("#formAgregarTarjetaNumero").val(),
  };

  const result = await fetch(`http://localhost:3000/api/usuario/pago/agregarPago`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarjeta),
  }).then((e) => e.json());

  alert(result);
  cargarTarjetas();
});

async function cargarPagos() {
  const data = await fetch(
    `http://localhost:3000/api/usuario/pago/cargarPagos/${user.id}`,
  ).then((e) => e.json());
  const pagos = data.body;
  let container = "";

  pagos.forEach((pago) => {
    container += `<div class="row border rounded border-light p-3">
              <div class="col-9 m-2">
                <h3>•••• ${pago.numeroTarjeta.slice(-4)}</h3>
                <h6 class="text-secondary">${pago.pagoMes}/${pago.pagoAnio}</h6>
              </div>
              <div class="col d-flex justify-content-center align-items-center">
                <button class="btn btn-danger" data-id="${pago.idPago}">Eliminar</button>
              </div>
            </div>`;
  });

  $("#seccionPagos").html(container);
}
