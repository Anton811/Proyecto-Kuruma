const token = localStorage.getItem("token");
var user;

if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

$(document).ready(() => {
  cargarReporte();

  $("#btnFiltrar").click(() => cargarReporte());
});

async function cargarReporte() {
  try {
    const fechaInicial = $("#fechaInicial").val();
    const fechaFinal = $("#fechaFinal").val();

    // 1. Traer todos los pedidos
    const dataPedidos = await fetch("http://localhost:3000/api/pedido/cargarPedidos").then(
      (e) => e.json(),
    );
    const pedidos = dataPedidos.body;

    // 2. Filtrar pedidos del vendedor
    let pedidosVendedor = pedidos.filter((p) => p.idVendedor === user.id);

    // 3. Filtrar por rango de fechas si se seleccionaron
    if (fechaInicial && fechaFinal) {
      pedidosVendedor = pedidosVendedor.filter((p) => {
        const fechaPedido = p.fechaInicioPedido.slice(0, 10);
        return fechaPedido >= fechaInicial && fechaPedido <= fechaFinal;
      });
    }

    // 4. Separar movimientos y cancelaciones
    const movimientos = pedidosVendedor.filter((p) => p.idEstatus !== 7 && p.idEstatus !== 8);
    const cancelaciones = pedidosVendedor.filter(
      (p) => p.idEstatus === 7 || p.idEstatus === 8,
    );

    // 5. Llenar tabla movimientos
    await llenarTabla("#tableMovimientos", movimientos);

    // 6. Llenar tabla cancelaciones
    await llenarTabla("#tableCancelaciones", cancelaciones);
  } catch (error) {
    console.error("Error al cargar el reporte:", error);
  }
}

async function llenarTabla(tablaId, pedidos) {
  if (pedidos.length === 0) {
    $(tablaId).html(`<tr><td colspan="3" class="text-center">Sin registros</td></tr>`);
    return;
  }

  let filas = "";
  for (const pedido of pedidos) {
    const dataAuto = await fetch(`http://localhost:3000/api/auto/${pedido.idAuto}`).then((e) =>
      e.json(),
    );
    const auto = dataAuto.body;

    filas += `
      <tr>
        <td>#${pedido.idPedido}</td>
        <td>${auto.nombreAuto}</td>
        <td>$${pedido.precio.toLocaleString()} mxn</td>
      </tr>
    `;
  }

  $(tablaId).html(filas);
}
