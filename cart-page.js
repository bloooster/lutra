// ========== CART PAGE SCRIPT ==========

/**
 * Инициализирует страницу корзины при загрузке
 */
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    setupEventListeners();
});

/**
 * Отображает товары в корзине на странице
 */
function renderCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItemsList = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        // Показываем пустую корзину
        emptyCart.style.display = 'flex';
        cartContent.style.display = 'none';
        return;
    }
    
    // Очищаем список товаров
    cartItemsList.innerHTML = '';
    
    // Добавляем каждый товар
    cart.forEach(item => {
        const itemElement = createCartItemElement(item);
        cartItemsList.appendChild(itemElement);
    });
    
    // Показываем содержимое корзины
    emptyCart.style.display = 'none';
    cartContent.style.display = 'flex';
    
    // Обновляем итоги
    updateCartSummary();
}

/**
 * Создает HTML элемент для товара в корзине
 * @param {Object} item - Товар с всеми параметрами
 * @returns {HTMLElement} HTML элемент товара
 */
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item__image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        
        <div class="cart-item__content">
            <h3 class="cart-item__title">${item.title}</h3>
            <p class="cart-item__description">${item.description}</p>
            <p class="cart-item__price">${item.price} ₽</p>
        </div>
        
        <div class="cart-item__controls">
            <div class="quantity-control">
                <button class="quantity-btn quantity-btn--minus" data-id="${item.id}">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" data-id="${item.id}" min="1">
                <button class="quantity-btn quantity-btn--plus" data-id="${item.id}">+</button>
            </div>
            <p class="cart-item__subtotal">${item.price * item.quantity} ₽</p>
        </div>
        
        <button class="cart-item__delete" data-id="${item.id}" aria-label="Удалить товар">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    return div;
}

/**
 * Обновляет итоги в корзине
 */
function updateCartSummary() {
    const cart = getCart();
    
    let totalItems = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    document.getElementById('finalPrice').textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
}

/**
 * Устанавливает обработчики событий на странице
 */
function setupEventListeners() {
    const cartItemsList = document.getElementById('cartItems');
    
    // Обработчик для кнопок удаления товара
    cartItemsList.addEventListener('click', function(e) {
        // Удаление товара
        if (e.target.closest('.cart-item__delete')) {
            const productId = parseInt(e.target.closest('.cart-item__delete').dataset.id);
            removeFromCart(productId);
            renderCart();
            return;
        }
        
        // Уменьшение количества
        if (e.target.closest('.quantity-btn--minus')) {
            const productId = parseInt(e.target.closest('.quantity-btn--minus').dataset.id);
            const currentItem = getCart().find(item => item.id === productId);
            if (currentItem && currentItem.quantity > 1) {
                updateQuantity(productId, currentItem.quantity - 1);
                renderCart();
            }
            return;
        }
        
        // Увеличение количества
        if (e.target.closest('.quantity-btn--plus')) {
            const productId = parseInt(e.target.closest('.quantity-btn--plus').dataset.id);
            const currentItem = getCart().find(item => item.id === productId);
            if (currentItem) {
                updateQuantity(productId, currentItem.quantity + 1);
                renderCart();
            }
            return;
        }
    });
    
    // Обработчик для изменения количества вручную
    cartItemsList.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const productId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                updateQuantity(productId, newQuantity);
                renderCart();
            } else {
                renderCart(); // Перерисовываем, чтобы вернуть корректное значение
            }
        }
    });
    
    // Обработчик для кнопки оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length > 0) {
                alert('Спасибо за ваш заказ! В реальном приложении здесь была бы интеграция с платежной системой.\n\nЧасть наших товаров:\n' + cart.map(item => `${item.title} (x${item.quantity})`).join('\n'));
                // В реальном приложении здесь была бы отправка заказа на сервер
                // clearCart();
                // renderCart();
            }
        });
    }
}
