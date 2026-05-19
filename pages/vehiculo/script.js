const idAuto = localStorage.getItem("auto");
const token = localStorage.getItem("token");
var precioAuto; // ✅ Guardamos el precio directo desde la BD
var user;

if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

$(document).ready(() => {
  cargarAuto();
  cargarPagos();

  $("#btnAgregarPedido").click(() => {
    agregarPedido();
  });
});

async function cargarAuto() {
  const data = await fetch(`http://localhost:3000/api/auto/${idAuto}`).then((e) => e.json());
  const auto = data.body;
  precioAuto = auto.precioAuto; // ✅ Guardamos el precio como entero directo de la BD
  $("#nombreAuto").text(auto.nombreAuto);
  $("#precioAuto").text(`$ ${auto.precioAuto} mxn`);
  $("#descripcionAuto").text(auto.descripcionAuto);
}

async function cargarPagos() {
  const data = await fetch(
    `http://localhost:3000/api/usuario/pago/cargarPagos/${user.id}`,
  ).then((e) => e.json());
  const pagos = data.body;
  let op = "";

  pagos.forEach((pago) => {
    op += `<option value="${pago.idPago}">•••• ${pago.numeroTarjeta.slice(-4)}</option>`;
  });

  $("#formAgregarPedidoPago").html(op);
}

async function obtenerVendedorDisponible() {
  // 1. Traer todos los vendedores
  const dataVendedores = await fetch("http://localhost:3000/api/pedido/cargarVendedores").then(
    (e) => e.json(),
  );
  const vendedores = dataVendedores.body;

  // 2. Traer todos los pedidos
  const dataPedidos = await fetch("http://localhost:3000/api/pedido/cargarPedidos").then((e) =>
    e.json(),
  );
  const pedidos = dataPedidos.body;

  // 3. Filtrar pedidos activos (idEstatus < 6)
  const pedidosActivos = pedidos.filter((p) => p.idEstatus < 6);

  // 4. Encontrar primer vendedor sin pedido activo
  const vendedorDisponible = vendedores.find((vendedor) => {
    return !pedidosActivos.some((pedido) => pedido.idVendedor === vendedor.idUsuario);
  });

  return vendedorDisponible;
}

async function agregarPedido() {
  const idPago = $("#formAgregarPedidoPago").val();
  const vendedor = await obtenerVendedorDisponible();

  if (!vendedor) {
    alert("No hay vendedores disponibles en este momento.");
    return;
  }

  const hoy = new Date();
  const fechaFinal = new Date();
  fechaFinal.setDate(hoy.getDate() + 7);

  const pedido = {
    idCliente: user.id,
    idAuto: idAuto,
    idVendedor: vendedor.idUsuario, // ✅ Usando idUsuario que viene de la tabla usuario
    idEstatus: 1,
    fechaInicioPedido: hoy.toISOString().slice(0, 10),
    fechaFinalPedido: fechaFinal.toISOString().slice(0, 10),
    idPago: idPago,
    precio: precioAuto, // ✅ Entero directo de la BD
  };

  const data = await fetch("http://localhost:3000/api/pedido/agregarPedido", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  }).then((e) => e.json());

  console.log(data.message);
  alert("¡Pedido realizado con éxito!");
}
