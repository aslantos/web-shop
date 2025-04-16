// Когда HTML-документ готов (полностью загружен и прорисован)
$(document).ready(function () {
    var successMessage = $("#jq-notification");

    // Включаем индикатор загрузки для AJAX-запросов
    $(document).ajaxStart(function () {
        $(".add-to-cart, .remove-from-cart, .increment, .decrement").addClass("loading").prop("disabled", true);
    }).ajaxStop(function () {
        $(".add-to-cart, .remove-from-cart, .increment, .decrement").removeClass("loading").prop("disabled", false);
    });

    // Функция для отображения сообщений
    function showMessage(message) {
        successMessage
            .html(message)
            .fadeIn(400)
            .css({
                "background-color": "rgba(0, 128, 0, 0.8)",
                "color": "white",
                "border-radius": "5px",
                "padding": "10px",
                "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)",
            })
            .animate({ top: "20px" }, 400)
            .delay(5000)
            .fadeOut(400, function () {
                $(this).css({ top: "-50px" });
            });
    }

    // Функция для обновления содержимого корзины
    function updateCartContent(html) {
        var cartItemsContainer = $("#cart-items-container");
        cartItemsContainer.fadeOut(200, function () {
            $(this).html(html).fadeIn(200);
        });
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
                goodsInCartCount.text(cartCount).css({
                    "font-weight": "bold",
                    "color": "green",
                }).animate({ fontSize: "1.5em" }, 300).animate({ fontSize: "1em" }, 300);
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

        if (!cart_id || !remove_from_cart) {
            console.log("Некорректные данные для удаления из корзины");
            return;
        }

        $.ajax({
            type: "POST",
            url: remove_from_cart,
            data: {
                cart_id: cart_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                showMessage(data.message);
                cartCount -= data.quantity_deleted;
                goodsInCartCount.text(cartCount).css({
                    "font-weight": "bold",
                    "color": "red",
                }).animate({ fontSize: "1.5em" }, 300).animate({ fontSize: "1em" }, 300);
                updateCartContent(data.cart_items_html);
            },
            error: function (xhr, status, error) {
                showMessage("Произошла ошибка: " + error);
                console.log("Ошибка: " + error);
            },
        });
    });
});
