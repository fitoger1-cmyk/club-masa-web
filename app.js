const WHATSAPP = "541140480762";

// Mientras trabajamos localmente usa localhost.
// Cuando publiquemos el backend, reemplazaremos la segunda dirección.
const ES_LOCAL =
  window.location.protocol === "file:" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_URL = ES_LOCAL
  ? "http://localhost:3000"
  : "https://masaos-api.onrender.com";

const money = (valor) =>
  "$" + Number(valor || 0).toLocaleString("es-AR");

let products = [];
let cart = [];

function normalizarCategoria(categoria) {
  const valor = String(categoria || "").trim().toLowerCase();

  if (valor === "pizza" || valor === "pizzas") {
    return "pizzas";
  }

  if (valor === "focaccia" || valor === "focaccias") {
    return "focaccias";
  }

  if (
    valor === "postre" ||
    valor === "postres" ||
    valor === "pastelería" ||
    valor === "pasteleria"
  ) {
    return "postres";
  }

  return valor || "otros";
}

async function cargarProductos() {
  const contenedor = document.getElementById("products");

  contenedor.innerHTML = `
    <p class="estado-productos">Cargando productos...</p>
  `;

  try {
    const respuesta = await fetch(`${API_URL}/api/productos`);

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al cargar productos`);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new Error("La respuesta de productos no es válida");
    }

    products = datos
      .filter((producto) => producto.activo !== false)
      .map((producto) => ({
        id: producto.id,
        cat: normalizarCategoria(producto.categoria),
        name: producto.nombre || "Producto",
        desc: producto.descripcion || "",
        img: producto.imagen || "",
        prices: {
          Unidad: Number(producto.precio || 0),
        },
      }));

    render();
  } catch (error) {
    console.error("Error cargando productos:", error);

    contenedor.innerHTML = `
      <div class="error-productos">
        <h3>No pudimos cargar el menú</h3>
        <p>Verificá que MasaOS esté encendido e intentá nuevamente.</p>
        <button class="btn primary" onclick="cargarProductos()">
          Reintentar
        </button>
      </div>
    `;
  }
}

function crearImagenProducto(producto) {
  if (!producto.img) {
    return `
      <div class="sin-imagen">
        <span>🍕</span>
      </div>
    `;
  }

  return `
    <img
      src="assets/${producto.img}"
      alt="${producto.name}"
      loading="lazy"
      onerror="
        this.style.display='none';
        this.nextElementSibling.style.display='flex';
      "
    >
    <div class="sin-imagen" style="display:none">
      <span>🍕</span>
    </div>
  `;
}

function render(filter = "todos") {
  const contenedor = document.getElementById("products");
  contenedor.innerHTML = "";

  const productosFiltrados = products.filter(
    (producto) => filter === "todos" || producto.cat === filter
  );

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = `
      <p class="estado-productos">
        No hay productos disponibles en esta categoría.
      </p>
    `;
    return;
  }

  productosFiltrados.forEach((producto) => {
    const botonesPrecios = Object.entries(producto.prices)
      .map(
        ([tamaño, precio]) => `
          <button
            type="button"
            class="btn primary"
            onclick='addItem(
              ${JSON.stringify(producto.name)},
              ${JSON.stringify(tamaño)},
              ${Number(precio)}
            )'
          >
            ${tamaño} ${money(precio)}
          </button>
        `
      )
      .join("");

    contenedor.innerHTML += `
      <article class="card">
        <div class="card-image">
          ${crearImagenProducto(producto)}
        </div>

        <div class="card-body">
          <h3>${producto.name}</h3>
          <p class="desc">${producto.desc}</p>

          <div class="add-row">
            ${botonesPrecios}
          </div>
        </div>
      </article>
    `;
  });
}

function addItem(name, size, price) {
  const key = `${name} ${size}`;
  const item = cart.find((producto) => producto.key === key);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({
      key,
      name,
      size,
      price: Number(price),
      qty: 1,
    });
  }

  updateCart();

  // Ya no abre el carrito automáticamente.
  // El cliente puede seguir agregando productos.
}

function changeQty(key, cantidad) {
  const item = cart.find((producto) => producto.key === key);

  if (!item) {
    return;
  }

  item.qty += cantidad;

  if (item.qty <= 0) {
    cart = cart.filter((producto) => producto.key !== key);
  }

  updateCart();
}

function updateCart() {
  const contenedor = document.getElementById("cartItems");
  contenedor.innerHTML = "";

  let total = 0;
  let cantidadTotal = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    cantidadTotal += item.qty;

    contenedor.innerHTML += `
      <div class="cart-item">
        <div>
          <b>${item.qty}x ${item.name}</b>
          <br>
          <small>
            ${item.size} · ${money(item.price)}
          </small>
        </div>

        <div class="cart-controls">
          <button
            type="button"
            onclick='changeQty(${JSON.stringify(item.key)}, -1)'
          >
            −
          </button>

          <button
            type="button"
            onclick='changeQty(${JSON.stringify(item.key)}, 1)'
          >
            +
          </button>
        </div>
      </div>
    `;
  });

  if (cart.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
  }

  document.getElementById("total").textContent = money(total);
  document.getElementById("cartCount").textContent = cantidadTotal;
}

function toggleCart() {
  const carrito = document.getElementById("cart");

  const fondo =
    document.getElementById("cartBackdrop");

  const abrir = !carrito.classList.contains("open");

  carrito.classList.toggle("open", abrir);
  fondo.classList.toggle("open", abrir);

  document.body.style.overflow =
    abrir ? "hidden" : "";
}

function obtenerDatosCliente() {
  return {
    nombre: document.getElementById("customerName").value.trim(),
    telefono: document.getElementById("customerPhone").value.trim(),
    direccion: document.getElementById("customerAddress").value.trim(),
    modalidad: document.getElementById("deliveryType").value,
    pago: document.getElementById("paymentMethod").value,
    observaciones: document.getElementById("notes").value.trim(),
  };
}

function validarPedido() {
  if (cart.length === 0) {
    alert("Agregá productos al carrito.");
    return false;
  }

  const cliente = obtenerDatosCliente();

  if (!cliente.nombre) {
    alert("Ingresá tu nombre.");
    document.getElementById("customerName").focus();
    return false;
  }

  if (!cliente.telefono) {
    alert("Ingresá tu teléfono.");
    document.getElementById("customerPhone").focus();
    return false;
  }

  if (cliente.modalidad === "Delivery" && !cliente.direccion) {
    alert("Ingresá la dirección para el delivery.");
    document.getElementById("customerAddress").focus();
    return false;
  }

  return true;
}

function sendWhatsApp() {
  if (!validarPedido()) {
    return;
  }

  const cliente = obtenerDatosCliente();

  const total = cart.reduce(
    (acumulado, item) => acumulado + item.price * item.qty,
    0
  );

  const lineasProductos = cart
    .map(
      (item) =>
        `${item.qty}x ${item.name} (${item.size}) - ${money(
          item.price * item.qty
        )}`
    )
    .join("\n");

  const mensaje = [
    "🍕 NUEVO PEDIDO - EL CLUB DE LA MASA G",
    "",
    lineasProductos,
    "",
    `TOTAL: ${money(total)}`,
    "",
    `Cliente: ${cliente.nombre}`,
    `Teléfono: ${cliente.telefono}`,
    `Modalidad: ${cliente.modalidad}`,
    `Dirección: ${cliente.direccion || "-"}`,
    `Forma de pago: ${cliente.pago}`,
    `Observaciones: ${cliente.observaciones || "-"}`,
  ].join("\n");

  const enlace = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    mensaje
  )}`;

  window.open(enlace, "_blank");
}

async function mercadoPagoInfo() {
  if (!validarPedido()) {
    return;
  }

  const boton = document.querySelector(".btn.mp");
  const textoOriginal = boton.textContent;

  boton.disabled = true;
  boton.textContent = "Iniciando pago...";

  try {
    const respuesta = await fetch("/api/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          title: `${item.name} ${item.size}`,
          quantity: Number(item.qty),
          unit_price: Number(item.price),
          currency_id: "ARS",
        })),
      }),
    });

    const textoRespuesta = await respuesta.text();

let datos;

try {
  datos = JSON.parse(textoRespuesta);
} catch {
  throw new Error(
    "Mercado Pago no está disponible desde Live Server. Probalo desde la web publicada en Vercel."
  );
}

    if (!respuesta.ok) {
      throw new Error(
        datos.error || datos.message || "No se pudo iniciar el pago"
      );
    }

    if (!datos.init_point) {
      throw new Error("Mercado Pago no devolvió el enlace de pago");
    }

    window.location.href = datos.init_point;
  } catch (error) {
    console.error("Error Mercado Pago:", error);
    alert(error.message);
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}

document.querySelectorAll(".tab").forEach((boton) => {
  boton.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((item) => item.classList.remove("active"));

    boton.classList.add("active");
    render(boton.dataset.filter);
  });
});

document
  .getElementById("deliveryType")
  .addEventListener("change", (evento) => {
    const direccion = document.getElementById("customerAddress");
    const esDelivery = evento.target.value === "Delivery";

    direccion.disabled = !esDelivery;
    direccion.placeholder = esDelivery
      ? "Dirección"
      : "No es necesaria para retiro";

    if (!esDelivery) {
      direccion.value = "";
    }
  });

updateCart();
cargarProductos();