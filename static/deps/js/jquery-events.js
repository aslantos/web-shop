// Когда HTML-документ готов
$(document).ready(function () {
    const NOTIFICATION_TIMEOUT = 7000; // Константа для времени показа оповещения

    // Получаем элемент оповещения по ID
    const notification = $('#notification');
    // Убираем оповещение через заданное время с плавным исчезновением
    if (notification.length > 0) {
        setTimeout(() => {
            notification.fadeOut(500, () => {
                notification.alert('close');
            });
        }, NOTIFICATION_TIMEOUT);
    }

    // Обработчик клика по значку корзины для открытия модального окна
    const modalButton = $('#modalButton');
    if (modalButton.length > 0) {
        modalButton.on('click', () => {
            const modal = $('#exampleModal');
            if (modal.length > 0) {
                modal.appendTo('body');
                modal.fadeIn(300); // Плавное появление
                modal.modal('show');
            } else {
                console.error('Modal element not found.');
            }
        });
    } else {
        console.error('Modal button not found.');
    }

    // Обработчик клика по кнопке закрытия модального окна
    const closeModalButton = $('#exampleModal .btn-close');
    if (closeModalButton.length > 0) {
        closeModalButton.on('click', () => {
            const modal = $('#exampleModal');
            modal.fadeOut(300, () => { // Плавное исчезновение
                modal.modal('hide');
            });
        });
    }

    // Обработчик изменения состояния радиокнопки выбора способа доставки
    $("input[name='requires_delivery']").on('change', function () {
        const selectedValue = $(this).val();
        const deliveryField = $("#deliveryAddressField"); // Поле ввода адреса доставки

        if (selectedValue === "1") {
            deliveryField.slideDown(300).addClass('visible'); // Плавное появление
        } else {
            deliveryField.slideUp(300, () => {
                deliveryField.removeClass('visible'); // Плавное исчезновение
            });
        }
    });

    // Переключение темной темы
    const themeToggle = $('#themeToggle');
    if (themeToggle.length > 0) {
        themeToggle.on('click', () => {
            $('body').toggleClass('dark-theme');
        });
    }
});
