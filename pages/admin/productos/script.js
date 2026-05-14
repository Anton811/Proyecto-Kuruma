var autosTotales;

$("document").ready(() => {
  cargarAutos();

  $("#tableProductos").on("click", ".btn-Modificar", function () {
    const idSeleccionado = $(this).data("id");
    const auto = autosTotales.find((a) => a.idAuto == idSeleccionado);

    if (auto) {
      $("#formModificarAutoId").val(auto.idAuto);
      $("#formModificarAutoNombre").val(auto.nombreAuto);
      $("#formModificarAutoCarroceria").val(auto.carroceriaAuto);
      $("#formModificarAutoColor").val(auto.colorAuto);
      $("#formModificarAutoAnio").val(auto.anioAuto);
      $("#formModificarAutoPrecio").val(auto.precioAuto);
      $("#formModificarAutoDescripcion").val(auto.descripcionAuto);
      $("#formModificarAutoMotor").val(auto.motorAuto);
      $("#formModificarAutoTransmision").val(auto.transmisionAuto);
    }
  });

  $("#tableProductos").on("click", ".btn-Eliminar", async function () {
    const id = $(this).data("id");

    // Confirmación nativa del navegador
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este auto? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        const response = await fetch(`http://localhost:3000/api/auto/eliminar/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          cargarAutos(); // Recargamos la tabla para que desaparezca el registro
        } else {
          alert("Error al eliminar: " + data.message);
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    }
  });

  // Coloca esto dentro de $(document).ready
  $("#formModificarAuto").submit(async (e) => {
    e.preventDefault();

    // 1. Obtener el ID del input oculto que llenamos al abrir el modal
    const id = $("#formModificarAutoId").val();

    // 2. Recolectar los datos del formulario del modal
    const autoEditado = {
      nombre: $("#formModificarAutoNombre").val(),
      carroceria: $("#formModificarAutoCarroceria").val(),
      color: $("#formModificarAutoColor").val(),
      anio: $("#formModificarAutoAnio").val(),
      motor: $("#formModificarAutoMotor").val(),
      transmision: $("#formModificarAutoTransmision").val(),
      precio: $("#formModificarAutoPrecio").val(),
      descripcion: $("#formModificarAutoDescripcion").val(),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/auto/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoEditado),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        const modalElement = document.getElementById("modalModificarAuto");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        cargarAutos();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  });
});

$("#formAgregarAuto").submit(async (e) => {
  e.preventDefault();

  const auto = {
    nombre: $("#formAgregarAutoNombre").val(),
    carroceria: $("#formAgregarAutoCarroceria").val(),
    color: $("#formAgregarAutoColor").val(),
    anio: $("#formAgregarAutoAnio").val(),
    motor: $("#formAgregarAutoMotor").val(),
    transmision: $("#formAgregarAutoTransmision").val(),
    precio: $("#formAgregarAutoPrecio").val(),
    descripcion: $("#formAgregarAutoDescripcion").val(),
  };

  const data = await fetch("http://localhost:3000/api/auto/agregarAuto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auto),
  }).then((e) => e.json());

  alert(data);
  cargarAutos();
});

async function cargarAutos() {
  const data = await fetch("http://localhost:3000/api/auto/cargarAutos").then((e) => e.json());
  console.log(data.message);
  const autos = data.body;
  autosTotales = autos;
  console.log(autos);
  let table = "";
  autos.forEach((auto) => {
    table += `<tr>
                <td>${auto.idAuto}</td>
                <td>${auto.nombreAuto}</td>
                <td>${auto.carroceriaAuto}</td>
                <td><button data-bs-toggle="modal" data-bs-target="#modalModificarAuto" data-id="${auto.idAuto}" class="btn-Modificar btn btn-primary" >Modificar</button><button class="btn btn-danger btn-Eliminar" data-id="${auto.idAuto}">Eliminar</button></td>
            </tr>`;
  });
  $("#tableProductos").html(table);
}
