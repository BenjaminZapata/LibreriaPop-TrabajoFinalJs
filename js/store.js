// Carga el estado previo del carrito
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Catalogo, DOM y Modal
let cartDisplay = document.getElementById("cart");
let store = document.getElementById("store--products");
let modal = document.getElementById("modal");

// Ordenar productos segun criterio
window.onload = () => {
    document.getElementById("ordenar").setAttribute("option", "pordefecto");
    document.getElementById("ordenar").onchange = () => ordenarProductos();
}

function ordenarProductos(){
    let opcion = document.getElementById("ordenar").value;
    if (opcion == "menor") {
        productos.sort(function(a, b) {
            return a.precio - b.precio
        });
    } else if (opcion == "mayor") {
        productos.sort(function(a, b) {
            return b.precio - a.precio
        });
    } else if (opcion == "alfabeticoaz") {
        productos.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }   else if (opcion == "alfabeticoza") {
        productos.sort(function(a, b) {
            return b.nombre.localeCompare(a.nombre);
        });
    }
    store.innerHTML="";
    mostrarCatalogo();
}

// Funcion para mostrar la tienda
function mostrarCatalogo(){
    for (const prod of productos){
            store.innerHTML += 
            `<div class="card">
                <img src="./img/${prod.foto}">
                <h4>${prod.nombre}</h4>
                <h4>$ ${prod.precio}</h4>
                <button class="addToCart" id="btn${prod.id}">Agregar al carrito</button>
            </div>`
    }
    // Evento de boton para cada articulo
    productos.forEach( prod => {
        document.getElementById(`btn${prod.id}`).onclick = function(){
            agregarAlCarrito(prod);
        };
    });
}

function mostrarCarrito(){
    cartDisplay.innerHTML = "";
    for (const prod of cart){
        cartDisplay.innerHTML +=
                `<div class="item item${prod.id}">
                    <img src="./img/${prod.foto}" alt="" loading="lazy">
                    <div class="item--info">
                        <h5>${prod.nombre}</h5>
                        <h5 id="${prod.id}">x${prod.cantidad}</h5>
                        <h5>$${prod.precio} c/u</h5>
                        <button class="removeFromCart" onclick='eliminarDelCarrito(${prod.id})'">Eliminar</button>
                    </div>
                </div>`
    }
    document.getElementById("total").innerText = (`Total: $ ${calcularTotal()}`);
}

// Constructor de productos en carrito
class producto {
    constructor(item) {
        this.id = item.id;
        this.foto = item.foto;
        this.nombre = item.nombre;
        this.precio = item.precio;
        this.cantidad = 1;
    }
}

function agregarAlCarrito(item){
    // Busco si el item ya esta presente en el carrito
    let found = cart.find(p => p.id == item.id);
    // Si no existe
    if (found == undefined){
        // Agrego al carrito y hago display con DOM
        let newItem = new producto(item);
        cart.push(newItem);
        cartDisplay.innerHTML +=
                `<div class="item item${newItem.id}">
                    <img src="./img/${newItem.foto}" alt="" loading="lazy">
                    <div class="item--info">
                        <h5>${newItem.nombre}</h5>
                        <h5 id="${newItem.id}">x${newItem.cantidad}</h5>
                        <h5>$${newItem.precio} c/u</h5>
                        <button class="removeFromCart" onclick='eliminarDelCarrito(${newItem.id})'">Eliminar</button>
                    </div>
                </div>`
    }
    // Si ya se encuentra dicho producto en el carrito
    else{
        // Busco el index dentro del carrito, aumento la cantidad y modifico con DOM
        let index = cart.findIndex(p => p.id == item.id);
        cart[index].cantidad += 1;
        document.getElementById(item.id).innerHTML = "x" + cart[index].cantidad;
    }
    // Modifico el total en la pagina, guardo el carrito y muestro el mensaje
    document.getElementById("total").innerText = (`Total: $ ${calcularTotal()}`);
    localStorage.setItem("cart", JSON.stringify(cart))
    mensajeExito(item.nombre + " agregado!");
}

function calcularTotal(){
    let total = 0;
    for (const item of cart){
        total += (item.precio * item.cantidad);
    }
    return total;
}

function eliminarDelCarrito(id){
    // Busca el indice dentro del carrito
    let index = cart.findIndex( item => item.id == id);
    let prodMsg = cart[index].nombre;
    // Si hay mas de una unidad
    if(cart[index].cantidad > 1){
        // Elimina una unidad
        cart[index].cantidad -= 1;
    }
    // Si hay una sola unidad
    else{
        // Elimina el item buscado
        cart.splice(index, 1);
    }
    // Muestra mensaje, recarga el carrito y lo guarda
    mensajeError(prodMsg + " eliminado!");
    mostrarCarrito();
    localStorage.setItem("cart", JSON.stringify(cart))
}

// Generador de frases
const url = 'https://frasedeldia.azurewebsites.net/api/phrase';
let frases = [];
fetch(url)
    .then(res => res.json())
    .then(data => {
        let frase = data.phrase;
        let autor = "—" + data.author;
        let p = document.getElementById("frase");
        let fig = document.getElementById("autor");
        p.innerHTML = frase;
        fig.innerText = autor
    })
    .catch(error => console.error(error))

// Payout
let payButton = document.getElementById("pay");
payButton.onclick = function (){
    if (calcularTotal() == 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay ningun producto en el carrito'
        })
    }
    else{
        modal.className = "visible";
        modal.innerHTML =   `<h2>Informacion de pago</h2>
                            <form>
                                <label>Nombre completo</label>
                                <input type="text" name="name">
                                <label>Numero de contacto</label>
                                <input type="number" name="phone">
                                <label>Correo electronico</label>
                                <input type="email" name="email">
                                <input type="submit" value="Enviar" id="confirmarPago">
                            </form>
                            `
        document.getElementById("confirmarPago").addEventListener("click", function(e){
            e.preventDefault();
            modal.innerHTML =`<h3>Gracias por hacer su pedido nos pondremos en contacto a la brevedad</h3>`;
            setTimeout(() =>{
                modal.className = "hidden";
                modal.innerHTML = "";
                localStorage.removeItem("cart");
            }, "2000");
            setTimeout(() =>{
                document.location.reload(true);
            }, "2000");
        })
    }
};

mostrarCatalogo();
mostrarCarrito();