$("#formRegistro").submit(async (e) => {
  e.preventDefault();
  let password = $("formRegistroPassword").val();
  let password2 = $("formRegistroPassword2").val();
  if (password != password2) {
    alert("Favor de verificar que las contraseñas coincidan");
    return;
  }

  const usuario = {
    nombre: $("#formRegistroNombre").val(),
    app: $("#formRegistroApp").val(),
    apm: $("#formRegistroApm").val() || "",
    rol: 1,
    correo: $("#formRegistroCorreo").val(),
    telefono: $("#formRegistroTel").val(),
    password: $("#formRegistroPassword").val(),
  };

  const data = await fetch("http://localhost:3000/api/usuario/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  }).then((e) => e.json());
  alert(data.message);
  localStorage.setItem("token", data.token);
  window.location.href = "/pages/client/seguimiento/index.html";
});
