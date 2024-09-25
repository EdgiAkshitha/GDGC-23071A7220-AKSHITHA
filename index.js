const cart = [];

const productListElement = document.getElementById('product-list');
const cartItemsElement = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        let products = await response.json();
        products = products.slice(0, 4); 
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    productListElement.innerHTML = ''; 

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        productListElement.appendChild(productCard);
    });
}

function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, name, price, image, quantity: 1 });
    }

    updateCart();
}
function updateCart() {
    cartItemsElement.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <div class="cart-controls">
                <button onclick="changeQuantity(${item.productId}, -1)">-</button>
                <button onclick="changeQuantity(${item.productId}, 1)">+</button>
            </div>
        `;
        cartItemsElement.appendChild(cartItem);

        subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = subtotal.toFixed(2);
    totalElement.textContent = subtotal.toFixed(2);
}
function changeQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }

        updateCart();
    }
}

fetchProducts();

