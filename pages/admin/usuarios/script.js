var usuariosTotales;

$("document").ready(() => {
  cargarUsuarios();
  cargarRoles();

  $("#tableUsuarios").on("click", ".btn-Modificar", function () {
    const id = $(this).data("id");
    // Buscamos en tu variable global de usuarios
    const u = usuariosTotales.find((user) => user.idUsuario == id);

    if (u) {
      $("#formModificarUsuarioId").val(u.idUsuario);
      $("#formModificarUsuarioNombre").val(u.nombreUsuario);
      $("#formModificarUsuarioApp").val(u.appUsuario);
      $("#formModificarUsuarioApm").val(u.apmUsuario);
      $("#formModificarUsuarioRol").val(u.idRol);
      $("#formModificarUsuarioCorreo").val(u.correoUsuario);
      $("#formModificarUsuarioTel").val(u.telUsuario);
    }
  });

  $("#tableUsuarios").on("click", ".btn-Eliminar", async function () {
    const id = $(this).data("id");

    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/eliminar/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          cargarUsuarios();
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error en la petición de borrado:", error);
      }
    }
  });

  $("#formModificarUsuario").submit(async (e) => {
    e.preventDefault();
    const id = $("#formModificarUsuarioId").val();

    const datos = {
      nombre: $("#formModificarUsuarioNombre").val(),
      app: $("#formModificarUsuarioApp").val(),
      apm: $("#formModificarUsuarioApm").val() || "",
      rol: $("#formModificarUsuarioRol").val(),
      correo: $("#formModificarUsuarioCorreo").val(),
      tel: $("#formModificarUsuarioTel").val(),
    };

    const response = await fetch(`http://localhost:3000/api/usuario/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).then((res) => res.json());

    alert(response.message);
    bootstrap.Modal.getInstance($("#modalModificarUsuario")).hide();
    cargarUsuarios();
  });
});

$("#formAgregarUsuario").submit(async (e) => {
  e.preventDefault();

  const usuario = {
    nombre: $("#formAgregarUsuarioNombre").val(),
    app: $("#formAgregarUsuarioApp").val(),
    apm: $("#formAgregarUsuarioApm").val() || "",
    rol: $("#formAgregarUsuarioRol").val(),
    correo: $("#formAgregarUsuarioCorreo").val(),
    telefono: $("#formAgregarUsuarioTel").val(),
    password: $("#formAgregarUsuarioPassword").val(),
  };

  const data = await fetch("http://localhost:3000/api/usuario/agregarUsuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  }).then((e) => e.json());

  alert(data);
  cargarUsuarios();
});

async function cargarUsuarios() {
  const data = await fetch("http://localhost:3000/api/usuario/cargarUsuarios").then((e) =>
    e.json(),
  );
  console.log(data.message);
  const usuarios = data.body;
  usuariosTotales = data.body;
  console.log(usuarios);
  let table = "";
  usuarios.forEach((usuario) => {
    table += `<tr>
                <td>${usuario.idUsuario}</td>
                <td>${usuario.nombreUsuario} ${usuario.appUsuario} ${usuario.apmUsuario || ""}</td>
                <td>${usuario.nombreRol}</td>
                <td><button data-bs-toggle="modal" data-bs-target="#modalModificarUsuario" data-id="${usuario.idUsuario}" class="btn-Modificar btn btn-primary">Modificar</button><button class="btn btn-danger btn-Eliminar" data-id="${usuario.idUsuario}">Eliminar</button></td>
            </tr>`;
  });
  $("#tableUsuarios").html(table);
}

async function cargarRoles() {
  const data = await fetch("http://localhost:3000/api/usuario/rol/cargarRoles").then((e) =>
    e.json(),
  );
  console.log(data.message);
  const roles = data.body;
  let select = "";
  roles.forEach((rol) => {
    select += `<option value="${rol.idRol}">${rol.nombreRol}</option>`;
  });

  $("#formAgregarUsuarioRol").html(select);
  $("#formModificarUsuarioRol").html(select);

  cargarUsuarios;
}
