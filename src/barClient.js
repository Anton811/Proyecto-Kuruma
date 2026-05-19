const token = localStorage.getItem("token");
var user;
if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}

document.getElementById("barClient").innerHTML = `
<ul class="nav flex-colum nav-tabs">
            <li class="panel nav-item w-100">
              <div class="d-flex justify-content-center rounded-3">
                <h2 id="nombreUsuario">Usuario Anonimo</h2>
              </div>
            </li>
            <li class="panel nav-item w-100">
              <a href="/pages/client/seguimiento/index.html" class="nav-link bg-white text-center py-3 rounded-3"
                >Seguimiento de compra</a
              >
            </li>
            <li class="panel nav-item w-100">
              <a href="/pages/client/historial/index.html" class="nav-link bg-white text-center py-3 rounded-3"
                >Historial de compra</a
              >
            </li>
            <li class="panel nav-item w-100">
              <a href="/pages/client/configuracion/index.html" class="nav-link bg-white text-center py-3">Configuracion</a>
            </li>
            <li class="nav-item w-100">
              <div class="my-3 d-flex justify-content-center">
                <button id="logout" class="btn btn-purple">Cerrar sesion</button>
              </div>
            </li>
          </ul>`;

$("document").ready(() => {
  $("#logout").click(() => {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
  });

  $("#nombreUsuario").text(`${user.nombre.split(" ")[0]} ${user.app}`);
});
