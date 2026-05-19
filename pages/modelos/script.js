var autosTotales;

$(document).ready(async () => {
  await cargarAutos();
  colocarAutos();

  $(document).on("click", ".autoInfo", function () {
    const idSeleccionado = $(this).data("id");
    localStorage.setItem("auto", idSeleccionado);
    window.location.href = "/pages/vehiculo/index.html";
  });
});

async function cargarAutos() {
  const data = await fetch("http://localhost:3000/api/auto/cargarAutos").then((e) => e.json());
  console.log(data.message);
  const autos = data.body;
  autosTotales = autos;
  console.log(autos);
}

async function colocarAutos() {
  let card = "";
  autosKurumaSports = autosTotales.filter((e) => e.carroceriaAuto == "Kuruma Sports");
  autosKurumaSports.forEach((e) => {
    card += `<div class="col d-flex justify-content-center">
            <div class="card" style="width: 300px">
              <img class="card-img-top" src="/src/img/fondoAuto.png" alt="Card image" />
              <div class="card-body">
                <h4 class="card-title">${e.nombreAuto}</h4>
                <p class="card-text">Ultimo modelo diseñado para el proyecto fase 3 de programacion web lab</p>
                <button class="autoInfo btn btn-purple" data-id="${e.idAuto}">Ver mas</button>
              </div>
            </div>
          </div>`;
  });
  $("#filaKurumaSports").html(card);
  card = "";

  autosMeteoro = autosTotales.filter((e) => e.carroceriaAuto == "Meteoro");
  autosMeteoro.forEach((e) => {
    card += `<div class="col d-flex justify-content-center">
            <div class="card" style="width: 300px">
              <img class="card-img-top" src="/src/img/fondoAuto.png" alt="Card image" />
              <div class="card-body">
                <h4 class="card-title">${e.nombreAuto}</h4>
                <p class="card-text">Ultimo modelo diseñado para el proyecto fase 3 de programacion web lab</p>
                <button class="autoInfo btn btn-purple" data-id="${e.idAuto}">Ver mas</button>
              </div>
            </div>
          </div>`;
  });
  $("#filaMeteoro").html(card);
  card = "";

  autosMcQueen = autosTotales.filter((e) => e.carroceriaAuto == "McQueen");
  autosMcQueen.forEach((e) => {
    card += `<div class="col d-flex justify-content-center">
            <div class="card" style="width: 300px">
              <img class="card-img-top" src="/src/img/fondoAuto.png" alt="Card image" />
              <div class="card-body">
                <h4 class="card-title">${e.nombreAuto}</h4>
                <p class="card-text">Ultimo modelo diseñado para el proyecto fase 3 de programacion web lab</p>
                <button class="autoInfo btn btn-purple" data-id="${e.idAuto}">Ver mas</button>
              </div>
            </div>
          </div>`;
  });
  $("#filaMcQueen").html(card);
  card = "";

  autosNeedForSpeed = autosTotales.filter((e) => e.carroceriaAuto == "Need For Speed");
  autosNeedForSpeed.forEach((e) => {
    card += `<div class="col d-flex justify-content-center">
            <div class="card" style="width: 300px">
              <img class="card-img-top" src="/src/img/fondoAuto.png" alt="Card image" />
              <div class="card-body">
                <h4 class="card-title">${e.nombreAuto}</h4>
                <p class="card-text">Ultimo modelo diseñado para el proyecto fase 3 de programacion web lab</p>
                <button class="autoInfo btn btn-purple" data-id="${e.idAuto}">Ver mas</button>
              </div>
            </div>
          </div>`;
  });
  $("#filaNeedForSpeed").html(card);
}
