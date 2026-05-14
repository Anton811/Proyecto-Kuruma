document.getElementById("barNav").innerHTML =
  `<ul class="navbar-nav d-flex justify-content-around w-100">
        <li class="nav-item d-flex align-items-center">
          <input
            type="search"
            name="barNavBuscar"
            id="barNavBuscar"
            placeholder="Buscar..."
            class="rounded-4 h-50 w-100 bg-white"
          />
        </li>
        <li class="nav-item d-flex align-items-center">
          <a class="nav-link" href="/pages/modelos/index.html">Modelos</a>
        </li>
        <li class="nav-item d-flex align-items-center">
          <a class="nav-link" href="/pages/contacto/index.html">Contacto</a>
        </li>
        <li class="nav-item d-flex align-items-center">
          <a class="nav-link" href="/index.html"><h1>Kuruma</h1></a>
        </li>
        <li class="nav-item d-flex align-items-center">
          <a class="nav-link" href="/pages/sobreNosotros/index.html">Sobre Nosotros</a>
        </li>
        <li class="nav-item d-flex align-items-center">
          <div>
            <button id="btnLogin" class="btn btn-light">Iniciar Sesion</button>
            <button id="btnRegistro" class="btn btn-purple">Registrarse</button>
          </div>
        </li>
      </ul>`;

$("document").ready(() => {
  $("#btnRegistro").click(() => {
    window.location.href = "/pages/registro/index.html";
  });
  $("#btnLogin").click(() => {
    window.location.href = "/pages/login/index.html";
  });
});
