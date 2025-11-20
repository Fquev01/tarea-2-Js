// --- Carrito interactivo con localStorage ---
function showCartMessage(text, type = "success") {
    const msg = document.getElementById("cartMessage");

    msg.textContent = text;
    msg.classList.remove("cart-message--error", "cart-message--success");
    msg.classList.add(`cart-message--${type}`, "cart-message--show");

    setTimeout(() => {
        msg.classList.remove("cart-message--show");
    }, 2000);
}

// Elementos del DOM
const cartBtn = document.querySelector('.header__icon--cart img');
const cartPanel = document.querySelector('.cart');
const cartList = document.querySelector('.cart__items');
const totalDisplay = document.querySelector('.cart__total span');
const trashBtn = document.querySelector('.cart__delete-icon');
const closeCartBtn = document.querySelector('.cart__close');
const cartCounter = document.querySelector('.header__cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toggle del carrito
cartBtn.addEventListener('click', () => {
    cartPanel.classList.toggle('active');
});

// Agregar productos desde cada card
const productCards = document.querySelectorAll('.product');

productCards.forEach(card => {
    card.addEventListener('click', () => {
        const name = card.querySelector('.product__name').textContent;
        const price = parseFloat(
            card.querySelector('.product__price').textContent.replace(/[$,]/g, '')
        );

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        saveCart();
        renderCart();
    });
});

// Cerrar carrito desde la X
closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('active');
});

// Renderizar carrito con botones + y -
function renderCart() {
    cartList.innerHTML = '';

    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        totalItems += item.qty;

        const li = document.createElement('li');
        li.classList.add('cart__item');

        li.innerHTML = `
            <span class="cart__item-name">${item.name}</span>
            <span class="cart__item-price">$${item.price.toLocaleString()}</span>

            <div class="cart__qty-box">
                <button class="cart__qty-btn cart__qty-minus" data-index="${index}">-</button>
                <span class="cart__item-qty">${item.qty}</span>
                <button class="cart__qty-btn cart__qty-plus" data-index="${index}">+</button>
            </div>

            <img src="img/trash_3693822.png" class="cart__remove" data-index="${index}">
        `;

        cartList.appendChild(li);
    });

    totalDisplay.textContent = '$' + total.toLocaleString();

    cartCounter.textContent = totalItems;

    attachRemoveEvents();
    attachQtyEvents();
}

// Eventos para eliminar producto completo
function attachRemoveEvents() {
    document.querySelectorAll('.cart__remove').forEach(btn => {
        btn.addEventListener('click', e => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });
    });
}

// Eventos para + y -
function attachQtyEvents() {
    // Botón +
    document.querySelectorAll('.cart__qty-plus').forEach(btn => {
    btn.addEventListener('click', e => {
        const index = e.target.dataset.index;

        if (cart[index].qty >= 2) {
    showCartMessage("No hay más artículos disponibles: solo quedan 2", "error");
    return;
    }


        cart[index].qty++;
        saveCart();
        renderCart();
    });
});


    // Botón -
    document.querySelectorAll('.cart__qty-minus').forEach(btn => {
        btn.addEventListener('click', e => {
            const index = e.target.dataset.index;

            if (cart[index].qty > 1) {
                cart[index].qty--;
            } else {
                // Si llega a 0, eliminar el producto
                cart.splice(index, 1);
            }

            saveCart();
            renderCart();
        });
    });
}

// Eliminar todo desde el icono basura general
trashBtn.addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
});

// Guardar al localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Inicializar
renderCart();
