let cart = [];
let total = 0;
let selectedTable = null; // Tanlangan stol

function showProducts(category) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Oldingi mahsulotlar ro'yxatini tozalang

    let products;
    if (category === 'soups') {
        products = [
            { name: 'Lagman', price: 20000 },
            { name: 'Shurva', price: 15000 },
            { name: 'Mastava', price: 12000 }
        ];
    } else if (category === 'noodles') {
        products = [
            { name: 'Tukhum-lagman', price: 25000 },
            { name: 'Kuyma lagman', price: 30000 }
        ];
    } else if (category === 'salads') {
        products = [
            { name: 'Salat olma', price: 10000 },
            { name: 'Ozbek salati', price: 15000 }
        ];
    } else if (category === 'drinks') {
        products = [
            { name: 'Chai', price: 5000 },
            { name: 'Kola', price: 7000 },
            { name: 'Suv', price: 3000 }
        ];
    }

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-item";
        productDiv.innerHTML = `
            ${product.name} - ${product.price} so'm 
            <button onclick="addToCart('${product.name}', ${product.price})">Qo'shish</button>
        `;
        productList.appendChild(productDiv);
    });
}

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCart();
}

function removeFromCart(name, price) {
    cart = cart.filter(item => item.name !== name);
    total -= price;
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";

    cart.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.innerHTML = `
            ${item.name} - ${item.price} so'm 
            <button onclick="removeFromCart('${item.name}', ${item.price})">Olib tashlash</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });

    document.getElementById("total-price").textContent = total;
}

function checkout() {
    selectedTable = document.getElementById("table-number").value; // Tanlangan stol raqamini olish

    if (!selectedTable) {
        alert("Iltimos, stol raqamini tanlang!");
        return;
    }

    const paymentMethod = prompt("To'lov usulini tanlang: Naqd pul yoki Karta");

    const orderDetails = {
        table: selectedTable,
        items: cart,
        total,
        paymentMethod
    };

    sendOrderToTelegram(orderDetails);
    alert("Buyurtma yuborildi! Raxmat!");
    resetCart();
}

function resetCart() {
    cart = [];
    total = 0;
    document.getElementById("table-number").value = ""; // Stol raqamini tozalash
    updateCart();
    document.getElementById("product-list").innerHTML = ""; // Mahsulotlar ro'yxatini tozalang
}

function sendOrderToTelegram(order) {
    const token = '7966109019:AAGF7HNBrmA-TWMZ8B3SRUNzQmr7BDdsR58'; // Bot tokenini o'rnatish
    const chatId = '@xanbs';
    const message = `
        Stol: ${order.table}
        Mahsulotlar: ${order.items.map(item => item.name).join(", ")}
        Umumiy narx: ${order.total} so'm
        To'lov usuli: ${order.paymentMethod}
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    console.log('https://t.me/xanbs:', url); // Yuborilayotgan URL ni ko'rsatish
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => console.log('Xabar yuborildi:', data))
        .catch(error => console.error('Xato:', error));
}
