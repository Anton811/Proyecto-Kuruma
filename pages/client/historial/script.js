const token = localStorage.getItem("token");
var user;

if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

$(document).ready(() => {
  cargarHistorial();
});

async function cargarHistorial() {
  try {
    // 1. Traer todos los pedidos
    const dataPedidos = await fetch("http://localhost:3000/api/pedido/cargarPedidos").then(
      (e) => e.json(),
    );
    const pedidos = dataPedidos.body;

    // 2. Filtrar los pedidos del cliente
    const pedidosCliente = pedidos.filter((p) => p.idCliente === user.id);

    if (pedidosCliente.length === 0) {
      $("#accordion").html(`
        <div class="alert alert-info">No tienes compras registradas.</div>
      `);
      return;
    }

    // 3. Construir el acordeón dinámicamente
    let acordeon = "";

    for (const pedido of pedidosCliente) {
      // Traer nombre del auto
      const dataAuto = await fetch(`http://localhost:3000/api/auto/${pedido.idAuto}`).then(
        (e) => e.json(),
      );
      const auto = dataAuto.body;

      // Traer estatus
      const dataEstatus = await fetch(
        `http://localhost:3000/api/pedido/cargarEstatus/${pedido.idEstatus}`,
      ).then((e) => e.json());
      const estatus = dataEstatus.body;

      acordeon += `
        <div class="card">
          <div class="card-header bg-white">
            <a class="btn" data-bs-toggle="collapse" href="#pedido${pedido.idPedido}">
              <strong>${auto.nombreAuto}</strong> &nbsp;|&nbsp; Folio #${pedido.idPedido} &nbsp;|&nbsp; ${pedido.fechaInicioPedido.slice(0, 10)}
            </a>
          </div>
          <div id="pedido${pedido.idPedido}" class="collapse" data-bs-parent="#accordion">
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <p><strong>Auto:</strong> ${auto.nombreAuto}</p>
                  <p><strong>Folio:</strong> #${pedido.idPedido}</p>
                  <p><strong>Fecha de compra:</strong> ${pedido.fechaInicioPedido.slice(0, 10)}</p>
                  <p><strong>Fecha estimada de entrega:</strong> ${pedido.fechaFinalPedido.slice(0, 10)}</p>
                </div>
                <div class="col-6">
                  <p><strong>Estatus:</strong> ${estatus.nombreEstatus}</p>
                  <p><strong>Descripción:</strong> ${estatus.descripcionEstatus}</p>
                  <p><strong>Precio:</strong> $${pedido.precio.toLocaleString()} mxn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    $("#accordion").html(acordeon);
  } catch (error) {
    console.error("Error al cargar el historial:", error);
  }
}
