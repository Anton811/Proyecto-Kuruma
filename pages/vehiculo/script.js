const idAuto = localStorage.getItem("auto");
console.log(idAuto);

$("document").ready(() => {
  cargarAuto();
});

async function cargarAuto() {
  const data = await fetch(`http://localhost:3000/api/auto/${idAuto}`).then((e) => e.json());
  const auto = data.body;
  console.log(data.message);
  $("#nombreAuto").text(auto.nombreAuto);
  $("#precioAuto").text(`$ ${auto.precioAuto} mxn`);
  $("#descripcionAuto").text(auto.descripcionAuto);
}
