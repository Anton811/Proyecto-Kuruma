const token = localStorage.getItem("token");
var user;
if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

$(document).ready(() => {
  cargarDatosUsuario();
  cargarPagos();

  // Modificar datos del usuario
  $("#formModificarCliente").submit(async (e) => {
    e.preventDefault();

    const datos = {
      nombre: $("#formModificarClienteNombre").val(),
      app: $("#formModificarClienteApp").val(),
      apm: $("#formModificarClienteApm").val(),
      rol: user.idRol,
      correo: $("#formModificarClienteCorreo").val(),
      tel: $("#formModificarClienteTel").val(),
    };

    const data = await fetch(`http://localhost:3000/api/usuario/modificar/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).then((e) => e.json());

    alert(data.message);
  });

  // Agregar tarjeta
  $("#formAgregarTarjeta").submit(async (e) => {
    e.preventDefault();

    const tarjeta = {
      id: user.id,
      nombre: $("#formAgregarTarjetaNombre").val(),
      mes: $("#formAgregarTarjetaMes").val(),
      anio: $("#formAgregarTarjetaAnio").val(),
      numero: $("#formAgregarTarjetaNumero").val(),
    };

    const data = await fetch("http://localhost:3000/api/usuario/pago/agregarPago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarjeta),
    }).then((e) => e.json());

    alert(data);
    $("#formAgregarTarjeta")[0].reset();
    bootstrap.Modal.getInstance(document.getElementById("modalTarjeta")).hide();
    cargarPagos();
  });

  // Eliminar tarjeta
  $(document).on("click", "#seccionPagos .btn-danger", async function () {
    const idPago = $(this).data("id");
    const confirmacion = confirm("¿Deseas eliminar esta tarjeta?");
    if (!confirmacion) return;

    const data = await fetch(`http://localhost:3000/api/usuario/pago/eliminarPago/${idPago}`, {
      method: "DELETE",
    }).then((e) => e.json());

    alert(data.message);
    cargarPagos();
  });
});

async function cargarDatosUsuario() {
  const data = await fetch(`http://localhost:3000/api/usuario/cargarUsuarios`).then((e) =>
    e.json(),
  );
  const usuarios = data.body;
  const usuario = usuarios.find((u) => u.idUsuario === user.id);

  if (!usuario) return;

  $("#formModificarClienteNombre").val(usuario.nombreUsuario);
  $("#formModificarClienteApp").val(usuario.appUsuario);
  $("#formModificarClienteApm").val(usuario.apmUsuario);
  $("#formModificarClienteTel").val(usuario.telUsuario);
  $("#formModificarClienteCorreo").val(usuario.correoUsuario);
}

async function cargarPagos() {
  const data = await fetch(
    `http://localhost:3000/api/usuario/pago/cargarPagos/${user.id}`,
  ).then((e) => e.json());
  const pagos = data.body;

  if (!pagos || pagos.length === 0) {
    $("#seccionPagos").html(
      `<p class="text-secondary p-3">No tienes tarjetas registradas.</p>`,
    );
    return;
  }

  let container = "";
  pagos.forEach((pago) => {
    container += `
      <div class="row border rounded border-light p-3">
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
