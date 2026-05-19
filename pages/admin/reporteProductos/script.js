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

    // 2. Filtrar solo completados
    let pedidosFiltrados = pedidos.filter((p) => p.idEstatus === 6);

    // 3. Filtrar por fechas si se seleccionaron
    if (fechaInicial && fechaFinal) {
      pedidosFiltrados = pedidosFiltrados.filter((p) => {
        const fechaPedido = p.fechaInicioPedido.slice(0, 10);
        return fechaPedido >= fechaInicial && fechaPedido <= fechaFinal;
      });
    }

    // 4. Filtrar por vendedor si se seleccionó
    if (idVendedor) {
      pedidosFiltrados = pedidosFiltrados.filter((p) => p.idVendedor === parseInt(idVendedor));
    }

    // 5. Llenar tabla
    if (pedidosFiltrados.length === 0) {
      $("#tableProductos").html(`
        <tr><td colspan="3" class="text-center">Sin registros</td></tr>
      `);
      return;
    }

    let filas = "";
    for (const pedido of pedidosFiltrados) {
      const dataAuto = await fetch(`http://localhost:3000/api/auto/${pedido.idAuto}`).then(
        (e) => e.json(),
      );
      const auto = dataAuto.body;

      filas += `
        <tr>
          <td>#${pedido.idPedido}</td>
          <td>${auto.nombreAuto}</td>
          <td>${pedido.fechaInicioPedido.slice(0, 10)}</td>
        </tr>
      `;
    }

    $("#tableProductos").html(filas);
  } catch (error) {
    console.error("Error al cargar el reporte:", error);
  }
}
