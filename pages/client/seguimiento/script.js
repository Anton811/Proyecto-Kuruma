const token = localStorage.getItem("token");
var user;

if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

// Estatus 1-5 son el flujo normal de compra (para la barra de progreso)
// 6 = Entregado, 7 = Cancelado, 8 = Rechazado, 9 = Pendiente
const estatusConfig = {
  1: { progreso: 20, color: "bg-purple" },
  2: { progreso: 40, color: "bg-purple" },
  3: { progreso: 60, color: "bg-purple" },
  4: { progreso: 80, color: "bg-purple" },
  5: { progreso: 90, color: "bg-purple" },
  6: { progreso: 100, color: "bg-success" },
  7: { progreso: 100, color: "bg-danger" },
  8: { progreso: 100, color: "bg-danger" },
  9: { progreso: 10, color: "bg-warning" },
};

$(document).ready(() => {
  cargarPedido();
});

async function cargarPedido() {
  try {
    // 1. Traer todos los pedidos
    const dataPedidos = await fetch("http://localhost:3000/api/pedido/cargarPedidos").then(
      (e) => e.json(),
    );
    const pedidos = dataPedidos.body;

    // 2. Buscar el pedido activo del cliente
    const pedido = pedidos.find(
      (p) => p.idCliente === user.id && p.idEstatus < 7, // Excluye cancelado y rechazado
    );

    if (!pedido) {
      $("#nombreAuto").text("Sin pedido activo");
      $("#folio").text("N/A");
      $("#fecha").text("N/A");
      $("#estatus").text("No tienes ninguna compra activa.");
      $("#descripcion").text("");
      $("#fechaEntrega").text("");
      return;
    }

    // 3. Traer info del auto
    const dataAuto = await fetch(`http://localhost:3000/api/auto/${pedido.idAuto}`).then((e) =>
      e.json(),
    );
    const auto = dataAuto.body;

    // 4. Traer info del estatus
    const dataEstatus = await fetch(
      `http://localhost:3000/api/pedido/cargarEstatus/${pedido.idEstatus}`,
    ).then((e) => e.json());
    const estatus = dataEstatus.body;

    // 5. Actualizar UI
    $("#nombreAuto").text(auto.nombreAuto);
    $("#folio").text(`Folio: #${pedido.idPedido}`);
    $("#fecha").text(`Fecha: ${pedido.fechaInicioPedido.slice(0, 10)}`);
    $("#estatus").text(estatus.nombreEstatus);
    $("#descripcion").text(estatus.descripcionEstatus);
    $("#fechaEntrega").text(
      `Fecha estimada de entrega: ${pedido.fechaFinalPedido.slice(0, 10)}`,
    );

    // 6. Actualizar barra de progreso
    const config = estatusConfig[pedido.idEstatus];
    $(".progress-bar")
      .css("width", `${config.progreso}%`)
      .removeClass("bg-purple bg-success bg-danger bg-warning")
      .addClass(config.color);

    // 7. Mostrar u ocultar botón cancelar (no mostrar si ya está entregado, cancelado o rechazado)
    if (pedido.idEstatus >= 6) {
      $(".btn-danger").hide();
    } else {
      $(".btn-danger").click(() => cancelarPedido(pedido.idPedido));
    }
  } catch (error) {
    console.error("Error al cargar el pedido:", error);
  }
}

async function cancelarPedido(idPedido) {
  const confirmacion = confirm("¿Estás seguro de que deseas cancelar tu compra?");
  if (!confirmacion) return;

  const data = await fetch(`http://localhost:3000/api/pedido/actualizarEstatus/${idPedido}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idEstatus: 7 }), // 7 = Cancelado
  }).then((e) => e.json());

  console.log(data.message);
  alert("Tu compra ha sido cancelada.");
  location.reload();
}
