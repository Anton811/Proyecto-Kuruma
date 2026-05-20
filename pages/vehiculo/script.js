const idAuto = localStorage.getItem("auto");
const token = localStorage.getItem("token");
var precioAuto;
var user;

// Validacion de sesion y rol al cargar
if (!token) {
  alert("Debes iniciar sesion para comprar.");
  window.location.href = "/pages/login/index.html";
} else {
  user = JSON.parse(atob(token.split(".")[1]));

  if (user.idRol !== 1) {
    alert("Solo los clientes pueden realizar compras.");
    window.location.href = "/index.html";
  }
}

$(document).ready(async () => {
  await cargarAuto();
  cargarPagos();

  $("#btnAgregarPedido").click(() => agregarPedido());
});

async function cargarAuto() {
  const data = await fetch(`http://localhost:3000/api/auto/${idAuto}`).then((e) => e.json());
  const auto = data.body;
  precioAuto = auto.precioAuto;
  $("#nombreAuto").text(auto.nombreAuto);
  $("#precioAuto").text(`$ ${auto.precioAuto.toLocaleString()} mxn`);
  $("#descripcionAuto").text(auto.descripcionAuto);
}

async function cargarPagos() {
  const data = await fetch(
    `http://localhost:3000/api/usuario/pago/cargarPagos/${user.id}`,
  ).then((e) => e.json());
  const pagos = data.body;

  if (!pagos || pagos.length === 0) {
    $("#formAgregarPedidoPago").html(
      `<option disabled>No tienes tarjetas registradas</option>`,
    );
    $("#btnAgregarPedido").prop("disabled", true); // Deshabilita el boton si no hay tarjetas
    return;
  }

  let op = "";
  pagos.forEach((pago) => {
    op += `<option value="${pago.idPago}">•••• ${pago.numeroTarjeta.slice(-4)}</option>`;
  });
  $("#formAgregarPedidoPago").html(op);
}

async function agregarPedido() {
  const [dataPedidos, dataVendedores] = await Promise.all([
    fetch("http://localhost:3000/api/pedido/cargarPedidos").then((e) => e.json()),
    fetch("http://localhost:3000/api/pedido/cargarVendedores").then((e) => e.json()),
  ]);

  const pedidos = dataPedidos.body;
  const vendedores = dataVendedores.body;

  //  Verificar si el cliente ya tiene un pedido activo
  const pedidoExistente = pedidos.find((p) => p.idCliente === user.id && p.idEstatus < 6);

  if (pedidoExistente) {
    alert("Ya tienes un pedido activo. No puedes realizar otra compra hasta que se complete.");
    return;
  }

  // Buscar vendedor disponible
  const pedidosActivos = pedidos.filter((p) => p.idEstatus < 6);
  const vendedor = vendedores.find((v) => {
    return !pedidosActivos.some((p) => p.idVendedor === v.idUsuario);
  });

  if (!vendedor) {
    alert("No hay vendedores disponibles en este momento. Intenta más tarde.");
    return;
  }

  const idPago = $("#formAgregarPedidoPago").val();
  const hoy = new Date();
  const fechaFinal = new Date();
  fechaFinal.setDate(hoy.getDate() + 7);

  const pedido = {
    idCliente: user.id,
    idAuto: idAuto,
    idVendedor: vendedor.idUsuario,
    idEstatus: 1,
    fechaInicioPedido: hoy.toISOString().slice(0, 10),
    fechaFinalPedido: fechaFinal.toISOString().slice(0, 10),
    idPago: idPago,
    precio: precioAuto,
  };

  const data = await fetch("http://localhost:3000/api/pedido/agregarPedido", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  }).then((e) => e.json());

  console.log(data.message);
  alert("¡Pedido realizado con éxito!");
  window.location.href = "/pages/client/seguimiento/index.html";
}
