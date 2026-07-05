const WHATSAPP = '541140480762';
const money = n => '$' + n.toLocaleString('es-AR'); 
const products = [
 {cat:'pizzas',name:'Muzzarella',desc:'Salsa de tomate artesanal, muzzarella premium, aceitunas verdes y orégano.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4304.jpg',prices:{Chica:7000,Grande:12500}},
 {cat:'pizzas',name:'Napolitana',desc:'Muzzarella, tomate fresco, ajo, albahaca y oliva.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4291.jpg',prices:{Chica:9000,Grande:17500}},
 {cat:'pizzas',name:'Especial con Jamón',desc:'Salsa de tomate, muzzarella, jamón cocido y morrones asados.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4303.jpg',prices:{Chica:10000,Grande:18000}},
 {cat:'pizzas',name:'Fugazzeta',desc:'Abundante cebolla, muzzarella cremosa, oliva y pimienta.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4294.jpg',prices:{Chica:8000,Grande:15000}},
 {cat:'pizzas',name:'Muzzarella y Huevo',desc:'Salsa artesanal, muzzarella premium, huevo rallado y aceitunas.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4293.jpg',prices:{Chica:9000,Grande:16000}},
 {cat:'pizzas',name:'Calabresa',desc:'Muzzarella y longaniza calabresa premium con toque de ají.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4311.jpg',prices:{Chica:9000,Grande:16000}},
 {cat:'pizzas',name:'Rúcula y Jamón Crudo',desc:'Muzzarella, jamón crudo, rúcula y parmesano.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4288.jpg',prices:{Chica:11500,Grande:20500}},
 {cat:'pizzas',name:'Cuatro Quesos',desc:'Muzzarella, provolone, fontina y queso azul.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4300.jpg',prices:{Chica:10500,Grande:18500}},
 {cat:'pizzas',name:'Barbacoa Chicken',desc:'Muzzarella, pollo, cebolla morada y salsa barbacoa.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4315.jpg',prices:{Chica:14000,Grande:22000}},
 {cat:'pizzas',name:'Fungi & Trufa',desc:'Muzzarella, mix de hongos y aceite de trufa.',img:'33781.png',prices:{Chica:11000,Grande:20000}},
 {cat:'pizzas',name:'Bacon',desc:'Muzzarella, panceta ahumada, cheddar y verdeo.',img:'33781.png',prices:{Chica:11000,Grande:20000}},
 {cat:'focaccias',name:'Milano Braseado',desc:'Roast beef braseado, provolone gratinado, morrones, tomate y alioli.',img:'33525.jpg',prices:{Unidad:10000}},
 {cat:'focaccias',name:'Mortadela Premium',desc:'Mortadela con pistacho, queso dambo, rúcula y oliva.',img:'33533.jpg',prices:{Unidad:8000}},
 {cat:'focaccias',name:'Crudo & Rúcula',desc:'Jamón crudo, parmesano, tomates secos, rúcula y oliva.',img:'33527.jpg',prices:{Unidad:9000}},
 {cat:'focaccias',name:'Milano Salame',desc:'Salame tipo Milán, queso dambo, tomate y lechuga morada.',img:'33537.jpg',prices:{Unidad:8000}},
 {cat:'focaccias',name:'Vegetariano',desc:'Berenjena, zucchini, morrón, muzzarella y pesto.',img:'33529.jpg',prices:{Unidad:8000}},
 {cat:'postres',name:'Brownie con nueces',desc:'Chocolate intenso y nueces crocantes.',img:'29854.jpg',prices:{Unidad:7500}},
 {cat:'postres',name:'Apple Crumble',desc:'Manzana con canela y crumble irresistible.',img:'29853.jpg',prices:{Unidad:7500}},
 {cat:'postres',name:'Pasta Frola',desc:'Clásica y casera, como la de siempre.',img:'8d40b7c3-123d-4cd4-bc4d-da60d1af4164-1_all_4425.jpg',prices:{Unidad:7500}},
];
let cart = [];
function render(filter='todos'){
 const el=document.getElementById('products'); el.innerHTML='';
 products.filter(p=>filter==='todos'||p.cat===filter).forEach(p=>{
  const prices=Object.entries(p.prices).map(([s,pr])=>`<button class="btn primary" onclick="addItem('${p.name}','${s}',${pr})">${s} ${money(pr)}</button>`).join('');
  el.innerHTML+=`<article class="card"><img src="assets/${p.img}" alt="${p.name}"><div class="card-body"><h3>${p.name}</h3><p class="desc">${p.desc}</p><div class="add-row">${prices}</div></div></article>`;
 });
}
function addItem(name,size,price){const key=name+' '+size;const item=cart.find(i=>i.key===key); if(item)item.qty++; else cart.push({key,name,size,price,qty:1}); updateCart(); document.getElementById('cart').classList.add('open');}
function changeQty(key,d){const item=cart.find(i=>i.key===key); if(!item)return; item.qty+=d; if(item.qty<=0)cart=cart.filter(i=>i.key!==key); updateCart();}
function updateCart(){const el=document.getElementById('cartItems'); el.innerHTML=''; let total=0,count=0; cart.forEach(i=>{total+=i.price*i.qty; count+=i.qty; el.innerHTML+=`<div class="cart-item"><div><b>${i.qty}x ${i.name}</b><br><small>${i.size} · ${money(i.price)}</small></div><div class="cart-controls"><button onclick="changeQty('${i.key}',-1)">-</button><button onclick="changeQty('${i.key}',1)">+</button></div></div>`}); document.getElementById('total').textContent=money(total); document.getElementById('cartCount').textContent=count;}
function toggleCart(){document.getElementById('cart').classList.toggle('open')}
function sendWhatsApp(){if(cart.length===0){alert('Agregá productos al carrito.');return} const name=document.getElementById('customerName').value; const phone=document.getElementById('customerPhone').value; const addr=document.getElementById('customerAddress').value; const del=document.getElementById('deliveryType').value; const pay=document.getElementById('paymentMethod').value; const notes=document.getElementById('notes').value; const total=cart.reduce((s,i)=>s+i.price*i.qty,0); let msg='🍕 Nuevo pedido - El Club de la Masa G%0A%0A'; cart.forEach(i=>msg+=`${i.qty}x ${i.name} (${i.size}) - ${money(i.price*i.qty)}%0A`); msg+=`%0ATotal: ${money(total)}%0A%0ACliente: ${name}%0ATeléfono: ${phone}%0ADirección: ${addr}%0AModalidad: ${del}%0APago: ${pay}%0AObservaciones: ${notes||'-'}`; window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,'_blank');}
async function mercadoPagoInfo() {
  if (cart.length === 0) {
    alert("Agregá productos al carrito.");
    return;
  }

  const response = await fetch("/api/create-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cart.map(i => ({
        title: i.name + " " + i.size,
        quantity: i.qty,
        unit_price: i.price
      }))
    })
  });

  const data = await response.json();

  if (data.init_point) {
    window.location.href = data.init_point;
  } else {
    alert("No se pudo iniciar el pago.");
  }
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(b.dataset.filter)}); render();
