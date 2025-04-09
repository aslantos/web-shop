// Когда HTML-документ готов
$(document).ready(function () {
    const NOTIFICATION_TIMEOUT = 7000; // Константа для времени показа оповещения

    // Получаем элемент оповещения по ID
    const notification = $('#notification');
    // Убираем оповещение через заданное время
    if (notification.length > 0) {
        setTimeout(() => {
            notification.alert('close');
        }, NOTIFICATION_TIMEOUT);
    }

    // Обработчик клика по значку корзины для открытия модального окна
    $('#modalButton').on('click', () => {
        const modal = $('#exampleModal');
        modal.appendTo('body'); // Переносим модальное окно в конец body
        modal.modal('show'); // Показываем модальное окно
    });

    // Обработчик клика по кнопке закрытия модального окна
    $('#exampleModal .btn-close').on('click', () => {
        $('#exampleModal').modal('hide'); // Закрываем модальное окно
    });

    // Обработчик изменения состояния радиокнопки выбора способа доставки
    $("input[name='requires_delivery']").on('change', function () {
        const selectedValue = $(this).val();
        const deliveryField = $("#deliveryAddressField"); // Поле ввода адреса доставки

        if (selectedValue === "1") {
            deliveryField.addClass('visible'); // Добавляем CSS-класс для отображения
        } else {
            deliveryField.removeClass('visible'); // Убираем CSS-класс для скрытия
        }
    });
});
