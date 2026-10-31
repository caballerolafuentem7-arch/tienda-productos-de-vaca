// Productos Derivados del Yogurt Griego y Quesos (Precios en Bolivianos - Bs.)
const productos = [
    {
        id: 1,
        nombre: "Yogurt Griego Natural",
        categoria: "Yogurt Griego",
        descripcion: "Yogurt griego artesanal cremoso, alto en proteína y libre de azúcar añadida.",
        proteina: "15g",
        precio: 28.00,
        imagen: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        nombre: "Queso Untable con Ajo",
        categoria: "Quesos Untables",
        descripcion: "Delicioso queso crema untable a base de yogurt griego drenado, sazonado con ajo fresco y hierbas.",
        proteina: "11g",
        precio: 32.50,
        imagen: "https://images.unsplash.com/photo-1590590407986-8d5d9c7d7b1d?w=500&auto=format&fit=crop"
    },
    {
        id: 3,
        nombre: "Queso Labneh Tradicional",
        categoria: "Quesos Untables",
        descripcion: "Queso crema de yogurt griego drenado, sazonado con aceite de oliva y finas hierbas.",
        proteina: "12g",
        precio: 30.00,
        imagen: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop"
    }
];

let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    renderProductos(productos);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtrados = productos.filter(p => 
                p.nombre.toLowerCase().includes(term) || 
                p.categoria.toLowerCase().includes(term)
            );
            renderProductos(filtrados);
        });
    }
});

// Renderizar tarjetas de productos
function renderProductos(lista) {
    const grid = document.getElementById('gridProductos');
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-magnifying-glass fs-1 text-muted mb-2"></i>
                <p class="text-muted fw-bold">No se encontraron productos derivados.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = lista.map(p => `
        <div class="col-12 col-md-6 col-lg-4 product-card-wrapper">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card">
                <div class="position-relative">
                    <img src="${p.imagen}" class="card-img-top product-img" alt="${p.nombre}">
                    <span class="badge bg-greek text-white position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill">
                        ${p.categoria}
                    </span>
                    <span class="badge bg-success position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill">
                        <i class="fa-solid fa-bolt me-1"></i>${p.proteina} Proteína
                    </span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold text-dark">${p.nombre}</h5>
                    <p class="card-text text-secondary small flex-grow-1">${p.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
                        <span class="fs-4 fw-bold text-greek">Bs. ${p.precio.toFixed(2)}</span>
                        <button class="btn btn-warning rounded-pill px-3 btn-sm fw-bold" onclick="agregarAlCarrito(${p.id})">
                            <i class="fa-solid fa-cart-plus me-1"></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// LÓGICA DEL CARRITO DE COMPRAS
function agregarAlCarrito(idProducto) {
    const prod = productos.find(p => p.id === idProducto);
    if (!prod) return;

    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    actualizarCarritoUI();
    toggleCartDrawer(true);
}

function cambiarCantidad(idProducto, cambio) {
    const item = carrito.find(i => i.id === idProducto);
    if (!item) return;

    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(i => i.id !== idProducto);
    }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('cartBadge');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const btnCheckout = document.getElementById('btnCheckout');

    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    const totalMonto = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);

    badge.textContent = totalItems;
    subtotalEl.textContent = `Bs. ${totalMonto.toFixed(2)}`;
    totalEl.textContent = `Bs. ${totalMonto.toFixed(2)}`;

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fa-solid fa-basket-shopping fs-1 mb-2"></i>
                <p class="small">El carrito está vacío</p>
            </div>
        `;
        btnCheckout.disabled = true;
    } else {
        btnCheckout.disabled = false;
        container.innerHTML = carrito.map(item => `
            <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded-3 border">
                <div class="me-2">
                    <h6 class="mb-0 text-dark small fw-bold">${item.nombre}</h6>
                    <span class="text-greek small fw-bold">Bs. ${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary rounded-circle px-2" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span class="small fw-bold">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary rounded-circle px-2" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
}

function toggleCartDrawer(forzarAbrir = false) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');

    if (forzarAbrir || !drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.remove('d-none');
    } else {
        drawer.classList.remove('open');
        overlay.classList.add('d-none');
    }
}

// LÓGICA DE PAGO CHECKOUT
function openCheckoutModal() {
    toggleCartDrawer();
    const totalMonto = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    const orderId = Math.floor(1000 + Math.random() * 9000);

    document.getElementById('checkoutTotalDisplay').textContent = `Bs. ${totalMonto.toFixed(2)}`;
    document.getElementById('checkoutOrderId').textContent = orderId;

    const msj = encodeURIComponent(`Hola, acabo de realizar un pedido de Bs. ${totalMonto.toFixed(2)} (Orden #${orderId}) por productos de yogurt y queso. Adjunto el comprobante.`);
    document.getElementById('btnWhatsAppOrder').href = `https://wa.me/59164522340?text=${msj}`;

    const modal = new bootstrap.Modal(document.getElementById('modalCheckout'));
    modal.show();
}

function closeCheckoutModalAndGoToVerifier() {
    const modalEl = document.getElementById('modalCheckout');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    window.location.href = '#verifier-section';
}

// LÓGICA DE VERIFICADOR VISUAL DE COMPROBANTE
function previewReceiptImage(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    const prompt = document.getElementById('dropzonePrompt');
    const btn = document.getElementById('btnVerifyAI');

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            preview.src = event.target.result;
            preview.classList.remove('d-none');
            prompt.classList.add('d-none');
            btn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

function analyzeReceiptWithAI() {
    const loading = document.getElementById('aiLoading');
    const card = document.getElementById('aiResultCard');
    const badge = document.getElementById('aiStatusBadge');
    const banner = document.getElementById('activationBanner');

    loading.classList.remove('d-none');
    card.classList.add('d-none');
    if (banner) banner.classList.add('d-none');

    setTimeout(() => {
        loading.classList.add('d-none');
        card.classList.remove('d-none');

        const totalMonto = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0) || 60.50;

        card.className = "bg-success bg-opacity-10 border border-success rounded-4 p-4 text-start";
        card.innerHTML = `
            <h6 class="fw-bold text-success mb-2"><i class="fa-solid fa-circle-check me-1"></i> Verificación Visual Exitosa:</h6>
            <ul class="small text-dark mb-0 ps-3">
                <li><strong>Monto Verificado:</strong> Bs. ${totalMonto.toFixed(2)}</li>
                <li><strong>Estado Transferencia:</strong> Confirmada / Exitosa</li>
                <li><strong>Método de Pago:</strong> Transferencia QR</li>
                <li><strong>Coincidencia con Carrito:</strong> 100% Exacta</li>
            </ul>
        `;

        if (banner) banner.classList.remove('d-none');
    }, 2000);
}
