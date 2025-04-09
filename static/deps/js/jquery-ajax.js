// Когда HTML-документ готов (полностью загружен и прорисован)
$(document).ready(function () {
    // Берем элемент разметки с id jq-notification для отображения сообщений от AJAX
    var successMessage = $("#jq-notification");

    // Обработчик события для кнопки "Добавить в корзину"
    $(document).on("click", ".add-to-cart", function (e) {
        // Блокируем стандартное поведение кнопки
        e.preventDefault();

        // Получаем элемент счетчика товаров в корзине и его текущее значение
        var goodsInCartCount = $("#goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.text() || 0);

        // Берем ID товара из атрибута data-product-id
        var product_id = $(this).data("product-id");

        // Из атрибута href берем ссылку на контроллер Django
        var add_to_cart_url = $(this).attr("href");

        // Выполняем POST-запрос через AJAX без перезагрузки страницы
        $.ajax({
            type: "POST",
            url: add_to_cart_url,
            data: {
                product_id: product_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(), // CSRF токен
            },
            success: function (data) {
                // Отображаем сообщение об успехе
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Обновляем количество товаров в корзине
                cartCount++;
                goodsInCartCount.text(cartCount);

                // Обновляем содержимое корзины новым фрагментом разметки
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);
            },
            error: function () {
                // Логируем ошибку в консоль
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });

    // Обработчик события для кнопки "Удалить из корзины"
    $(document).on("click", ".remove-from-cart", function (e) {
        e.preventDefault();

        // Получаем элемент счетчика и его текущее значение
        var goodsInCartCount = $("#goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.text() || 0);

        // Берем ID корзины и ссылку на контроллер Django
        var cart_id = $(this).data("cart-id");
        var remove_from_cart = $(this).attr("href");

        $.ajax({
            type: "POST",
            url: remove_from_cart,
            data: {
                cart_id: cart_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(), // CSRF токен
            },
            success: function (data) {
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине
                cartCount -= data.quantity_deleted;
                goodsInCartCount.text(cartCount);

                // Обновляем содержимое корзины
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);
            },
            error: function () {
                console.log("Ошибка при удалении товара из корзины");
            },
        });
    });

    // Обработчик события для уменьшения количества товара
    $(document).on("click", ".decrement", function () {
        var url = $(this).data("cart-change-url");
        var cartID = $(this).data("cart-id");
        var $input = $(this).closest('.input-group').find('.number');
        var currentValue = parseInt($input.val());

        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Вызываем функцию обновления корзины
            updateCart(cartID, currentValue - 1, -1, url);
        }
    });

    // Обработчик события для увеличения количества товара
    $(document).on("click", ".increment", function () {
        var url = $(this).data("cart-change-url");
        var cartID = $(this).data("cart-id");
        var $input = $(this).closest('.input-group').find('.number');
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);
        // Вызываем функцию обновления корзины
        updateCart(cartID, currentValue + 1, 1, url);
    });

    // Функция обновления корзины
    function updateCart(cartID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                cart_id: cartID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(), // CSRF токен
            },
            success: function (data) {
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Обновляем количество товаров в корзине
                var goodsInCartCount = $("#goods-in-cart-count");
                var cartCount = parseInt(goodsInCartCount.text() || 0);
                cartCount += change;
                goodsInCartCount.text(cartCount);

                // Обновляем содержимое корзины
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);
            },
            error: function () {
                console.log("Ошибка при обновлении корзины");
            },
        });
    }
});
