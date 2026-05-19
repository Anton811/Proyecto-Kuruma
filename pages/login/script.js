$("#formLogin").submit(async (e) => {
  e.preventDefault();
  const login = {
    correo: $("#formLoginCorreo").val(),
    password: $("#formLoginPassword").val(),
  };
  const data = await fetch("http://localhost:3000/api/usuario/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  }).then((e) => e.json());
  if (!data) {
    alert("Usuario no encontrado");
    return;
  }
  const usuario = data.body;
  localStorage.setItem("token", data.token);
  if (usuario.idRol == 1) window.location.href = "/pages/client/seguimiento/index.html";
  if (usuario.idRol == 2) window.location.href = "/pages/seller/seguimiento/index.html";
  if (usuario.idRol == 3) window.location.href = "/pages/admin/reporteProductos/index.html";
});
