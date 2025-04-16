// Когда HTML-документ готов (полностью загружен и прорисован)
$(document).ready(function () {
    var successMessage = $("#jq-notification");

    // Включаем индикатор загрузки для AJAX-запросов
    $(document).ajaxStart(function () {
        $(".add-to-cart, .remove-from-cart, .increment, .decrement").prop("disabled", true);
    }).ajaxStop(function () {
        $(".add-to-cart, .remove-from-cart, .increment, .decrement").prop("disabled", false);
    });

    // Функция для отображения сообщений
    function showMessage(message) {
        successMessage.html(message);
        successMessage.fadeIn(400);
        setTimeout(function () {
            successMessage.fadeOut(400);
        }, 7000);
    }

    // Функция для обновления содержимого корзины
    function updateCartContent(html) {
        var cartItemsContainer = $("#cart-items-container");
        cartItemsContainer.html(html);
    }

    // Обработчик события для кнопки "Добавить в корзину"
    $(document).on("click", ".add-to-cart", function (e) {
        e.preventDefault();

        var goodsInCartCount = $("#goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.text() || 0);
        var product_id = $(this).data("product-id");
        var add_to_cart_url = $(this).attr("href");

        // Валидация данных
        if (!product_id || !add_to_cart_url) {
            console.log("Некорректные данные для добавления в корзину");
            return;
        }

        $.ajax({
            type: "POST",
            url: add_to_cart_url,
            data: {
                product_id: product_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                showMessage(data.message);
                cartCount++;
                goodsInCartCount.text(cartCount);
                updateCartContent(data.cart_items_html);
            },
            error: function (xhr, status, error) {
                showMessage("Произошла ошибка: " + error);
                console.log("Ошибка: " + error);
            },
        });
    });

    // Обработчик события для кнопки "Удалить из корзины"
    $(document).on("click", ".remove-from-cart", function (e) {
        e.preventDefault();

        var goodsInCartCount = $("#goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.text() || 0);
        var cart_id = $(this).data("cart-id");
        var remove_from_cart = $(this).attr("href");

        if (!cart_id || !remove_from

