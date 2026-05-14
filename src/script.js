$("document").ready(() => {
  cargarUltimosModelos();

  $("#ultimosAutos").on("click", ".autoInfo", function () {
    const idSeleccionado = $(this).data("id");
    localStorage.setItem("auto", idSeleccionado);
    window.location.href = "/pages/vehiculo/index.html";
  });
});

async function cargarUltimosModelos() {
  const data = await fetch("http://localhost:3000/api/auto/cargarUltimosAutos").then((e) =>
    e.json(),
  );
  const autos = data.body;
  console.log(data.body);
  let content = "";

  autos.forEach((auto) => {
    content += `<div class="col d-flex justify-content-center">
              <div class="card" style="width: 300px">
                <img class="card-img-top" src="./src/img/fondoAuto.png" alt="Card image" />
                <div class="card-body">
                  <h4 class="card-title">${auto.nombreAuto}</h4>
                  <h6 class="text-secondary">${auto.carroceriaAuto}<h6>
                  <p class="card-text">Ultimo modelo diseñado para el proyecto fase 3 de programacion web lab</p>
                  <button class="autoInfo btn btn-purple" data-id="${auto.idAuto}">Ver mas</button>
                </div>
              </div>
            </div>`;
  });

  $("#ultimosAutos").html(content);
}
