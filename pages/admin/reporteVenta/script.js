$(document).ready(() => {
  cargarVendedoresSelect();
  cargarReporte();

  $("#btnFiltrar").click(() => cargarReporte());
});

async function cargarVendedoresSelect() {
  const data = await fetch("http://localhost:3000/api/pedido/cargarVendedores").then((e) =>
    e.json(),
  );
  const vendedores = data.body;

  let opciones = `<option value="">Todos</option>`;
  vendedores.forEach((v) => {
    opciones += `<option value="${v.idUsuario}">${v.nombreUsuario} ${v.appUsuario}</option>`;
  });

  $("#selectVendedor").html(opciones);
}

async function cargarReporte() {
  try {
    const fechaInicial = $("#fechaInicial").val();
    const fechaFinal = $("#fechaFinal").val();
    const idVendedor = $("#selectVendedor").val();

    // 1. Traer todos los pedidos
    const dataPedidos = await fetch("http://localhost:3000/api/pedido/cargarPedidos").then(
      (e) => e.json(),
    );
    const pedidos = dataPedidos.body;

    // 2. Filtrar por vendedor si se seleccionó
    let pedidosFiltrados = idVendedor
      ? pedidos.filter((p) => p.idVendedor === parseInt(idVendedor))
      : pedidos;

    // 3. Filtrar por fechas si se seleccionaron
    if (fechaInicial && fechaFinal) {
      pedidosFiltrados = pedidosFiltrados.filter((p) => {
        const fechaPedido = p.fechaInicioPedido.slice(0, 10);
        return fechaPedido >= fechaInicial && fechaPedido <= fechaFinal;
      });
    }

    // 4. Separar movimientos y cancelaciones
    const movimientos = pedidosFiltrados.filter((p) => p.idEstatus !== 7 && p.idEstatus !== 8);
    const cancelaciones = pedidosFiltrados.filter(
      (p) => p.idEstatus === 7 || p.idEstatus === 8,
    );

    // 5. Llenar tablas
    await llenarTabla("#tableMovimientos", movimientos);
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
