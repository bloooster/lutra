// ========== CART SYSTEM WITH LOCALSTORAGE ==========

/**
 * Инициализирует корзину - вызывает функцию обновления бейджа
 */
function initCart() {
    updateCartBadge();
}

/**
 * Добавляет товар в корзину или увеличивает количество
 * @param {Object} product - Объект товара {id, title, price, image, description}
 */
function addToCart(product) {
    let cart = getCart();
    
    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Если товар есть, увеличиваем количество
        existingItem.quantity += 1;
    } else {
        // Если товара нет, добавляем с количеством 1
        product.quantity = 1;
        cart.push(product);
    }
    
    // Сохраняем обновленную корзину
    saveCart(cart);
    updateCartBadge();
}

/**
 * Удаляет товар из корзины
 * @param {number} productId - ID товара для удаления
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
}

/**
 * Обновляет количество товара в корзине
 * @param {number} productId - ID товара
 * @param {number} quantity - Новое количество
 */
function updateQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
            updateCartBadge();
        }
    }
}

/**
 * Получает корзину из localStorage
 * @returns {Array} Массив товаров в корзине
 */
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Сохраняет корзину в localStorage
 * @param {Array} cart - Массив товаров
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Очищает всю корзину
 */
function clearCart() {
    localStorage.removeItem('cart');
    updateCartBadge();
}

/**
 * Получает общее количество товаров в корзине
 * @returns {number} Количество товаров
 */
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Обновляет бейдж с количеством товаров в корзине
 */
function updateCartBadge() {
    const cartIcon = document.querySelector('.header__cart');
    
    if (!cartIcon) return;
    
    // Удаляем существующий бейдж, если есть
    const existingBadge = document.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Получаем количество товаров
    const count = getCartCount();
    
    // Создаем и добавляем бейдж с количеством
    if (count > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = count;
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }
}

/**
 * Инициализирует корзину при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});
