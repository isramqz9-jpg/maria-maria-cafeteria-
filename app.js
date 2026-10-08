/* ============================================================
   MARÍA MARÍA CAFETERÍA — APP
   ------------------------------------------------------------
   CONFIGURA AQUÍ:
   1) WHATSAPP_NUMBER
   2) BUSINESS_EMAIL
   3) ADDRESS / PHONE si quieres cambiar los datos
   ============================================================ */

const CONFIG = {
  WHATSAPP_NUMBER: "529990000000", // México: 52 + número, sin + ni espacios
  BUSINESS_EMAIL: "cafemariamaria20@gmail.com",
  INSTAGRAM_URL: "https://www.instagram.com/maria_maria_cafe?exln=M2ljc280eDdqbGto",
  CURRENCY: "MXN"
};

const PRODUCTS = [
  {
    id:"americano", name:"Café Americano", category:"cafe", categoryLabel:"Café",
    price:45, description:"Café intenso y aromático preparado al momento.",
    image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"cappuccino", name:"Cappuccino", category:"cafe", categoryLabel:"Café",
    price:55, description:"Espresso con leche vaporizada y espuma cremosa.",
    image:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"latte", name:"Latte Vainilla", category:"cafe", categoryLabel:"Café",
    price:60, description:"Espresso suave, leche cremosa y un toque de vainilla.",
    image:"https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"frappe", name:"Frappé de Café", category:"frio", categoryLabel:"Bebida fría",
    price:65, description:"Café frío, hielo y leche con textura cremosa.",
    image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"chocolate-frio", name:"Chocolate Frío", category:"frio", categoryLabel:"Bebida fría",
    price:60, description:"Chocolate frío preparado con leche y hielo.",
    image:"https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"pastel", name:"Pastel de Chocolate", category:"postre", categoryLabel:"Postre",
    price:70, description:"Pastel suave de chocolate con cobertura cremosa.",
    image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"dona", name:"Dona Glaseada", category:"postre", categoryLabel:"Postre",
    price:35, description:"Dona suave con glaseado dulce.",
    image:"https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"cheesecake", name:"Cheesecake de Frutos Rojos", category:"postre", categoryLabel:"Postre",
    price:75, description:"Cheesecake cremoso con frutos rojos de temporada.",
    image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=85"
  },
  {
    id:"te", name:"Té de la Casa", category:"otros", categoryLabel:"Otros",
    price:40, description:"Infusión aromática para una pausa tranquila.",
    image:"https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=85"
  }
];

const state = {
  category:"todos",
  search:"",
  cart: loadJSON("mm_cart", []),
  favorites: loadJSON("mm_favorites", []),
  selectedProduct:null
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function money(value) { return new Intl.NumberFormat("es-MX",{style:"currency",currency:CONFIG.CURRENCY}).format(value); }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ---------- MENU ---------- */
const categories = [
  ["todos","Todos"],["cafe","Café"],["frio","Bebidas frías"],["postre","Postres"],["otros","Otros"]
];

function renderCategories() {
  $("#categories").innerHTML = categories.map(([id,label]) =>
    `<button class="category ${state.category===id?"active":""}" data-category="${id}">${label}</button>`
  ).join("");
  $$(".category").forEach(btn => btn.addEventListener("click", () => {
    state.category = btn.dataset.category;
    renderCategories(); renderProducts();
  }));
}

function filteredProducts() {
  const q = state.search.trim().toLowerCase();
  return PRODUCTS.filter(p => {
    const matchesCategory = state.category==="todos" || p.category===state.category;
    const matchesSearch = !q || `${p.name} ${p.description} ${p.categoryLabel}`.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const list = filteredProducts();
  $("#productGrid").innerHTML = list.length ? list.map(p => {
    const fav = state.favorites.includes(p.id);
    return `
      <article class="product-card">
        <div class="product-img">
          <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">
          <button class="favorite ${fav?"active":""}" data-favorite="${p.id}" aria-label="Favorito">${fav?"♥":"♡"}</button>
        </div>
        <div class="product-info">
          <span class="tag">${escapeHTML(p.categoryLabel)}</span>
          <h3>${escapeHTML(p.name)}</h3>
          <p>${escapeHTML(p.description)}</p>
          <div class="product-bottom">
            <span class="price">${money(p.price)}</span>
            <div class="product-actions">
              <button class="circle-btn" data-view="${p.id}" aria-label="Ver producto">⌕</button>
              <button class="circle-btn primary" data-add="${p.id}" aria-label="Agregar">+</button>
            </div>
          </div>
        </div>
      </article>`;
  }).join("") : `<div class="empty" style="grid-column:1/-1">No encontramos productos con esa búsqueda.</div>`;

  $$("[data-add]").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.add)));
  $$("[data-view]").forEach(btn => btn.addEventListener("click", () => openProduct(btn.dataset.view)));
  $$("[data-favorite]").forEach(btn => btn.addEventListener("click", () => toggleFavorite(btn.dataset.favorite)));
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) state.favorites = state.favorites.filter(x => x!==id);
  else state.favorites.push(id);
  saveJSON("mm_favorites", state.favorites);
  renderProducts();
  toast(state.favorites.includes(id) ? "Agregado a favoritos ♥" : "Quitado de favoritos");
}

/* ---------- CART ---------- */
function addToCart(id, quantity=1) {
  const p = PRODUCTS.find(x => x.id===id);
  if (!p) return;
  const existing = state.cart.find(x => x.id===id);
  if (existing) existing.qty += quantity;
  else state.cart.push({id, qty:quantity});
  saveJSON("mm_cart", state.cart);
  renderCart();
  openCart();
  toast(`${p.name} agregado al carrito`);
}

function changeQty(id, delta) {
  const item = state.cart.find(x => x.id===id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(x => x.id!==id);
  saveJSON("mm_cart", state.cart);
  renderCart();
}

function removeItem(id) {
  state.cart = state.cart.filter(x => x.id!==id);
  saveJSON("mm_cart", state.cart);
  renderCart();
}

function cartCount() { return state.cart.reduce((sum,x)=>sum+x.qty,0); }
function cartTotal() {
  return state.cart.reduce((sum,x) => {
    const p=PRODUCTS.find(p=>p.id===x.id); return sum+(p?p.price*x.qty:0);
  },0);
}

function renderCart() {
  $("#cartCount").textContent = cartCount();
  if (!state.cart.length) {
    $("#cartItems").innerHTML = `<div class="empty">Tu carrito está vacío.<br>Elige algo delicioso del menú. ☕</div>`;
    $("#cartTotal").textContent = money(0);
    return;
  }
  $("#cartItems").innerHTML = state.cart.map(item => {
    const p=PRODUCTS.find(x=>x.id===item.id);
    if(!p) return "";
    return `
      <div class="cart-row">
        <img src="${p.image}" alt="${escapeHTML(p.name)}">
        <div>
          <h4>${escapeHTML(p.name)}</h4>
          <p>${money(p.price)} · ${money(p.price*item.qty)}</p>
          <div class="qty">
            <button data-minus="${p.id}">−</button><b>${item.qty}</b><button data-plus="${p.id}">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${p.id}" aria-label="Eliminar">✕</button>
      </div>`;
  }).join("");
  $("#cartTotal").textContent = money(cartTotal());

  $$("[data-minus]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.minus,-1)));
  $$("[data-plus]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.plus,1)));
  $$("[data-remove]").forEach(b=>b.addEventListener("click",()=>removeItem(b.dataset.remove)));
}

function openCart() {
  $("#cartDrawer").classList.add("open"); $("#drawerBackdrop").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart() {
  $("#cartDrawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true");
}

/* ---------- CHECKOUT / WHATSAPP ---------- */
function openCheckout() {
  if (!state.cart.length) return toast("Agrega al menos un producto.");
  const lines = state.cart.map(x => {
    const p=PRODUCTS.find(p=>p.id===x.id); return `<div>${x.qty} × ${escapeHTML(p.name)} — <b>${money(p.price*x.qty)}</b></div>`;
  }).join("");
  $("#checkoutSummary").innerHTML = `${lines}<hr><b>Total: ${money(cartTotal())}</b>`;
  $("#checkoutModal").classList.add("open");
  closeCart();
}

function validMexicanPhone(phone) {
  const digits=phone.replace(/\D/g,"");
  return digits.length===10 || (digits.length===12 && digits.startsWith("52")) || (digits.length===13 && digits.startsWith("521"));
}

function sendWhatsAppOrder(e) {
  e.preventDefault();
  const name=$("#orderName").value.trim();
  const phone=$("#orderPhone").value.trim();
  const type=$("#orderType").value;
  const notes=$("#orderNotes").value.trim();

  if (!validMexicanPhone(phone)) return toast("Escribe un número de teléfono válido.");
  if (!state.cart.length) return toast("Tu carrito está vacío.");

  const lines = state.cart.map(x => {
    const p=PRODUCTS.find(p=>p.id===x.id);
    return `• ${p.name} x${x.qty} — ${money(p.price*x.qty)}`;
  }).join("\n");

  const message =
`Hola, María María Cafetería. ☕
Quiero hacer un pedido.

Nombre: ${name}
Teléfono: ${phone}
Tipo: ${type}

${lines}

TOTAL: ${money(cartTotal())}
${notes ? `\nNotas: ${notes}` : ""}`;

  const url=`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener");
  $("#checkoutModal").classList.remove("open");
  toast("Pedido preparado para WhatsApp.");
}

/* ---------- PRODUCT MODAL ---------- */
function openProduct(id) {
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  state.selectedProduct=p;
  $("#modalImage").src=p.image; $("#modalImage").alt=p.name;
  $("#modalCategory").textContent=p.categoryLabel.toUpperCase();
  $("#modalName").textContent=p.name; $("#modalDescription").textContent=p.description;
  $("#modalPrice").textContent=money(p.price);
  $("#productModal").classList.add("open");
}
$("#modalAddBtn").addEventListener("click",()=>{
  if(state.selectedProduct) addToCart(state.selectedProduct.id);
  $("#productModal").classList.remove("open");
});

/* ---------- SPECIAL COMBO ---------- */
$("#specialBtn").addEventListener("click",()=>{
  addToCart("cappuccino");
  addToCart("pastel");
  toast("Combo de la casa agregado. Puedes revisar el carrito.");
});

/* ---------- CONTACT FORM ---------- */
$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#contactName").value.trim();
  const email=$("#contactEmail").value.trim();
  const message=$("#contactMessage").value.trim();
  const subject=encodeURIComponent(`Mensaje desde la web — ${name}`);
  const body=encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${message}`);
  window.location.href=`mailto:${CONFIG.BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
  toast("Abriendo tu aplicación de correo...");
});

/* ---------- UI ---------- */
$("#cartBtn").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
$("#drawerBackdrop").addEventListener("click",closeCart);
$("#checkoutBtn").addEventListener("click",openCheckout);
$("#clearCartBtn").addEventListener("click",()=>{
  if(confirm("¿Quieres vaciar el carrito?")) { state.cart=[]; saveJSON("mm_cart",state.cart); renderCart(); }
});

$$(".modal-close").forEach(btn=>btn.addEventListener("click",()=>btn.closest(".modal-backdrop").classList.remove("open")));
$$(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{
  if(e.target===backdrop) backdrop.classList.remove("open");
}));
$("#checkoutForm").addEventListener("submit",sendWhatsAppOrder);

$("#menuSearch").addEventListener("input",e=>{
  state.search=e.target.value; renderProducts();
});

$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("mobile-open"));
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("mobile-open")));

$("#themeBtn").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("mm_theme",document.body.classList.contains("dark")?"dark":"light");
});
if(localStorage.getItem("mm_theme")==="dark") document.body.classList.add("dark");

$("#searchBtn").addEventListener("click",()=>{
  document.querySelector("#menu").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>$("#menuSearch").focus(),500);
});

$("#year").textContent=new Date().getFullYear();
const addressText = document.getElementById("addressText");
const phoneText = document.getElementById("phoneText");
if (addressText) addressText.textContent = CONFIG.ADDRESS;
if (phoneText) phoneText.textContent = CONFIG.PHONE;
if (document.getElementById("instagramLink")) {
  document.getElementById("instagramLink").href = CONFIG.INSTAGRAM_URL;
}

/* ---------- SCROLL REVEAL ---------- */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add("visible"); });
},{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

/* ---------- INIT ---------- */
renderCategories();
renderProducts();
renderCart();
/* =========================================================
   COTIZACIÓN DE EVENTOS POR WHATSAPP
   ========================================================= */

const eventWhatsappBtn = document.getElementById("eventWhatsappBtn");

if (eventWhatsappBtn) {

  eventWhatsappBtn.addEventListener("click", () => {

    /*
      IMPORTANTE:
      El número se toma automáticamente de CONFIG.
      Por eso NO necesitas escribir el número otra vez.
    */

    const message = `
Hola, María María Cafetería. ☕✨

Me gustaría solicitar una cotización para un evento.

Quisiera recibir información sobre:

• Tipo de evento:
• Fecha:
• Número aproximado de personas:
• Lugar del evento:
• Servicio que me interesa:

Me gustaría conocer las opciones disponibles y el precio.

¡Muchas gracias! 🤎
    `.trim();

    const whatsappURL =
      `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  });

}