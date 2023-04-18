const divProductos = document.getElementById("productos");
const botonFinalizar = document.getElementById("finalizar");

let finalizado = false;

fetch("/cakes.json")
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    console.log(datos);
    mostrarProductos(datos);
  })
  .catch((error) => console.log(error));

const mostrarProductos = (prodsJson) => {
  prodsJson.forEach((producto) => {
    const cardBs = document.createElement("div");
    cardBs.classList.add("col-xl-3", "col-md-6");
    cardBs.innerHTML += `<div class="card cardProducto">
        <div class="card-body card22">
          <img src=${producto.image} class="card-img-top img" alt="...">
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text">${producto.price}</p>
          <button  id ="boton${producto.id}"> Agregar </button>
          <button id="botonQuitar${producto.id}"> Quitar </button>
        </div>
      </div>`;
    divProductos.appendChild(cardBs);
    const boton = document.getElementById(`boton${producto.id}`);
    boton.addEventListener("click", () => {
      if (!finalizado) {
        agregarAlCarrito(producto.id, prodsJson);
      }
    });
    const botonQuitar = document.getElementById(`botonQuitar${producto.id}`);
    botonQuitar.addEventListener("click", () => {
      if (!finalizado) {
        quitarProducto(producto.id, prodsJson);
      }
    });
    botonFinalizar.onclick = () => {
      finalizarCompra();
    };
  });

  let carrito = [];

  const agregarAlCarrito = (id, prodsJson) => {
    const producto = prodsJson.find((prodsJson) => prodsJson.id === id);
    const index = carrito.findIndex((prod) => prod.id === id);

    if (index !== -1) {
      carrito[index].quantity++;
    } else {
      carrito.push({
        id: producto.id,
        name: producto.name,
        quantity: 1,
        price: producto.price,
      });
    }
    actualizarTotal();
    console.log(carrito);
  };

  const quitarProducto = (id) => {
    const producto = carrito.find((producto) => producto.id === id);

    if (!producto) {
      messageNoProduct();
    } else {
      if (producto.quantity === 1) {
        const index = carrito.findIndex((producto) => producto.id === id);
        carrito.splice(index, 1);
        if (carrito.length === 0) {
          carrito = [];
        }
      } else {
        producto.quantity--;
      }
      actualizarTotal();
      console.log(carrito);
    }
  };

  const actualizarTotal = () => {
    const total = carrito.reduce(
      (total, producto) => total + producto.quantity * producto.price,
      0
    );
    document.getElementById("total").innerText = `Total: $${total.toFixed()}`;
  };
};

  const messageNoProduct = () => {
    Swal.fire({
      text: "No product ",
      timer: 1000,
    });
  };


const finalizarCompra = () => {
  // desactivar botones
  const botonesAgregar = document.querySelectorAll("[id^=boton]");
  botonesAgregar.forEach((boton) => (boton.disabled = true));
  const botonesQuitar = document.querySelectorAll("[id^=botonQuitar]");
  botonesQuitar.forEach((boton) => (boton.disabled = true));

  // mostrar mensaje de confirmación
  Swal.fire({
    title: "Compra realizada con éxito",
    text: ` ${document.getElementById("total").innerText}`,
    icon: "success",
    confirmButtonText: "Aceptar",
  });
};
