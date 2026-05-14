$("document").ready(() => {
  cargarUsuarios();
  cargarRoles();
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
  console.log(usuarios);
  let table = "";
  usuarios.forEach((usuario) => {
    table += `<tr>
                <td>${usuario.idUsuario}</td>
                <td>${usuario.nombreUsuario} ${usuario.appUsuario} ${usuario.apmUsuario || ""}</td>
                <td>${usuario.nombreRol}</td>
                <td><button class="btn btn-primary">Modificar</button><button class="btn btn-danger">Eliminar</button></td>
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

  cargarUsuarios;
}
