const token = localStorage.getItem("token");
var user;

if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

$(document).ready(() => {
  cargarVenta();

  $("#btnContinuar").click(() => continuarVenta());
  $("#btnCancelar").click(() => cancelarVenta());
});

async function cargarVenta() {
  try {
    const dataPedidos = await fetch("http://localhost:3000/api/pedido/cargarPedidos").then(
      (e) => e.json(),
    );
    const pedidos = dataPedidos.body;

    const pedido = pedidos.find((p) => p.idVendedor === user.id && p.idEstatus < 6);

    if (!pedido) {
      $("#nombreAuto").text("Sin venta activa");
      $("#folio").text("N/A");
      $("#fecha").text("N/A");
      $("#cliente").text("N/A");
      $("#estatus").text("No tienes ninguna venta activa.");
      $("#btnContinuar").hide();
      $("#btnCancelar").hide();
      return;
    }

    const dataAuto = await fetch(`http://localhost:3000/api/auto/${pedido.idAuto}`).then((e) =>
      e.json(),
    );
    const auto = dataAuto.body;

    const dataEstatus = await fetch(
      `http://localhost:3000/api/pedido/cargarEstatus/${pedido.idEstatus}`,
    ).then((e) => e.json());
    const estatus = dataEstatus.body;

    const dataCliente = await fetch(`http://localhost:3000/api/usuario/cargarUsuarios`).then(
      (e) => e.json(),
    );
    const clientes = dataCliente.body;
    const cliente = clientes.find((u) => u.idUsuario === pedido.idCliente);

    $("#nombreAuto").text(auto.nombreAuto);
    $("#folio").text(`Folio: #${pedido.idPedido}`);
    $("#fecha").text(`Fecha: ${pedido.fechaInicioPedido.slice(0, 10)}`);
    $("#cliente").text(
      `Cliente: ${cliente.nombreUsuario} ${cliente.appUsuario} ${cliente.apmUsuario}`,
    );
    $("#estatus").text(`Estatus: ${estatus.nombreEstatus}`);

    $("#content").html(`
      <div class="alert alert-info mt-3">
        <strong>Estatus actual:</strong> ${estatus.nombreEstatus} <br>
        <strong>Descripción:</strong> ${estatus.descripcionEstatus} <br>
        <strong>Fecha estimada de entrega:</strong> ${pedido.fechaFinalPedido.slice(0, 10)}
      </div>
    `);

    $("#btnContinuar").data("idPedido", pedido.idPedido).data("idEstatus", pedido.idEstatus);
    $("#btnCancelar").data("idPedido", pedido.idPedido);

    if (pedido.idEstatus === 5) {
      $("#btnContinuar").text("Confirmar Entrega");
    }
  } catch (error) {
    console.error("Error al cargar la venta:", error);
  }
}

async function continuarVenta() {
  const idPedido = $("#btnContinuar").data("idPedido");
  const idEstatusActual = $("#btnContinuar").data("idEstatus");
  const nuevoEstatus = idEstatusActual + 1;

  const confirmacion = confirm(`¿Confirmas avanzar al siguiente paso?`);
  if (!confirmacion) return;

  const data = await fetch(`http://localhost:3000/api/pedido/actualizarEstatus/${idPedido}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idEstatus: nuevoEstatus }),
  }).then((e) => e.json());

  console.log(data.message);
  alert("Venta actualizada exitosamente.");
  location.reload();
}

async function cancelarVenta() {
  const idPedido = $("#btnCancelar").data("idPedido");

  const confirmacion = confirm("¿Estás seguro de que deseas rechazar esta venta?");
  if (!confirmacion) return;

  const data = await fetch(`http://localhost:3000/api/pedido/actualizarEstatus/${idPedido}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idEstatus: 8 }),
  }).then((e) => e.json());

  console.log(data.message);
  alert("Venta rechazada.");
  location.reload();
}
